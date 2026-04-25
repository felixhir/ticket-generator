'use client'

import { createContext, useCallback, useContext, useState } from 'react'

import { type Design, defaultDesign } from '@/lib/domain/design'
import getLayoutDimensions from '@/lib/ticket/getLayoutDimensions'

export type { Design, Layout } from '@/lib/domain/design'
export { BackgroundPattern, defaultDesign } from '@/lib/domain/design'

const DesignContext = createContext<{
    design: Design
    setDesign: (d: Partial<Design>) => void
} | null>(null)

export function DesignProvider({
    children,
    initialDesign = defaultDesign
}: {
    children: React.ReactNode
    initialDesign?: Design
}) {
    const [data, setDataState] = useState<Design>(initialDesign)

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
