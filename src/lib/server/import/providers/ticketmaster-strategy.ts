import { currency } from '@/lib/domain/currency'
import { importOutboundHeaders } from '@/lib/server/import/outbound-headers'
import type { ImportContext, ImportedTicketData, ImportProviderStrategy } from '@/lib/server/import/types'
import { logImport, mapCurrency, sanitizeUrl, summarizeTicketData } from '@/lib/server/import/utils'

const TICKETMASTER_DISCOVERY_API = 'https://app.ticketmaster.com/discovery/v2/events.json'
const TICKETMASTER_INTERNATIONAL_API = 'https://app.ticketmaster.eu/mfxapi/v2'
const TICKETMASTER_API_TIMEOUT_MS = 5000
// Public developer apps are usually approved for the global Discovery API only;
// the legacy International API returns 401 unless that product is explicitly enabled for the key.
const TICKETMASTER_INTERNATIONAL_API_ENABLED = process.env.TICKETMASTER_ENABLE_INTERNATIONAL_API === 'true'

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

type TicketmasterInternationalResponse = {
    events?: TicketmasterInternationalEvent[]
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

type TicketmasterInternationalEvent = {
    id?: string
    name?: string
    url?: string
    eventdate?: {
        value?: string
    }
    local_event_date?: string
    localeventdate?: string
    venue?: {
        name?: string
        location?: {
            address?: {
                address?: string
                postal_code?: string
                city?: string
                country?: string
            }
        }
    }
    attractions?: {
        name?: string
    }[]
    categories?: {
        name?: string
        subcategories?: {
            name?: string
        }[]
    }[]
    price_ranges?: {
        including_ticket_fees?: {
            min?: number
        }
        excluding_ticket_fees?: {
            min?: number
        }
    }
    currency?: string
}

export const ticketmasterStrategy: ImportProviderStrategy = {
    id: 'ticketmaster',
    preferUrlImport: true,
    matchesHost: isTicketmasterHost,
    importFromUrl: tryImportTicketmasterDiscovery,
    fallbackFromUrl: tryImportTicketmasterUrlFallback
}

function isTicketmasterHost(hostname: string) {
    return hostname.includes('ticketmaster.')
}

async function tryImportTicketmasterDiscovery({ url, importId }: ImportContext): Promise<ImportedTicketData | null> {
    if (!isTicketmasterHost(url.hostname)) return null

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

    if (TICKETMASTER_INTERNATIONAL_API_ENABLED) {
        const internationalEvent = await findTicketmasterInternationalEvent(urlParts, apiKey, importId)
        if (internationalEvent) {
            const mapped = mapTicketmasterInternationalEvent(internationalEvent, urlParts)
            logImport(importId, 'resolver.ticketmaster-international.success', summarizeTicketData(mapped))
            return mapped
        }
    }

    const params = new URLSearchParams({
        apikey: apiKey,
        keyword: urlParts.searchTerm,
        countryCode: 'DE',
        locale: '*',
        size: '10'
    })

    if (urlParts.date) {
        params.set('localStartEndDateTime', `${urlParts.date}T00:00:00,${urlParts.date}T23:59:59`)
    }

    const requestUrl = `${TICKETMASTER_DISCOVERY_API}?${params.toString()}`
    logImport(importId, 'api.ticketmaster-discovery.start', { url: sanitizeUrl(requestUrl) })
    let res: Response
    try {
        res = await fetch(requestUrl, {
            signal: AbortSignal.timeout(TICKETMASTER_API_TIMEOUT_MS),
            headers: importOutboundHeaders({
                Accept: 'application/json',
                Origin: 'https://www.ticketmaster.de',
                Referer: 'https://www.ticketmaster.de/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
            })
        })
    } catch (err) {
        logImport(importId, 'api.ticketmaster-discovery.exception', {
            message: err instanceof Error ? err.message : 'unknown error'
        })
        return null
    }
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

function tryImportTicketmasterUrlFallback(url: URL): ImportedTicketData | null {
    if (!isTicketmasterHost(url.hostname)) return null
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

async function findTicketmasterInternationalEvent(
    urlParts: TicketmasterUrlParts,
    apiKey: string,
    importId: string
): Promise<TicketmasterInternationalEvent | null> {
    if (!/^\d+$/.test(urlParts.id)) {
        logImport(importId, 'resolver.ticketmaster-international.skip', { reason: 'non-numeric-event-id' })
        return null
    }

    const params = new URLSearchParams({
        apikey: apiKey,
        domain: 'germany',
        lang: 'de-de'
    })
    const requestUrl = `${TICKETMASTER_INTERNATIONAL_API}/events/${encodeURIComponent(urlParts.id)}?${params.toString()}`
    logImport(importId, 'api.ticketmaster-international.start', { url: sanitizeUrl(requestUrl) })

    let res: Response
    try {
        res = await fetch(requestUrl, {
            signal: AbortSignal.timeout(TICKETMASTER_API_TIMEOUT_MS),
            headers: importOutboundHeaders({
                Accept: 'application/json',
                Origin: 'https://www.ticketmaster.de',
                Referer: 'https://www.ticketmaster.de/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
            })
        })
    } catch (err) {
        logImport(importId, 'api.ticketmaster-international.exception', {
            message: err instanceof Error ? err.message : 'unknown error'
        })
        return null
    }

    logImport(importId, 'api.ticketmaster-international.end', { status: res.status, ok: res.ok })
    if (!res.ok) return null

    const data = (await res.json()) as TicketmasterInternationalResponse | TicketmasterInternationalEvent
    const events = getTicketmasterInternationalEvents(data)
    logImport(importId, 'api.ticketmaster-international.body', { events: events.length })

    return events.find(event => event.id === urlParts.id) ?? events[0] ?? null
}

function getTicketmasterInternationalEvents(
    data: TicketmasterInternationalResponse | TicketmasterInternationalEvent
): TicketmasterInternationalEvent[] {
    if ('events' in data && Array.isArray(data.events)) return data.events
    if ('id' in data || 'name' in data) return [data]
    return []
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

function mapTicketmasterEvent(event: TicketmasterEvent, urlParts: TicketmasterUrlParts): ImportedTicketData {
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

function mapTicketmasterInternationalEvent(
    event: TicketmasterInternationalEvent,
    urlParts: TicketmasterUrlParts
): ImportedTicketData {
    const venue = event.venue
    const addressFields = venue?.location?.address
    const address = [
        addressFields?.address,
        [addressFields?.postal_code, addressFields?.city].filter(Boolean).join(' ')
    ]
        .filter(Boolean)
        .join('\n')
    const subtitle =
        event.attractions
            ?.map(attraction => attraction.name)
            .filter(Boolean)
            .join(', ') || ''
    const priceRange = event.price_ranges?.including_ticket_fees ?? event.price_ranges?.excluding_ticket_fees

    return {
        title: event.name || urlParts.title,
        subtitle,
        venue: venue?.name || '',
        address,
        datetime: parseTicketmasterInternationalDate(event),
        price: priceRange?.min ?? 0,
        currency: mapCurrency(event.currency),
        seatType:
            urlParts.seatType ||
            event.categories?.at(-1)?.subcategories?.at(-1)?.name ||
            event.categories?.at(-1)?.name ||
            ''
    }
}

function parseTicketmasterInternationalDate(event: TicketmasterInternationalEvent) {
    const value = event.eventdate?.value || event.local_event_date || event.localeventdate
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

function parseTicketmasterUrl(url: URL): TicketmasterUrlParts | null {
    if (!isTicketmasterHost(url.hostname)) return null

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
