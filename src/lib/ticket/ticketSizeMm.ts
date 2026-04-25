import type { Layout } from '@/lib/domain/design'
import type { Dimensions } from '@/lib/ticket/getLayoutDimensions'

/**
 * Outer ticket size on paper (mm) from design. Matches on-screen layout:
 * default/band: width = long, height = short; picture: width = short, height = long.
 */
export function ticketOuterSizeMm(layout: Layout, d: Dimensions) {
    if (layout === 'picture') {
        return { wMm: d.short * 10, hMm: d.long * 10 }
    }
    return { wMm: d.long * 10, hMm: d.short * 10 }
}
