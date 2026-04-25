import { currency, supportedCurrencies } from './currency'
import { BackgroundPattern, cloneDesign, type Design } from './design'
import type { TicketContent } from './ticket'

const MAX_TICKET_TEXT_LENGTH = 2000
const MAX_TICKET_IMAGE_SOURCE_LENGTH = 10_000_000
const MAX_TICKET_PRICE = 1_000_000
const MAX_TICKET_COUNT = 20
const MAX_TICKET_DIMENSION_CM = 100
const MAX_LOGO_DIMENSION_PX = 10_000

export type SerializableTicketContent = Omit<TicketContent, 'datetime'> & {
    datetime: string | null
}

export interface StoredTicket {
    id: string
    content: SerializableTicketContent
    design: Design
    createdAt: string
    updatedAt: string
}

export function createStoredTicket(content: TicketContent, design: Design): StoredTicket {
    const now = new Date().toISOString()
    return {
        id: crypto.randomUUID(),
        content: serializeTicketContent(content),
        design,
        createdAt: now,
        updatedAt: now
    }
}

export function serializeTicketContent(content: TicketContent): SerializableTicketContent {
    return {
        ...content,
        datetime: content.datetime ? content.datetime.toISOString() : null
    }
}

export function deserializeTicketContent(content: SerializableTicketContent): TicketContent {
    return {
        ...content,
        datetime: content.datetime ? new Date(content.datetime) : null
    }
}

export function updateStoredTicketSnapshot(
    ticket: Pick<StoredTicket, 'createdAt' | 'id'>,
    content: TicketContent,
    design: Design
): StoredTicket {
    return {
        id: ticket.id,
        content: serializeTicketContent(content),
        design: cloneDesign(design),
        createdAt: ticket.createdAt,
        updatedAt: new Date().toISOString()
    }
}

export function upsertStoredTicket(tickets: StoredTicket[], ticket: StoredTicket) {
    const index = tickets.findIndex(storedTicket => storedTicket.id === ticket.id)
    if (index === -1) return [ticket, ...tickets]

    return tickets.map(storedTicket => (storedTicket.id === ticket.id ? ticket : storedTicket))
}

export function parseStoredTicketJson(json: string): StoredTicket | null {
    try {
        const value: unknown = JSON.parse(json)
        return readStoredTicket(value)
    } catch {
        return null
    }
}

function readStoredTicket(value: unknown): StoredTicket | null {
    if (!isRecord(value)) return null
    if (!hasOnlyKeys(value, ['id', 'content', 'design', 'createdAt', 'updatedAt'])) return null
    if (!isUuid(value.id) || !isIsoDateString(value.createdAt) || !isIsoDateString(value.updatedAt)) {
        return null
    }

    const content = readSerializableTicketContent(value.content)
    const design = readDesign(value.design)
    if (!content || !design) return null

    return {
        id: value.id,
        content,
        design,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt
    }
}

function readSerializableTicketContent(value: unknown): SerializableTicketContent | null {
    if (!isRecord(value)) return null
    if (
        !hasOnlyKeys(value, [
            'title',
            'subtitle',
            'venue',
            'address',
            'datetime',
            'seatType',
            'barcode',
            'price',
            'currency'
        ])
    ) {
        return null
    }

    if (
        !isTicketText(value.title) ||
        !isTicketText(value.subtitle) ||
        !isTicketText(value.venue) ||
        !isTicketText(value.address) ||
        !isTicketText(value.seatType) ||
        !isTicketText(value.barcode) ||
        !(value.datetime === null || isIsoDateString(value.datetime)) ||
        !isPrice(value.price) ||
        !isSupportedCurrency(value.currency)
    ) {
        return null
    }

    return {
        title: value.title,
        subtitle: value.subtitle,
        venue: value.venue,
        address: value.address,
        datetime: value.datetime,
        seatType: value.seatType,
        barcode: value.barcode,
        price: value.price,
        currency: value.currency
    }
}

