import { currency, parseTicketPriceInput } from '@/lib/domain/currency'
import type { ImportedTicketData, ImportProviderStrategy } from '@/lib/server/import/types'

const SKIP_SUBTITLE_HEADINGS = new Set(
    [
        'tickets',
        'event info',
        'event location',
        'event info location',
        'important information for screen reader and keyboard users',
        'information about our fees',
        'recommended for you',
        'more topics',
        'other cities',
        'genre',
        'search',
        'shopping cart',
        'your shopping cart is empty',
        'ticket customers',
        'customer service',
        'company',
        'reservix ticketing system',
        'follow us',
        'highlights',
        'classical',
        'jazz rock pop',
        'stage events',
        'sports',
        'other',
        'order voucher',
        'call ticket hotline',
        'imprint',
        'contrast',
        'language en',
        'stuttgart discover more',
        'bühne discover more'
    ].map(s => s.toLowerCase().replaceAll('&nbsp;', ' ').trim())
)

const DATETIME_EN =
    /(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(\d{1,2})\.(\d{1,2})\.(\d{4})\s+at\s+(\d{1,2}):(\d{2})/i

const DATETIME_DE =
    /(?:Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\s+(\d{1,2})\.(\d{1,2})\.(\d{4})\s+um\s+(\d{1,2}):(\d{2})/i

const PRICE_FROM = /tickets?\s+from\s+€\s*([\d.,]+)/i
const PRICE_AB = /tickets?\s+ab\s+([\d.,]+)\s*€/i
const RESERVIX_SLUG = /tickets-(.+?)-in-(.+?)-am-(\d{1,2})-(\d{1,2})-(\d{4})/i

export const reservixStrategy: ImportProviderStrategy = {
    id: 'reservix',
    matchesHost: isReservixHost,
    importFromPageText({ url, pageText }) {
        return parseReservixFromReaderText(pageText, url)
    }
}

function isReservixHost(hostname: string) {
    return hostname === 'reservix.de' || hostname === 'www.reservix.de' || hostname.endsWith('.reservix.de')
}

function normalizeLine(line: string) {
    return line
        .replaceAll('&nbsp;', ' ')
        .replaceAll(/\u00a0/g, ' ')
        .trim()
}

function titleCase(value: string) {
    return value.replaceAll(/\S+/g, word => {
        if (/^m\d+$/i.test(word)) return word.toUpperCase()
        if (/^\d+-day$/i.test(word)) return `${word[0]}-Day`
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
}

function isJinaOneLineTitleNoise(line: string) {
    if (!line.startsWith('# ') || line.startsWith('## ')) return false
    const t = line.slice(2).trim()
    if (/order tickets online|your ticket portal/i.test(t)) return true
    if (
        /(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag).*\d{1,2}\.\d{1,2}\.\d{4}/i.test(
            t
        )
    )
        return true
    if (/\d{1,2}\.\d{1,2}\.\d{4}.*\bat\s+\d{1,2}:\d{2}\b/.test(t)) return true
    return false
}

function wallTimeBerlinToDate(year: number, month: number, day: number, hour: number, minute: number): Date | null {
    const pad = (n: number) => n.toString().padStart(2, '0')
    const local = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`
    for (const off of [2, 1] as const) {
        const d = new Date(`${local}${off === 2 ? '+02:00' : '+01:00'}`)
        if (Number.isNaN(d.getTime())) continue
        const f = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Europe/Berlin',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
        const p = f.formatToParts(d)
        const yR = p.find(x => x.type === 'year')?.value
        const mR = p.find(x => x.type === 'month')?.value
        const dR = p.find(x => x.type === 'day')?.value
        const hR = p.find(x => x.type === 'hour')?.value
        const minR = p.find(x => x.type === 'minute')?.value
        if (yR === String(year) && mR === pad(month) && dR === pad(day) && hR === pad(hour) && minR === pad(minute)) {
            return d
        }
    }
    return null
}

function parseReservixDateTimeLine(line: string): Date | null {
    const n = normalizeLine(line)
    let m = n.match(DATETIME_EN)
    if (m) {
        const d = Number(m[1])
        const mo = Number(m[2])
        const y = Number(m[3])
        const h = Number(m[4])
        const mi = Number(m[5])
        return wallTimeBerlinToDate(y, mo, d, h, mi)
    }
    m = n.match(DATETIME_DE)
    if (m) {
        const d = Number(m[1])
        const mo = Number(m[2])
        const y = Number(m[3])
        const h = Number(m[4])
        const mi = Number(m[5])
        return wallTimeBerlinToDate(y, mo, d, h, mi)
    }
    return null
}

function parseReservixPrice(text: string): number {
    for (const line of text.split(/\r?\n/)) {
        if (!/ticket|from\s+€|ab\s+[\d.,]+\s*€/i.test(line)) continue
        const m = line.match(PRICE_FROM) ?? line.match(PRICE_AB)
        if (m) return parseTicketPriceInput(m[1])
    }
    return 0
}

function isPlzCityLine(line: string) {
    return /^\d{5}\s+\S+/.test(line)
}

function isStreetLine(line: string) {
    const t = normalizeLine(line)
    if (isPlzCityLine(t)) return false
    if (t.length < 3 || t.length > 100) return false
    if (!/[A-Za-zäöüÄÖÜß]/.test(t)) return false
    if (!/\d/.test(t)) return false
    if (/^#{1,3}\s?/.test(t)) return false
    return true
}

function shouldSkipSubtitle(raw: string) {
    const t = normalizeLine(raw)
    return (
        t.length === 0 ||
        SKIP_SUBTITLE_HEADINGS.has(t.toLowerCase()) ||
        /^#{3,}/.test(raw.trim()) ||
        raw.includes('![') ||
        /discover more/i.test(t)
    )
}

function findEventH1(flat: string[]) {
    for (let i = 0; i < flat.length; i++) {
        const line = flat[i]
        if (!line || !line.startsWith('# ') || line.startsWith('## ')) continue
        if (isJinaOneLineTitleNoise(line)) continue
        const raw = line.slice(2).trim()
        if (!raw || raw.toLowerCase().startsWith('![') || /^tickets,?\s+concert tickets/i.test(raw)) continue
        return { title: raw, index: i }
    }
    return null
}

function parseReservixSlug(url: URL): Pick<ImportedTicketData, 'title' | 'venue' | 'datetime'> | null {
    const m = url.pathname.match(RESERVIX_SLUG)
    if (!m) return null
    const title = titleCase(m[1].replaceAll('-', ' '))
    const venue = titleCase(m[2].replaceAll('-', ' '))
    const day = Number(m[3])
    const month = Number(m[4])
    const year = Number(m[5])
    const datetime = wallTimeBerlinToDate(year, month, day, 12, 0)
    return { title, venue, datetime }
}

function parseReservixFromReaderText(text: string, url: URL): ImportedTicketData | null {
    const slugFallback = parseReservixSlug(url)
    const flat = text.split(/\r?\n/).map(l => l.trim())
    const price = parseReservixPrice(text)

    const h1 = findEventH1(flat)
    let title = h1?.title ?? ''
    let subtitle = ''
    if (h1) {
        for (let i = h1.index + 1; i < flat.length; i++) {
            const line = flat[i]
            if (!line) continue
            if (line.startsWith('# ') && !line.startsWith('## ')) break
            if (line.startsWith('## ')) {
                const sub = normalizeLine(line.slice(3))
                if (sub && !shouldSkipSubtitle(sub)) {
                    subtitle = sub
                    break
                }
            }
        }
    }

    let datetime: Date | null = null
    for (const line of flat) {
        if (!line) continue
        const t = parseReservixDateTimeLine(line)
        if (t) {
            datetime = t
            break
        }
    }

    let venue = ''
    let address = ''
    const venueIndex = findVenueIndex(flat)
    if (venueIndex >= 0) {
        venue = reservixVenueLabelFromLine(flat[venueIndex]) ?? ''
        address = findAddressAfter(flat, venueIndex)
    }

    if (!address) {
        const fallback = findAddressAnywhere(flat)
        venue ||= fallback.venue
        address = fallback.address
    }

    if (!title && slugFallback) title = slugFallback.title
    if (!venue && slugFallback?.venue) venue = slugFallback.venue
    if (!datetime && slugFallback?.datetime) datetime = slugFallback.datetime

    if (!title.trim()) return null

    return {
        title: title.trim(),
        subtitle: subtitle.trim(),
        venue: venue.trim(),
        address: address.trim(),
        datetime,
        price,
        currency: currency.EUR,
        seatType: ''
    }
}

function findVenueIndex(lines: string[]) {
    return lines.findIndex(line => Boolean(reservixVenueLabelFromLine(line)))
}

function reservixVenueLabelFromLine(line: string): string | null {
    const deTagged = line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')
    const re = /\[([^\]]+)]\((https?:\/\/(?:www\.)?reservix\.de\/[^)]+)\)/gi
    let m: RegExpExecArray | null
    while ((m = re.exec(deTagged)) !== null) {
        const label = normalizeLine(m[1] ?? '')
        const href = m[2] ?? ''
        if (/\/venue\//i.test(href) && label.length > 1 && label.length < 200) return label
    }
    return null
}

function findAddressAfter(lines: string[], lineIndex: number) {
    for (let streetIndex = lineIndex + 1; streetIndex < Math.min(lineIndex + 12, lines.length); streetIndex += 1) {
        const street = lines[streetIndex] ?? ''
        if (!street || !isStreetLine(street)) continue
        for (let cityIndex = streetIndex + 1; cityIndex < Math.min(streetIndex + 6, lines.length); cityIndex += 1) {
            const city = normalizeLine(lines[cityIndex] ?? '')
            if (city && isPlzCityLine(city)) return `${normalizeLine(street)}\n${city}`
        }
    }
    return ''
}

function findAddressAnywhere(lines: string[]) {
    for (let streetIndex = 0; streetIndex < lines.length; streetIndex += 1) {
        const street = lines[streetIndex]
        if (!street || !isStreetLine(street)) continue
        for (let cityIndex = streetIndex + 1; cityIndex < Math.min(streetIndex + 6, lines.length); cityIndex += 1) {
            const city = normalizeLine(lines[cityIndex] ?? '')
            if (!city || !isPlzCityLine(city)) continue
            return {
                venue: findVenueBeforeAddress(lines, streetIndex),
                address: `${normalizeLine(street)}\n${city}`
            }
        }
    }
    return { venue: '', address: '' }
}

function findVenueBeforeAddress(lines: string[], addressIndex: number) {
    for (let i = addressIndex - 1; i >= 0; i -= 1) {
        const previous = lines[i]
        if (!previous || previous.length <= 2) continue
        if (previous.startsWith('#') || parseReservixDateTimeLine(previous)) continue
        if (/^search$|^login$|^select\s+/i.test(previous)) continue
        if (/^\[/.test(previous) || previous.includes('http') || previous.startsWith('![')) continue
        if (!/[A-Za-zäöüÄÖÜ]/.test(previous)) continue
        const candidate = previous.replace(/[.*]/g, '').trim()
        if (candidate) return candidate
    }
    return ''
}
