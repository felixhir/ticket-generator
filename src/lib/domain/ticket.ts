import { currency } from './currency'

export { currency }

export interface TicketContent {
    title: string
    subtitle: string
    venue: string
    address: string
    datetime: Date | null
    seatType: string
    barcode: string
    price: number
    currency: currency
}

export const defaultTicketContent: TicketContent = {
    title: '',
    subtitle: '',
    venue: '',
    address: '',
    datetime: null,
    seatType: '',
    barcode: '',
    price: 0,
    currency: currency.EUR
}

export function cloneTicketContent(content: TicketContent): TicketContent {
    return {
        ...content,
        datetime: content.datetime ? new Date(content.datetime) : null
    }
}
