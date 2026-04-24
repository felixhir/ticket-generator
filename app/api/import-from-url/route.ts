import { NextResponse } from 'next/server'

import { findEventInJsonLd, mapCurrency, mapEventToTicketData } from '../../functions/eventMapping'
import { currency } from '../../lib/currency'

const CORS_PROXY = 'https://corsproxy.io/?'
const JINA_READER = 'https://r.jina.ai/'
const EVENTIM_API = 'https://public-api.eventim.com/websearch/search/api/exploration/v1/products'
const TICKETMASTER_API = 'https://app.ticketmaster.com/discovery/v2/events.json'

const germanMonths: Record<string, number> = {
    januar: 0,
    jan: 0,
    februar: 1,
    feb: 1,
    maerz: 2,
    märz: 2,
    mar: 2,
    april: 3,
    apr: 3,
    mai: 4,
    may: 4,
    juni: 5,
    jun: 5,
    juli: 6,
    jul: 6,
    august: 7,
    aug: 7,
    september: 8,
    sep: 8,
    oktober: 9,
    oct: 9,
    okt: 9,
    november: 10,
    nov: 10,
    dezember: 11,
    dec: 11,
    dez: 11
}

export async function POST(request: Request) {
    const importId = crypto.randomUUID()
    try {
        const body = (await request.json()) as { url?: unknown }
        if (typeof body.url !== 'string') {
            logImport(importId, 'request.invalid', { reason: 'missing-url' })
            return NextResponse.json({ error: 'Missing event URL' }, { status: 400 })
        }

        logImport(importId, 'request.start', { url: body.url })
        const data = await importEventFromUrl(body.url, importId)
        logImport(importId, 'request.success', summarizeTicketData(data))
        return NextResponse.json(serializeTicketData(data))
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to import event data'
        logImport(importId, 'request.error', { message })
        return NextResponse.json({ error: message }, { status: 400 })
    }
}

async function importEventFromUrl(url: string, importId: string) {
    const cleanUrl = new URL(url)
    cleanUrl.search = ''
    logImport(importId, 'resolver.normalized-url', { url: cleanUrl.toString(), host: cleanUrl.hostname })

    const ticketmasterData = await importTicketmasterEvent(cleanUrl, importId)
    if (ticketmasterData) return ticketmasterData

    try {
        const html = await fetchPageText(cleanUrl.toString(), importId)
        const event = findEventInHtml(html)
        if (event) {
            const data = mapEventToTicketData(event)
            logImport(importId, 'resolver.json-ld.success', summarizeTicketData(data))
            return data
        }
        logImport(importId, 'resolver.json-ld.no-event')
    } catch (err) {
        logImport(importId, 'resolver.page-fetch.error', {
            message: err instanceof Error ? err.message : 'unknown error'
        })
        const providerData = await importProviderEvent(cleanUrl, importId)
        if (providerData) return providerData
        throw new Error('Failed to fetch page')
    }

    const providerData = await importProviderEvent(cleanUrl, importId)
    if (providerData) return providerData

    const ticketmasterFallback = mapTicketmasterUrl(cleanUrl)
    if (ticketmasterFallback) {
        logImport(importId, 'resolver.ticketmaster-url-fallback.success', summarizeTicketData(ticketmasterFallback))
        return ticketmasterFallback
    }

    throw new Error('No event data found on this page')
}

async function fetchPageText(url: string, importId: string) {
    const urls = [
        { name: 'corsproxy', url: CORS_PROXY + encodeURIComponent(url) },
        { name: 'jina-reader', url: JINA_READER + url }
    ]
    let lastStatus = 0

    for (const candidate of urls) {
        try {
            logImport(importId, 'api.page-fetch.start', { provider: candidate.name, url: sanitizeUrl(candidate.url) })
            const res = await fetch(candidate.url)
            lastStatus = res.status
            logImport(importId, 'api.page-fetch.end', { provider: candidate.name, status: res.status, ok: res.ok })
            if (res.ok) {
                const text = await res.text()
                logImport(importId, 'api.page-fetch.body', { provider: candidate.name, bytes: text.length })
                return text
            }
        } catch (err) {
            logImport(importId, 'api.page-fetch.exception', {
                provider: candidate.name,
                message: err instanceof Error ? err.message : 'unknown error'
            })
            continue
        }
    }

    throw new Error(lastStatus ? `Failed to fetch page (${lastStatus})` : 'Failed to fetch page')
}

function findEventInHtml(html: string) {
    for (const json of findJsonLdScriptContents(html)) {
        try {
            const data = JSON.parse(json)
            const event = findEventInJsonLd(data)
            if (event) return event
        } catch {
            continue
        }
    }

    return null
}

