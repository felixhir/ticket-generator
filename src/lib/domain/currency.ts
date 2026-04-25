export enum currency {
    EUR,
    USD,
    SEK,
    GBP,
    JPY,
    CHF,
    CAD,
    AUD,
    CNY,
    INR,
    BRL,
    MXN,
    NOK,
    DKK,
    PLN,
    CZK,
    NZD,
    SGD,
    HKD,
    KRW,
    ZAR
}

export const supportedCurrencies = [
    currency.EUR,
    currency.USD,
    currency.GBP,
    currency.JPY,
    currency.CHF,
    currency.CAD,
    currency.AUD,
    currency.CNY,
    currency.INR,
    currency.BRL,
    currency.MXN,
    currency.SEK,
    currency.NOK,
    currency.DKK,
    currency.PLN,
    currency.CZK,
    currency.NZD,
    currency.SGD,
    currency.HKD,
    currency.KRW,
    currency.ZAR
] as const

export function getCurrencyCode(value: currency) {
    return currency[value] ?? currency[currency.EUR]
}

export function getCurrencyFractionDigits(value: currency) {
    switch (value) {
        case currency.JPY:
        case currency.KRW:
        case currency.SEK:
            return 0
        default:
            return 2
    }
}

const TICKET_PRICE_FRACTION_DIGITS = 2

export function formatTicketPriceAmount(value: number, locale: string) {
    const n = Number.isFinite(value) ? value : 0
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: TICKET_PRICE_FRACTION_DIGITS,
        maximumFractionDigits: TICKET_PRICE_FRACTION_DIGITS,
        useGrouping: false
    }).format(n)
}

export function parseTicketPriceInput(raw: string) {
    const s = raw.trim().replace(/\s/g, '')
    if (s === '' || s === ',' || s === '.') {
        return 0
    }
    let normalized = s
    const hasComma = s.includes(',')
    const hasDot = s.includes('.')
    if (hasComma && hasDot) {
        if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
            normalized = s.replaceAll('.', '').replace(',', '.')
        } else {
            normalized = s.replaceAll(',', '')
        }
    } else {
        normalized = s.replaceAll(',', '.')
    }
    const n = Number.parseFloat(normalized)
    if (!Number.isFinite(n)) {
        return 0
    }
    return Math.round(n * 100) / 100
}
