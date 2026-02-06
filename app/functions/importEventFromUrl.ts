import { currency } from '../contexts/TicketContext'

const CORS_PROXY = 'https://corsproxy.io/?'

export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export async function importEventFromUrl(url: string) {
    const cleanUrl = new URL(url)
    cleanUrl.search = ''
    const res = await fetch(CORS_PROXY + encodeURIComponent(cleanUrl.toString()))
    if (!res.ok) throw new Error(`Failed to fetch page (${res.status})`)

    const html = await res.text()
    return extractEventData(html)
}

function extractEventData(html: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const scripts = doc.querySelectorAll('script[type="application/ld+json"]')

    for (const script of scripts) {
        try {
            const data = JSON.parse(script.textContent || '')
            if (data['@type']?.includes('Event')) return mapToTicketData(data)
        } catch {
            continue
        }
    }

    throw new Error('No event data found on this page')
}

function mapCurrency(code: string | undefined): currency {
    switch (code?.toUpperCase()) {
        case 'USD':
            return currency.USD
        case 'SEK':
            return currency.SEK
        default:
            return currency.EUR
    }
}

function mapToTicketData(data: Record<string, unknown>) {
    const location = data.location as Record<string, unknown> | undefined
    const address = location?.address as Record<string, string> | undefined

    const addressParts = [
        address?.streetAddress,
        [address?.postalCode, address?.addressLocality].filter(Boolean).join(' ')
    ]
        .filter(Boolean)
        .join('\n')

    const rawOffers = data.offers
    const firstOffer = Array.isArray(rawOffers) ? rawOffers[0] : rawOffers
    const typed = firstOffer as Record<string, unknown> | undefined
    const itemOffered = typed?.itemOffered as Record<string, unknown> | undefined
    const innerOffers = itemOffered?.offers as Record<string, unknown>[] | undefined
    const offer = innerOffers?.[0] ?? typed

    return {
        title: (data.name as string) || '',
        venue: (location?.name as string) || '',
        address: addressParts,
        datetime: data.startDate ? new Date(data.startDate as string) : null,
        price: offer?.price ? Number(offer.price) : 0,
        currency: mapCurrency(offer?.priceCurrency as string | undefined),
        seatType: (offer?.category as string) || ''
    }
}
