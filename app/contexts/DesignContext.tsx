import { createContext, useCallback, useContext, useState } from 'react'

export enum currency {
    EUR,
    USD,
    SEK
}

export type Layout = 'default' | 'compact' | 'picture'

export type BackgroundPattern = 'lines' | 'blocks' | 'hearts'

interface Design {
    image: string | null
    ticketCount: number
    layout: Layout
    backgroundPattern: BackgroundPattern
}

const DesignContext = createContext<{
    design: Design
    setData: (d: Partial<Design>) => void
} | null>(null)

export function DesignProvider({ children }: { children: React.ReactNode }) {
    const [data, setDataState] = useState<Design>({
        image: null,
        layout: 'default',
        ticketCount: 1,
        backgroundPattern: 'lines'
    })

    const setData = useCallback((d: Partial<Design>) => setDataState(prev => ({ ...prev, ...d })), [setDataState])

    return <DesignContext.Provider value={{ design: data, setData }}>{children}</DesignContext.Provider>
}

export const useDesign = () => {
    const ctx = useContext(DesignContext)
    if (!ctx) throw new Error('useDesign must be used inside DesignProvider')
    return ctx
}
