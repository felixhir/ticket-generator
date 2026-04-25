import util from 'node:util'

/** Keep in sync with `structuredLogFormatEnabled` in `src/lib/server/log-base.ts`. */
function structuredLogFormatEnabled() {
    const fmt = process.env.LOG_FORMAT
    if (fmt === 'json') return true
    if (fmt === 'pretty') return false
    return process.env.TICKET_GENERATOR_JSON_LOGS === '1'
}

/** Must match `JSON_ERR_KEY` in `src/lib/server/log-base.ts`. */
const JSON_ERR_KEY = '__ticketGeneratorJsonErr'

function tryParseRequestErrorLine(s) {
    if (!s.startsWith('{')) return null
    try {
        const p = JSON.parse(s)
        if (p?.source === 'next' && p.type === 'requestError') return p
    } catch {
        // ignore
    }
    return null
}

function formatArg(value) {
    if (typeof value === 'string') return value
    if (value === undefined) return 'undefined'
    if (value === null) return 'null'
    if (value instanceof Error) {
        return value.stack ?? value.message
    }
    if (typeof value === 'object' || typeof value === 'function') {
        try {
            return JSON.stringify(value)
        } catch {
            return util.inspect(value, { depth: 4, breakLength: Infinity, maxStringLength: 20_000 })
        }
    }
    return String(value)
}

if (structuredLogFormatEnabled()) {
    globalThis[JSON_ERR_KEY] = line => {
        process.stderr.write(line + '\n')
    }

    const specByMethod = {
        log: { level: 'info', useStderr: false },
        info: { level: 'info', useStderr: false },
        debug: { level: 'debug', useStderr: false },
        warn: { level: 'warn', useStderr: true },
        error: { level: 'error', useStderr: true }
    }

    for (const method of Object.keys(specByMethod)) {
        const spec = specByMethod[method]
        const next = (...args) => {
            if (method === 'error' && args.length === 1 && typeof args[0] === 'string') {
                const s = args[0]
                if (tryParseRequestErrorLine(s)) {
                    process.stderr.write(s + '\n')
                    return
                }
            }
            const rawMessage = args.map(formatArg).join(' ')
            const message = util.stripVTControlCharacters(rawMessage)
            const line = JSON.stringify({
                level: spec.level,
                time: new Date().toISOString(),
                source: 'next',
                message
            })
            const out = spec.useStderr ? process.stderr : process.stdout
            out.write(line + '\n')
        }
        Object.defineProperty(next, 'name', { value: String(method) })
        console[method] = next
    }
}