function findJsonLdScriptContents(html: string) {
    return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match =>
        decodeHtmlEntities(match[1].trim())
    )
}

function decodeHtmlEntities(value: string) {
    return value
        .replaceAll('&quot;', '"')
        .replaceAll('&#34;', '"')
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
}

async function importProviderEvent(url: URL, importId: string) {
    if (url.hostname.includes('eventim.')) return importEventimEvent(url, importId)
    return null
}

async function importTicketmasterEvent(url: URL, importId: string) {
    if (!url.hostname.includes('ticketmaster.')) return null

    const apiKey = process.env.TICKETMASTER_API_KEY
    const urlParts = parseTicketmasterUrl(url)
    if (!urlParts) {
        logImport(importId, 'resolver.ticketmaster.skip', { reason: 'unparseable-url' })
        return null
    }

    logImport(importId, 'resolver.ticketmaster.parsed-url', urlParts)

    if (!apiKey) {
        logImport(importId, 'resolver.ticketmaster.skip', { reason: 'missing-ticketmaster-api-key' })
        return null
    }

    const params = new URLSearchParams({
        apikey: apiKey,
        keyword: urlParts.searchTerm,
        countryCode: 'DE',
        source: 'ticketmaster',
        locale: 'de-de,*',
        size: '10'
    })

    if (urlParts.date) {
        params.set('localStartEndDateTime', `${urlParts.date}T00:00:00,${urlParts.date}T23:59:59`)
    }

    const requestUrl = `${TICKETMASTER_API}?${params.toString()}`
    logImport(importId, 'api.ticketmaster-discovery.start', { url: sanitizeUrl(requestUrl) })
    const res = await fetch(requestUrl, { headers: { Accept: 'application/json' } })
    logImport(importId, 'api.ticketmaster-discovery.end', { status: res.status, ok: res.ok })
    if (!res.ok) return null

    const data = (await res.json()) as TicketmasterSearchResponse
    logImport(importId, 'api.ticketmaster-discovery.body', { events: data._embedded?.events?.length ?? 0 })
    const event = findBestTicketmasterEvent(data._embedded?.events, urlParts)
    if (!event) {
        logImport(importId, 'resolver.ticketmaster-discovery.no-match')
        return null
    }

    const mapped = mapTicketmasterEvent(event, urlParts)
    logImport(importId, 'resolver.ticketmaster-discovery.success', summarizeTicketData(mapped))
    return mapped
}

function findBestTicketmasterEvent(events: TicketmasterEvent[] | undefined, urlParts: TicketmasterUrlParts) {
    if (!events?.length) return null

    const directMatch = events.find(event => urlParts.id && event.url?.includes(urlParts.id))
    if (directMatch) return directMatch

    const searchWords = new Set(
        urlParts.searchTerm
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length > 2)
    )
    return [...events].sort(
        (a, b) => scoreTicketmasterEvent(b, urlParts, searchWords) - scoreTicketmasterEvent(a, urlParts, searchWords)
    )[0]
}

function scoreTicketmasterEvent(event: TicketmasterEvent, urlParts: TicketmasterUrlParts, searchWords: Set<string>) {
    let score = 0
    const name = event.name.toLowerCase()

    for (const word of searchWords) {
        if (name.includes(word)) score += 1
    }

    if (urlParts.date && event.dates?.start?.localDate === urlParts.date) score += 5
    if (event.url?.includes(urlParts.id)) score += 10

    return score
}

function mapTicketmasterEvent(event: TicketmasterEvent, urlParts: TicketmasterUrlParts) {
    const venue = event._embedded?.venues?.[0]
    const subtitle = event._embedded?.attractions
        ?.map(attraction => attraction.name)
        .filter(Boolean)
        .join(', ')
    const city = venue?.city?.name
    const priceRange = event.priceRanges?.[0]
    const localDate = event.dates?.start?.localDate
    const localTime = event.dates?.start?.localTime
    const datetime = localDate
        ? new Date(`${localDate}T${localTime || '00:00:00'}`)
        : event.dates?.start?.dateTime
          ? new Date(event.dates.start.dateTime)
          : null

    const address = [venue?.address?.line1, [venue?.postalCode, city].filter(Boolean).join(' ')]
        .filter(Boolean)
        .join('\n')

    return {
        title: event.name || urlParts.title,
        subtitle: subtitle || '',
        venue: venue?.name || '',
        address,
        datetime,
        price: priceRange?.min ?? 0,
        currency: mapCurrency(priceRange?.currency),
        seatType: urlParts.seatType || priceRange?.type || ''
    }
}