function readDesign(value: unknown): Design | null {
    if (!isRecord(value)) return null
    if (
        !hasOnlyKeys(
            value,
            ['image', 'ticketCount', 'layout', 'backgroundPattern', 'dimensions', 'logoDimensions'],
            ['bandLogo']
        )
    ) {
        return null
    }

    if (
        !(value.image === null || isImageSource(value.image)) ||
        !isTicketCount(value.ticketCount) ||
        !isLayout(value.layout) ||
        !isBackgroundPattern(value.backgroundPattern) ||
        !isOptionalImageSource(value.bandLogo)
    ) {
        return null
    }

    const dimensions = readDimensions(value.dimensions)
    const logoDimensions = readLogoDimensions(value.logoDimensions)
    if (!dimensions || !logoDimensions) return null

    return {
        image: value.image,
        ticketCount: value.ticketCount,
        layout: value.layout,
        backgroundPattern: value.backgroundPattern,
        dimensions,
        bandLogo: isImageSource(value.bandLogo) ? value.bandLogo : undefined,
        logoDimensions
    }
}

function readDimensions(value: unknown): Design['dimensions'] | null {
    if (
        !isRecord(value) ||
        !hasOnlyKeys(value, ['long', 'short']) ||
        !isTicketDimension(value.long) ||
        !isTicketDimension(value.short)
    ) {
        return null
    }

    return { long: value.long, short: value.short }
}

function readLogoDimensions(value: unknown): Design['logoDimensions'] | null {
    if (
        !isRecord(value) ||
        !hasOnlyKeys(value, ['width', 'height']) ||
        !isLogoDimension(value.width) ||
        !isLogoDimension(value.height)
    ) {
        return null
    }

    return { width: value.width, height: value.height }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
    return typeof value === 'string'
}

function isTicketText(value: unknown): value is string {
    return isString(value) && value.length <= MAX_TICKET_TEXT_LENGTH
}

function isImageSource(value: unknown): value is string {
    return isString(value) && value.length <= MAX_TICKET_IMAGE_SOURCE_LENGTH
}

function isOptionalImageSource(value: unknown): value is string | null | undefined {
    return value === null || value === undefined || isImageSource(value)
}

function isFiniteNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value)
}

function isIsoDateString(value: unknown): value is string {
    if (!isString(value)) return false

    try {
        return new Date(value).toISOString() === value
    } catch {
        return false
    }
}

function isUuid(value: unknown): value is string {
    return isString(value) && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(value)
}

function isPrice(value: unknown): value is number {
    return isFiniteNumber(value) && value >= 0 && value <= MAX_TICKET_PRICE
}

function isTicketCount(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= MAX_TICKET_COUNT
}

function isTicketDimension(value: unknown): value is number {
    return isFiniteNumber(value) && value > 0 && value <= MAX_TICKET_DIMENSION_CM
}

function isLogoDimension(value: unknown): value is number {
    return isFiniteNumber(value) && value >= 0 && value <= MAX_LOGO_DIMENSION_PX
}

function isSupportedCurrency(value: unknown): value is currency {
    return typeof value === 'number' && supportedCurrencies.includes(value as (typeof supportedCurrencies)[number])
}

function isLayout(value: unknown): value is Design['layout'] {
    return value === 'default' || value === 'picture' || value === 'band'
}

function isBackgroundPattern(value: unknown): value is BackgroundPattern {
    return isString(value) && Object.values(BackgroundPattern).includes(value as BackgroundPattern)
}

function hasOnlyKeys(value: Record<string, unknown>, requiredKeys: string[], optionalKeys: string[] = []) {
    const allowedKeys = new Set([...requiredKeys, ...optionalKeys])
    const keys = Object.keys(value)

    return requiredKeys.every(key => Object.hasOwn(value, key)) && keys.every(key => allowedKeys.has(key))
}
