import { Layout } from '../contexts/DesignContext'

/**
 * Gets the default dimensions for a given layout
 */
export default function getLayoutDimensions(layout: Layout): Dimensions {
    switch (layout) {
        case 'default':
            return { long: 20, short: 7.5 }
        case 'picture':
            return { long: 15, short: 7.5 }
        case 'band':
            return { long: 18, short: 7 }
        default:
            throw new Error('Unknown layout type')
    }
}

export type Dimensions = {
    long: number
    short: number
}
