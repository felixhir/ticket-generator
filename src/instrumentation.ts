// Import `log-base`, not `log.ts`—`log.ts` uses `process.stdout`, which the Edge build rejects when pulled in via instrumentation.
import { structuredLogFormatEnabled, writeJsonErrLineForInstrumentation } from '@/lib/server/log-base'

type RequestInfo = { path: string; method: string; headers: { [key: string]: string | string[] } }

type ErrorContext = {
    routePath: string
    routeType: 'render' | 'route' | 'action' | 'proxy'
    renderSource?: string
    routerKind: 'App Router' | 'Pages Router'
    renderType?: 'dynamic' | 'dynamic-resume'
    revalidateReason: 'on-demand' | 'stale' | undefined
}

export function onRequestError(err: Error & { digest?: string }, request: RequestInfo, context: ErrorContext) {
    if (process.env.NEXT_RUNTIME !== 'nodejs') return
    if (!structuredLogFormatEnabled()) return

    const line = JSON.stringify({
        level: 'error',
        time: new Date().toISOString(),
        source: 'next',
        type: 'requestError',
        name: err.name,
        message: err.message,
        stack: err.stack,
        digest: typeof err.digest === 'string' ? err.digest : undefined,
        path: request.path,
        method: request.method,
        routePath: context.routePath,
        routeType: context.routeType,
        renderSource: context.renderSource,
        routerKind: context.routerKind
    })
    writeJsonErrLineForInstrumentation(line)
}
