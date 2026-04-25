import { currency } from '@/lib/domain/currency'

export function mapCurrency(code: string | undefined): currency {
    switch (code?.toUpperCase()) {
        case 'USD':
            return currency.USD
        case 'SEK':
            return currency.SEK
        default:
            return currency.EUR
    }
}

export function mapEventToTicketData(data: Record<string, unknown>) {
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

export function findEventInJsonLd(data: unknown): Record<string, unknown> | null {
    if (Array.isArray(data)) {
        for (const item of data) {
            const found = findEventInJsonLd(item)
            if (found) return found
        }
        return null
    }

    if (!data || typeof data !== 'object') return null
    const obj = data as Record<string, unknown>
    if (obj['@type']?.toString().includes('Event')) return obj
    const graph = obj['@graph']
    if (Array.isArray(graph)) {
        for (const item of graph) {
            const found = findEventInJsonLd(item)
            if (found) return found
        }
    }
    return null
}
