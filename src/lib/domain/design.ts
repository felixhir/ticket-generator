import getLayoutDimensions, { type Dimensions } from '@/lib/ticket/getLayoutDimensions'

export type Layout = 'default' | 'picture' | 'band'

export enum BackgroundPattern {
    Waves = 'Waves',
    Lines = 'Lines',
    Blocks = 'Blocks',
    Hearts = 'Hearts'
}

export interface Design {
    image: string | null
    ticketCount: number
    layout: Layout
    backgroundPattern: BackgroundPattern
    dimensions: Dimensions
    bandLogo?: string
    logoDimensions: {
        width: number
        height: number
    }
}

export const defaultDesign: Design = {
    image: '/default-ticket-background.png',
    layout: 'default',
    ticketCount: 1,
    backgroundPattern: BackgroundPattern.Waves,
    dimensions: getLayoutDimensions('default'),
    bandLogo: '/slayer.png',
    logoDimensions: {
        width: 0,
        height: 0
    }
}

export function cloneDesign(design: Design): Design {
    return {
        ...design,
        dimensions: { ...design.dimensions },
        logoDimensions: { ...design.logoDimensions }
    }
}
