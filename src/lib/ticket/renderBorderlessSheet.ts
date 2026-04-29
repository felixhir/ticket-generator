const BORDERLESS_TARGET_DPI = 300
const BORDERLESS_TARGET_LONG_EDGE_MM = 200
const BORDERLESS_TARGET_SHORT_EDGE_MM = 150
const SHEET_GAP_PX = 1

type BorderlessSheetPlan = {
    columns: number
    rows: number
    ticketWidthPx: number
    ticketHeightPx: number
    sheetWidthPx: number
    sheetHeightPx: number
}

type SheetBoundsPx = {
    widthPx: number
    heightPx: number
}

function loadImageFromDataUrl(dataUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.addEventListener('load', () => {
            resolve(img)
        })
        img.addEventListener('error', () => {
            reject(new Error('Could not load ticket image'))
        })
        img.src = dataUrl
    })
}

function mmToPx(mm: number) {
    return Math.round((mm * BORDERLESS_TARGET_DPI) / 25.4)
}

function getHeuristicSheetBounds(): SheetBoundsPx[] {
    const longEdgePx = mmToPx(BORDERLESS_TARGET_LONG_EDGE_MM)
    const shortEdgePx = mmToPx(BORDERLESS_TARGET_SHORT_EDGE_MM)

    return [
        { widthPx: longEdgePx, heightPx: shortEdgePx },
        { widthPx: shortEdgePx, heightPx: longEdgePx }
    ]
}

function buildBorderlessSheetPlan(
    totalTickets: number,
    ticketWidthPx: number,
    ticketHeightPx: number
): BorderlessSheetPlan {
    const ticketCount = Math.max(1, Math.min(99, Math.floor(totalTickets)))
    let bestPlan: BorderlessSheetPlan | null = null

    for (const bounds of getHeuristicSheetBounds()) {
        for (let columns = 1; columns <= ticketCount; columns += 1) {
            const rows = Math.ceil(ticketCount / columns)
            const widthBudget = bounds.widthPx - (columns - 1) * SHEET_GAP_PX
            const heightBudget = bounds.heightPx - (rows - 1) * SHEET_GAP_PX
            const scale = Math.min(widthBudget / (columns * ticketWidthPx), heightBudget / (rows * ticketHeightPx))

            if (!Number.isFinite(scale) || scale <= 0) {
                continue
            }

            const scaledTicketWidth = Math.max(1, Math.floor(ticketWidthPx * scale))
            const scaledTicketHeight = Math.max(1, Math.floor(ticketHeightPx * scale))
            const sheetWidth = columns * scaledTicketWidth + (columns - 1) * SHEET_GAP_PX
            const sheetHeight = rows * scaledTicketHeight + (rows - 1) * SHEET_GAP_PX
            const nextPlan: BorderlessSheetPlan = {
                columns,
                rows,
                ticketWidthPx: scaledTicketWidth,
                ticketHeightPx: scaledTicketHeight,
                sheetWidthPx: sheetWidth,
                sheetHeightPx: sheetHeight
            }

            if (!bestPlan) {
                bestPlan = nextPlan
                continue
            }

            const nextArea = nextPlan.ticketWidthPx * nextPlan.ticketHeightPx
            const bestArea = bestPlan.ticketWidthPx * bestPlan.ticketHeightPx

            if (nextArea > bestArea) {
                bestPlan = nextPlan
                continue
            }

            if (nextArea === bestArea && nextPlan.sheetHeightPx < bestPlan.sheetHeightPx) {
                bestPlan = nextPlan
            }
        }
    }

    if (bestPlan) {
        return bestPlan
    }

    return {
        columns: 1,
        rows: ticketCount,
        ticketWidthPx: Math.max(1, Math.min(ticketWidthPx, mmToPx(BORDERLESS_TARGET_LONG_EDGE_MM))),
        ticketHeightPx: Math.max(1, Math.min(ticketHeightPx, mmToPx(BORDERLESS_TARGET_SHORT_EDGE_MM))),
        sheetWidthPx: Math.max(1, Math.min(ticketWidthPx, mmToPx(BORDERLESS_TARGET_LONG_EDGE_MM))),
        sheetHeightPx: Math.max(1, Math.min(ticketCount * ticketHeightPx, mmToPx(BORDERLESS_TARGET_LONG_EDGE_MM)))
    }
}

export async function renderBorderlessSheetToPngDataUrl(
    ticketDataUrl: string,
    ticketWidthPx: number,
    ticketHeightPx: number,
    totalTickets: number
): Promise<string> {
    const plan = buildBorderlessSheetPlan(totalTickets, ticketWidthPx, ticketHeightPx)
    const canvas = document.createElement('canvas')
    canvas.width = plan.sheetWidthPx
    canvas.height = plan.sheetHeightPx

    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new Error('No 2D context')
    }

    const img = await loadImageFromDataUrl(ticketDataUrl)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, plan.sheetWidthPx, plan.sheetHeightPx)

    for (let index = 0; index < totalTickets; index += 1) {
        const column = index % plan.columns
        const row = Math.floor(index / plan.columns)
        const x = column * (plan.ticketWidthPx + SHEET_GAP_PX)
        const y = row * (plan.ticketHeightPx + SHEET_GAP_PX)

        ctx.drawImage(img, 0, 0, ticketWidthPx, ticketHeightPx, x, y, plan.ticketWidthPx, plan.ticketHeightPx)
    }

    return canvas.toDataURL('image/png')
}
