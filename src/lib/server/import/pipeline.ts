import { ImportNoEventDataError, ImportProviderUnsupportedError } from '@/lib/server/import/errors'
import { findEventInHtml, mapJsonLdEventToTicketData } from '@/lib/server/import/json-ld'
import { fetchImportPageText } from '@/lib/server/import/page-fetch'
import { findProviderStrategy } from '@/lib/server/import/providers/registry'
import type { ImportContext, ImportedTicketData } from '@/lib/server/import/types'
import { logImport, summarizeTicketData } from '@/lib/server/import/utils'

export async function importEventFromUrl(url: string, importId: string): Promise<ImportedTicketData> {
    const cleanUrl = new URL(url)
    cleanUrl.search = ''
    logImport(importId, 'resolver.normalized-url', { url: cleanUrl.toString(), host: cleanUrl.hostname })

    const ctx: ImportContext = { importId, url: cleanUrl }
    const provider = findProviderStrategy(cleanUrl.hostname)

    const prePageUrlStrategyData = provider?.preferUrlImport ? ((await provider.importFromUrl?.(ctx)) ?? null) : null
    if (prePageUrlStrategyData) {
        return prePageUrlStrategyData
    }

    let pageText: string
    try {
        pageText = await fetchImportPageText(cleanUrl.toString(), importId)
    } catch (err) {
        const fallbackData = provider?.fallbackFromUrl?.(cleanUrl) ?? null
        if (provider && fallbackData) {
            logImport(importId, `resolver.${provider.id}.url-fallback.success`, summarizeTicketData(fallbackData))
            return fallbackData
        }
        throw err
    }

    const jsonLdEvent = findEventInHtml(pageText)
    if (jsonLdEvent) {
        const data = mapJsonLdEventToTicketData(jsonLdEvent)
        logImport(importId, 'resolver.json-ld.success', summarizeTicketData(data))
        return data
    }

    logImport(importId, 'resolver.json-ld.no-event')

    const pageStrategyData = provider?.importFromPageText?.({ importId, url: cleanUrl, pageText }) ?? null
    if (provider && pageStrategyData) {
        logImport(importId, `resolver.${provider.id}.parse.success`, summarizeTicketData(pageStrategyData))
        return pageStrategyData
    }

    if (provider?.importFromPageText) {
        logImport(importId, `resolver.${provider.id}.parse.skip`)
    }

    const urlStrategyData = provider?.preferUrlImport ? null : ((await provider?.importFromUrl?.(ctx)) ?? null)
    if (urlStrategyData) {
        return urlStrategyData
    }

    const fallbackData = provider?.fallbackFromUrl?.(cleanUrl) ?? null
    if (provider && fallbackData) {
        logImport(importId, `resolver.${provider.id}.url-fallback.success`, summarizeTicketData(fallbackData))
        return fallbackData
    }

    if (provider) {
        throw new ImportNoEventDataError()
    }
    throw new ImportProviderUnsupportedError()
}
