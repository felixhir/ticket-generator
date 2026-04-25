import { A4_MM, type A4PagePlan } from '@/lib/ticket/packA4'

const EXPORT_DPI = 200

function pageDimensionsFromMm() {
    const pageW = Math.round((A4_MM.w * EXPORT_DPI) / 25.4)
    const pageH = Math.round((A4_MM.h * EXPORT_DPI) / 25.4)
    const mmToPx = pageW / A4_MM.w
    return { pageW, pageH, mmToPx }
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

/**
 * Renders a single A4 page (full bleed PNG matching 210×297 mm).
 * Each ticket is drawn at the fixed cell size from the plan.
 */
export async function renderA4PageToPngDataUrl(
    ticketDataUrl: string,
    ticketWpx: number,
    ticketHpx: number,
    plan: A4PagePlan
): Promise<string> {
    const { pageW, pageH, mmToPx } = pageDimensionsFromMm()
    const canvas = document.createElement('canvas')
    canvas.width = pageW
    canvas.height = pageH
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new Error('No 2D context')
    }

    const img = await loadImageFromDataUrl(ticketDataUrl)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, pageW, pageH)

    const mPx = plan.marginMm * mmToPx
    const gutterPx = plan.gutterMm * mmToPx
    const cellWpx = plan.cellWmm * mmToPx
    const cellHpx = plan.cellHmm * mmToPx
    const stepX = cellWpx + gutterPx
    const stepY = cellHpx + gutterPx

    for (let i = 0; i < plan.ticketsPlaced; i += 1) {
        const col = i % plan.nx
        const row = Math.floor(i / plan.nx)
        const x = mPx + col * stepX
        const y = mPx + row * stepY
        ctx.drawImage(img, 0, 0, ticketWpx, ticketHpx, x, y, cellWpx, cellHpx)
    }

    return canvas.toDataURL('image/png')
}

export async function renderA4PackToPngDataUrls(
    ticketDataUrl: string,
    ticketWpx: number,
    ticketHpx: number,
    plans: A4PagePlan[]
): Promise<string[]> {
    return Promise.all(plans.map(plan => renderA4PageToPngDataUrl(ticketDataUrl, ticketWpx, ticketHpx, plan)))
}
