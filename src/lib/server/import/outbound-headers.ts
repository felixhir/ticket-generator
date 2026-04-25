const IMPORT_OUTBOUND_UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const IMPORT_OUTBOUND_ACCEPT_LANGUAGE = 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7'

export function importOutboundHeaders(additional: Record<string, string> = {}): HeadersInit {
    return {
        'User-Agent': IMPORT_OUTBOUND_UA,
        'Accept-Language': IMPORT_OUTBOUND_ACCEPT_LANGUAGE,
        ...additional
    }
}
