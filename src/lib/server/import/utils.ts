import { currency } from '@/lib/domain/currency'
import { logServerInfo } from '@/lib/server/log'

export function mapCurrency(code: string | undefined): currency {
    const normalized = code?.toUpperCase()
    if (normalized && normalized in currency) {
        return currency[normalized as keyof typeof currency]
    }
    return currency.EUR
}

export function serializeTicketData<T extends { datetime: Date | null }>(data: T) {
    return {
        ...data,
        datetime: data.datetime?.toISOString() ?? null
    }
}

export function sanitizeUrl(value: string) {
    try {
        const url = new URL(value)
        if (url.searchParams.has('apikey')) url.searchParams.set('apikey', '[redacted]')
        return url.toString()
    } catch {
        return value.replace(/apikey=[^&]+/gi, 'apikey=[redacted]')
    }
}

export function summarizeTicketData(data: {
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

export function logImport(importId: string, step: string, data: Record<string, unknown> = {}) {
    logServerInfo('import', { importId, step, ...data })
}
