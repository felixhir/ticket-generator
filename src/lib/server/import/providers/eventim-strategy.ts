import { currency } from '@/lib/domain/currency'
import { ImportLinkNotFoundError } from '@/lib/server/import/errors'
import { importOutboundHeaders } from '@/lib/server/import/outbound-headers'
import type {
    ImportContext,
    ImportedTicketData,
    ImportProviderStrategy,
    PageTextImportContext
} from '@/lib/server/import/types'
import { logImport, sanitizeUrl, summarizeTicketData } from '@/lib/server/import/utils'

const EVENTIM_API = 'https://public-api.eventim.com/websearch/search/api/exploration/v1/products'
const EVENTIM_API_TIMEOUT_MS = 5000

type EventimProduct = {
    productId: string
    name?: string
    attractions?: { name?: string }[]
    categories?: { name?: string }[]
    priceRange?: {
        min?: number
    }
    typeAttributes?: {
        liveEntertainment?: {
            startDate?: string
            location?: {
                name?: string
                street?: string
                city?: string
                postalCode?: string
            }
        }
    }
}

export const eventimStrategy: ImportProviderStrategy = {
    id: 'eventim',
    matchesHost: isEventimHost,
    importFromPageText: detectEventimNotFoundPage,
    importFromUrl: tryImportEventim
}

function isEventimHost(hostname: string) {
    return hostname.includes('eventim.')
}

function detectEventimNotFoundPage({ pageText, importId }: PageTextImportContext): ImportedTicketData | null {
    if (/die seite wurde nicht gefunden|the page was not found|page not found/i.test(pageText)) {
        logImport(importId, 'resolver.eventim.not-found-page')
        throw new ImportLinkNotFoundError()
    }
    return null
}

async function tryImportEventim({ url, importId }: ImportContext): Promise<ImportedTicketData | null> {
    if (!isEventimHost(url.hostname)) return null

    const productId = url.pathname.match(/-(\d+)\/?$/)?.[1]
    if (!productId) {
        logImport(importId, 'resolver.eventim.skip', { reason: 'missing-product-id' })
        return null
    }

    const words = url.pathname.split('/').filter(Boolean).at(-1)?.replace(/-\d+$/, '').split('-').filter(Boolean)
    if (!words?.length) {
        logImport(importId, 'resolver.eventim.skip', { reason: 'missing-search-terms', productId })
        return null
    }

    const searchTerms = [
        ...new Set([words.join(' '), words.slice(0, 4).join(' '), words.slice(0, 2).join(' '), words[0]])
    ]
    logImport(importId, 'resolver.eventim.parsed-url', { productId, searchTerms })

    const product = await findEventimProduct(productId, searchTerms, importId)
    if (!product) {
        logImport(importId, 'resolver.eventim.no-match', { productId })
        throw new ImportLinkNotFoundError()
    }

    const event = product.typeAttributes?.liveEntertainment
    const location = event?.location
    const address = [location?.street, [location?.postalCode, location?.city].filter(Boolean).join(' ')]
        .filter(Boolean)
        .join('\n')

    const mapped: ImportedTicketData = {
        title: product.name || '',
        subtitle:
            product.attractions
                ?.map(attraction => attraction.name)
                .filter(Boolean)
                .join(', ') || '',
        venue: location?.name || '',
        address,
        datetime: event?.startDate ? new Date(event.startDate) : null,
        price: product.priceRange?.min ?? 0,
        currency: currency.EUR,
        seatType: product.categories?.at(-1)?.name || ''
    }
    logImport(importId, 'resolver.eventim.success', summarizeTicketData(mapped))
    return mapped
}

async function findEventimProduct(productId: string, searchTerms: string[], importId: string) {
    for (const searchTerm of searchTerms) {
        const params = new URLSearchParams({
            webId: 'web__eventim-de',
            language: 'de',
            page: '1',
            sort: 'DateAsc',
            top: '50',
            search_term: searchTerm
        })

        const requestUrl = `${EVENTIM_API}?${params.toString()}`
        logImport(importId, 'api.eventim-search.start', { url: sanitizeUrl(requestUrl), searchTerm })
        try {
            const res = await fetch(requestUrl, {
                signal: AbortSignal.timeout(EVENTIM_API_TIMEOUT_MS),
                headers: importOutboundHeaders({
                    Accept: 'application/json, text/plain, */*',
                    Origin: 'https://www.eventim.de',
                    Referer: 'https://www.eventim.de/',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'cross-site'
                })
            })
            logImport(importId, 'api.eventim-search.end', { status: res.status, ok: res.ok, searchTerm })
            if (!res.ok) continue

            const data = (await res.json()) as { products?: EventimProduct[] }
            logImport(importId, 'api.eventim-search.body', { searchTerm, products: data.products?.length ?? 0 })
            const product = data.products?.find(item => item.productId === productId)
            if (product) return product
        } catch (err) {
            logImport(importId, 'api.eventim-search.exception', {
                searchTerm,
                message: err instanceof Error ? err.message : 'unknown error'
            })
        }
    }

    return null
}
