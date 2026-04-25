/**
 * Node `process.stdout` for ndjson lines. Kept separate from `log-base.ts` so that
 * `instrumentation.ts` (and other Edge-analyzed paths) never import this module—only `log-base.ts`.
 */
import { structuredLogFormatEnabled } from '@/lib/server/log-base'

export function logServerInfo(scope: string, fields: Record<string, unknown>): void {
    if (structuredLogFormatEnabled()) {
        const line = JSON.stringify({
            level: 'info',
            time: new Date().toISOString(),
            scope,
            ...fields
        })
        process.stdout.write(line + '\n')
    } else {
        console.info(`[${scope}]`, fields)
    }
}
