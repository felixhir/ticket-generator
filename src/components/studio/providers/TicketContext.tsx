'use client'

import { createContext, useCallback, useContext, useState } from 'react'

import { defaultTicketContent, type TicketContent } from '@/lib/domain/ticket'

export type { TicketContent }
export { defaultTicketContent }

const TicketContext = createContext<{
    data: TicketContent
    setData: (d: Partial<TicketContent>) => void
} | null>(null)

export function TicketProvider({
    children,
    initialData = defaultTicketContent
}: {
    children: React.ReactNode
    initialData?: TicketContent
}) {
    const [data, setDataState] = useState<TicketContent>(initialData)

    const setData = useCallback((d: Partial<TicketContent>) => setDataState(prev => ({ ...prev, ...d })), [])

    return <TicketContext.Provider value={{ data, setData }}>{children}</TicketContext.Provider>
}

export const useTicket = () => {
    const ctx = useContext(TicketContext)
    if (!ctx) throw new Error('useTicket must be used inside TicketProvider')
    return ctx
}
