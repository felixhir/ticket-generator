import { NextResponse } from 'next/server'

import {
    importEventFromUrl,
    logImport,
    serializeTicketData,
    summarizeTicketData
} from '@/lib/server/import/import-event-from-url'

export async function POST(request: Request) {
    const importId = crypto.randomUUID()
    try {
        const body = (await request.json()) as { url?: unknown }
        if (typeof body.url !== 'string') {
            logImport(importId, 'request.invalid', { reason: 'missing-url' })
            return NextResponse.json({ error: 'Missing event URL' }, { status: 400 })
        }

        logImport(importId, 'request.start', { url: body.url })
        const data = await importEventFromUrl(body.url, importId)
        logImport(importId, 'request.success', summarizeTicketData(data))
        return NextResponse.json(serializeTicketData(data))
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to import event data'
        logImport(importId, 'request.error', { message })
        return NextResponse.json({ error: message }, { status: 400 })
    }
}
