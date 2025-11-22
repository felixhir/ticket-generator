import { createContext, useCallback, useContext, useState } from 'react'

export enum currency {
    EUR,
    USD,
    SEK
}

export type Layout = 'default' | 'compact' | 'picture'

export type BackgroundPattern = 'lines' | 'blocks' | 'hearts'

interface TicketData {
    title: string
    tour: string
    band: string
    venue: string
    address: string
    datetime: Date | null
    seatType: string
    barcode: string
    price: number
    image: string | null
    currency: currency
    ticketCount: number
    layout: Layout
    backgroundPattern: BackgroundPattern
}

const TicketContext = createContext<{
    data: TicketData
    setData: (d: Partial<TicketData>) => void
} | null>(null)

export function TicketProvider({ children }: { children: React.ReactNode }) {
    const [data, setDataState] = useState<TicketData>({
        title: 'Your Awesome Event',
        tour: 'Final World Tour',
        band: 'Slayer',
        venue: 'Hanns-Martin-Schleyer-Halle',
        address: 'Mercedesstraße 69\n70372 Stuttgart',
        datetime: new Date('2019-08-03T21:00:00.000Z'),
        seatType: 'standing ticket',
        barcode: 'My Event',
        price: 69.0,
        image: null,
        currency: currency.EUR,
        layout: 'default',
        ticketCount: 1,
        backgroundPattern: 'lines'
    })

    const setData = useCallback((d: Partial<TicketData>) => setDataState(prev => ({ ...prev, ...d })), [setDataState])

    return <TicketContext.Provider value={{ data, setData }}>{children}</TicketContext.Provider>
}

export const useTicket = () => {
    const ctx = useContext(TicketContext)
    if (!ctx) throw new Error('useTicket must be used inside TicketProvider')
    return ctx
}
