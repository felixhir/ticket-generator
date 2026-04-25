export const A4_MM = { w: 210, h: 297 } as const
export const DEFAULT_A4_MARGIN_MM = 5
export const DEFAULT_TICKET_GAP_MM = 2

export type A4PagePlan = {
    ticketsPlaced: number
    nx: number
    ny: number
    cellWmm: number
    cellHmm: number
    marginMm: number
    gutterMm: number
}

/**
 * How many fixed-size tiles fit along one axis, with optional gaps.
 */
function maxTilesAlong(usableMm: number, tileMm: number, gapMm: number): number {
    if (tileMm <= 0 || usableMm <= 0) {
        return 0
    }
    if (tileMm > usableMm) {
        return 0
    }
    let n = 1
    for (;;) {
        const need = (n + 1) * tileMm + n * gapMm
        if (need <= usableMm) {
            n += 1
        } else {
            break
        }
    }
    return n
}

/**
 * Packs tickets at **fixed** physical size (wMm × hMm). Each A4 page holds a
 * full grid; overflow continues on further pages. Ticket size is never scaled down.
 */
export function buildA4PackPlan(
    totalTickets: number,
    ticketWmm: number,
    ticketHmm: number,
    marginMm: number = DEFAULT_A4_MARGIN_MM,
    gutterMm: number = DEFAULT_TICKET_GAP_MM
): A4PagePlan[] {
    const n = Math.max(1, Math.min(99, Math.floor(totalTickets)))
    const usableW = A4_MM.w - 2 * marginMm
    const usableH = A4_MM.h - 2 * marginMm

    let nx = maxTilesAlong(usableW, ticketWmm, gutterMm)
    let ny = maxTilesAlong(usableH, ticketHmm, gutterMm)
    if (nx === 0) {
        nx = 1
    }
    if (ny === 0) {
        ny = 1
    }

    const perPage = nx * ny
    const pages: A4PagePlan[] = []
    let remaining = n

    while (remaining > 0) {
        const ticketsPlaced = Math.min(remaining, perPage)
        pages.push({
            ticketsPlaced,
            nx,
            ny,
            cellWmm: ticketWmm,
            cellHmm: ticketHmm,
            marginMm,
            gutterMm
        })
        remaining -= ticketsPlaced
    }

    return pages
}
