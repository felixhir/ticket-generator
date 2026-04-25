import { NextResponse } from 'next/server'

import { verifyAltchaPayload } from '@/lib/server/altcha'
import { ImportError, ImportVerificationError } from '@/lib/server/import/errors'
import { importEventFromUrl } from '@/lib/server/import/pipeline'
import { logImport, serializeTicketData, summarizeTicketData } from '@/lib/server/import/utils'

export async function POST(request: Request) {
    const importId = crypto.randomUUID()
    try {
        const body = (await request.json()) as { altcha?: unknown; url?: unknown }
        if (typeof body.url !== 'string') {
            logImport(importId, 'request.invalid', { reason: 'missing-url' })
            return NextResponse.json({ error: 'Missing event URL' }, { status: 400 })
        }

        if (typeof body.altcha !== 'string') {
            logImport(importId, 'request.verification.failed', { reason: 'missing-payload' })
            throw new ImportVerificationError()
        }

        let verified = false
        try {
            verified = await verifyAltchaPayload(body.altcha)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'ALTCHA verification failed'
            logImport(importId, 'request.verification.error', { message })
            throw new ImportVerificationError()
        }

        if (!verified) {
            logImport(importId, 'request.verification.failed')
            throw new ImportVerificationError()
        }

        logImport(importId, 'request.start', { url: body.url })
        const data = await importEventFromUrl(body.url, importId)
        logImport(importId, 'request.success', summarizeTicketData(data))
        return NextResponse.json(serializeTicketData(data))
    } catch (err) {
        if (err instanceof ImportError) {
            logImport(importId, 'request.error', { code: err.code, message: err.message })
            return NextResponse.json({ error: err.message, code: err.code }, { status: err.status })
        }
        const message = err instanceof Error ? err.message : 'Failed to import event data'
        logImport(importId, 'request.error', { message })
        return NextResponse.json({ error: message }, { status: 400 })
    }
}
