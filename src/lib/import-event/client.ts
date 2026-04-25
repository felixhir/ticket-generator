import { currency } from '@/lib/domain/currency'

type ImportedTicketData = {
    title: string
    subtitle?: string
    venue: string
    address: string
    datetime: Date | null
    price: number
    currency: currency
    seatType: string
}

type ImportedTicketResponse = Omit<ImportedTicketData, 'datetime'> & {
    datetime: string | null
}

export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export async function importEventFromUrl(url: string): Promise<ImportedTicketData> {
    const res = await fetch('/api/import-from-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    })

    const data = (await res.json()) as ImportedTicketResponse | { error?: string }

    if (!res.ok) {
        throw new Error('error' in data && data.error ? data.error : `Failed to import event (${res.status})`)
    }

    const ticketData = data as ImportedTicketResponse
    return {
        ...ticketData,
        datetime: ticketData.datetime ? new Date(ticketData.datetime) : null
    }
}
