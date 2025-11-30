import { createContext, useCallback, useContext, useState } from 'react'

export enum currency {
    EUR,
    USD,
    SEK
}

export type Layout = 'default' | 'compact' | 'picture'

export type BackgroundPattern = 'lines' | 'blocks' | 'hearts'

interface TicketContent {
    title: string
    tour: string
    band: string
    venue: string
    address: string
    datetime: Date | null
    seatType: string
    barcode: string
    price: number
    currency: currency
}

const TicketContext = createContext<{
    data: TicketContent
    setData: (d: Partial<TicketContent>) => void
} | null>(null)

export function TicketProvider({ children }: { children: React.ReactNode }) {
    const [data, setDataState] = useState<TicketContent>({
        title: 'Your Awesome Event',
        tour: 'Final World Tour',
        band: 'Slayer',
        venue: 'Hanns-Martin-Schleyer-Halle',
        address: 'Mercedesstraße 69\n70372 Stuttgart',
        datetime: new Date('2019-08-03T21:00:00.000Z'),
        seatType: 'standing ticket',
        barcode: 'My Event',
        price: 69.0,
        currency: currency.EUR
    })

    const setData = useCallback(
        (d: Partial<TicketContent>) => setDataState(prev => ({ ...prev, ...d })),
        [setDataState]
    )

    return <TicketContext.Provider value={{ data, setData }}>{children}</TicketContext.Provider>
}

export const useTicket = () => {
    const ctx = useContext(TicketContext)
    if (!ctx) throw new Error('useTicket must be used inside TicketProvider')
    return ctx
}