async function importEventimEvent(url: URL, importId: string) {
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
        return null
    }

    const event = product.typeAttributes?.liveEntertainment
    const location = event?.location
    const address = [location?.street, [location?.postalCode, location?.city].filter(Boolean).join(' ')]
        .filter(Boolean)
        .join('\n')

    const mapped = {
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
        const res = await fetch(requestUrl, { headers: { Accept: 'application/json' } })
        logImport(importId, 'api.eventim-search.end', { status: res.status, ok: res.ok, searchTerm })
        if (!res.ok) continue

        const data = (await res.json()) as { products?: EventimProduct[] }
        logImport(importId, 'api.eventim-search.body', { searchTerm, products: data.products?.length ?? 0 })
        const product = data.products?.find(item => item.productId === productId)
        if (product) return product
    }

    return null
}

function mapTicketmasterUrl(url: URL) {
    const urlParts = parseTicketmasterUrl(url)
    if (!urlParts) return null

    const datetime = urlParts.date ? parseIsoLocalDate(urlParts.date) : null

    return {
        title: urlParts.title,
        subtitle: '',
        venue: '',
        address: '',
        datetime,
        price: 0,
        currency: currency.EUR,
        seatType: urlParts.seatType
    }
}

function parseTicketmasterUrl(url: URL): TicketmasterUrlParts | null {
    if (!url.hostname.includes('ticketmaster.')) return null

    const parts = url.pathname.split('/').filter(Boolean)
    const slug = parts.at(-2)
    const id = parts.at(-1) || ''
    if (!slug) return null

    const dateMatch = slug.match(/(?:^|-)(\d{1,2})-([a-zäöü]+)-(\d{4})(?:-|$)/i)
    const date = dateMatch ? parseGermanDateString(dateMatch[1], dateMatch[2], dateMatch[3]) : null
    const titleSlug = slug.replace(/-tickets$/, '').replace(/-\d{1,2}-[a-zäöü]+-\d{4}.*$/i, '')
    const title = titleCase(titleSlug.replace(/-/g, ' ')).replace(/\b(\d+) Day\b/g, '$1-Day')
    const seatType = titleSlug.includes('1-day') ? '1-Day Ticket' : ''
    const searchTerm = title
        .replace(/\b\d+-Day Ticket\b/gi, '')
        .replace(/\bTicket\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim()

    return {
        id,
        title,
        date,
        searchTerm,
        seatType
    }
}

function parseGermanDateString(day: string, month: string, year: string) {
    const monthIndex = germanMonths[month.toLowerCase()]
    if (monthIndex === undefined) return null
    const paddedMonth = String(monthIndex + 1).padStart(2, '0')
    const paddedDay = day.padStart(2, '0')
    return `${year}-${paddedMonth}-${paddedDay}`
}

function parseIsoLocalDate(value: string) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
}

function titleCase(value: string) {
    return value.replace(/\S+/g, word => {
        if (/^m\d+$/i.test(word)) return word.toUpperCase()
        if (/^\d+-day$/i.test(word)) return `${word[0]}-Day`
        return word.charAt(0).toUpperCase() + word.slice(1)
    })
}

function serializeTicketData<T extends { datetime: Date | null }>(data: T) {
    return {
        ...data,
        datetime: data.datetime?.toISOString() ?? null
    }
}

function sanitizeUrl(value: string) {
    try {
        const url = new URL(value)
        if (url.searchParams.has('apikey')) url.searchParams.set('apikey', '[redacted]')
        return url.toString()
    } catch {
        return value.replace(/apikey=[^&]+/gi, 'apikey=[redacted]')
    }
}

function summarizeTicketData(data: {
    title?: string
    subtitle?: string
    venue?: string
    address?: string
    datetime?: Date | null
    price?: number
    seatType?: string
}) {
    return {
        title: data.title,
        subtitle: data.subtitle,
        venue: data.venue,
        hasAddress: Boolean(data.address),
        datetime: data.datetime?.toISOString() ?? null,
        price: data.price,
        seatType: data.seatType
    }
}

function logImport(importId: string, step: string, data: Record<string, unknown> = {}) {
    console.info('[import-from-url]', { importId, step, ...data })
}

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

type TicketmasterUrlParts = {
    id: string
    title: string
    date: string | null
    searchTerm: string
    seatType: string
}

type TicketmasterSearchResponse = {
    _embedded?: {
        events?: TicketmasterEvent[]
    }
}

type TicketmasterEvent = {
    id?: string
    name: string
    url?: string
    dates?: {
        start?: {
            localDate?: string
            localTime?: string
            dateTime?: string
        }
    }
    priceRanges?: {
        min?: number
        currency?: string
        type?: string
    }[]
    _embedded?: {
        attractions?: {
            name?: string
        }[]
        venues?: {
            name?: string
            postalCode?: string
            city?: {
                name?: string
            }
            address?: {
                line1?: string
            }
        }[]
    }
}
