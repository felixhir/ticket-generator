import type { StoredTicket } from '@/lib/domain/stored-ticket'

export const TICKETS_STORAGE_KEY = 'ticket-generator:tickets:v1'

export function readStoredTickets(): StoredTicket[] {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY)
    if (!raw) return []

    try {
        const parsed = JSON.parse(raw) as unknown
        return Array.isArray(parsed) ? parsed.flatMap(normalizeStoredTicket) : []
    } catch {
        return []
    }
}

export function writeStoredTickets(tickets: StoredTicket[]) {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets))
}

function normalizeStoredTicket(value: unknown): StoredTicket[] {
    if (!value || typeof value !== 'object') return []

    const ticket = value as Partial<StoredTicket>
    if (!ticket.content || !ticket.design) return []

    const now = new Date().toISOString()

    return [
        {
            ...(ticket as StoredTicket),
            design: {
                ...(ticket.design as StoredTicket['design']),
                bandLogo: normalizeImageSource((ticket.design as StoredTicket['design']).bandLogo)
            },
            id: ticket.id || crypto.randomUUID(),
            createdAt: ticket.createdAt || now,
            updatedAt: ticket.updatedAt || now
        }
    ]
}

function normalizeImageSource(source: string | undefined) {
    if (!source || source.startsWith('/') || source.startsWith('data:') || source.startsWith('blob:')) return source
    if (/^[a-z][a-z\d+.-]*:/i.test(source)) return source

    return `/${source}`
}
