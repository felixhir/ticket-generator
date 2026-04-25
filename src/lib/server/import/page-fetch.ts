import { ImportLinkNotFoundError, ImportPageFetchError } from '@/lib/server/import/errors'
import { importOutboundHeaders } from '@/lib/server/import/outbound-headers'
import { logImport, sanitizeUrl } from '@/lib/server/import/utils'

const CORS_PROXY = 'https://corsproxy.io/?'
const JINA_READER = 'https://r.jina.ai/'
const PAGE_FETCH_TIMEOUT_MS = 5000

export async function fetchImportPageText(targetUrl: string, importId: string): Promise<string> {
    const page = new URL(targetUrl)
    const pageOrigin = page.origin
    const pageHeaders = importOutboundHeaders({
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        Origin: pageOrigin,
        Referer: `${pageOrigin}/`,
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Upgrade-Insecure-Requests': '1'
    })
    const urls = [
        { name: 'direct', url: targetUrl, originalTarget: true },
        { name: 'corsproxy', url: CORS_PROXY + encodeURIComponent(targetUrl) },
        { name: 'jina-reader', url: JINA_READER + targetUrl }
    ]
    let lastStatus = 0

    for (const candidate of urls) {
        try {
            logImport(importId, 'api.page-fetch.start', { provider: candidate.name, url: sanitizeUrl(candidate.url) })
            const res = await fetch(candidate.url, {
                headers: pageHeaders,
                signal: AbortSignal.timeout(PAGE_FETCH_TIMEOUT_MS)
            })
            lastStatus = res.status
            logImport(importId, 'api.page-fetch.end', { provider: candidate.name, status: res.status, ok: res.ok })
            if (candidate.originalTarget && res.status === 404) {
                logImport(importId, 'api.page-fetch.not-found', { provider: candidate.name })
                throw new ImportLinkNotFoundError()
            }
            if (res.ok) {
                const text = await res.text()
                logImport(importId, 'api.page-fetch.body', { provider: candidate.name, bytes: text.length })
                return text
            }
        } catch (err) {
            if (err instanceof ImportLinkNotFoundError) throw err
            logImport(importId, 'api.page-fetch.exception', {
                provider: candidate.name,
                message: err instanceof Error ? err.message : 'unknown error'
            })
        }
    }

    throw new ImportPageFetchError(lastStatus ? `Could not load this page (${lastStatus}).` : undefined)
}
