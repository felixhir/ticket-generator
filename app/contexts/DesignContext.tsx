import { createContext, useCallback, useContext, useState } from 'react'

import getLayoutDimensions, { Dimensions } from '../functions/getLayoutDimensions'

export type Layout = 'default' | 'picture'

export enum BackgroundPattern {
    Waves = 'Waves',
    Lines = 'Lines',
    Blocks = 'Blocks',
    Hearts = 'Hearts'
}

interface Design {
    image: string | null
    ticketCount: number
    layout: Layout
    backgroundPattern: BackgroundPattern
    dimensions: Dimensions
}

const DesignContext = createContext<{
    design: Design
    setDesign: (d: Partial<Design>) => void
} | null>(null)

export function DesignProvider({ children }: { children: React.ReactNode }) {
    const [data, setDataState] = useState<Design>({
        image: null,
        layout: 'default',
        ticketCount: 1,
        backgroundPattern: BackgroundPattern.Waves,
        dimensions: getLayoutDimensions('default')
    })

    const setData = useCallback((d: Partial<Design>) => {
        setDataState(prev => {
            const newData = { ...prev, ...d }
            if (d.layout) {
                newData.dimensions = getLayoutDimensions(d.layout)
            }
            return newData
        })
    }, [])

    return <DesignContext.Provider value={{ design: data, setDesign: setData }}>{children}</DesignContext.Provider>
}

export const useDesign = () => {
    const ctx = useContext(DesignContext)
    if (!ctx) throw new Error('useDesign must be used inside DesignProvider')
    return ctx
}
