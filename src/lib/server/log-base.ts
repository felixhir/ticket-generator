/**
 * Logging helpers safe for any server runtime graph (including the Edge slice of
 * `instrumentation.ts`). Next/Turbopack analyzes everything `instrumentation` imports; Node-only APIs
 * like `process.stdout` belong in `log.ts` instead so that analysis does not fail.
 */
const JSON_ERR_KEY = '__ticketGeneratorJsonErr' as const

type GlobalWithJsonErr = typeof globalThis & Partial<Record<typeof JSON_ERR_KEY, (line: string) => void>>

export function structuredLogFormatEnabled(): boolean {
    const fmt = process.env.LOG_FORMAT
    if (fmt === 'json') return true
    if (fmt === 'pretty') return false
    return process.env.TICKET_GENERATOR_JSON_LOGS === '1'
}

export function writeJsonErrLineForInstrumentation(line: string): void {
    const w = (globalThis as GlobalWithJsonErr)[JSON_ERR_KEY]
    if (w) w(line)
    else console.error(line)
}
