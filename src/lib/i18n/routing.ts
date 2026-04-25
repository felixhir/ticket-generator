export const fallbackLanguage = 'en'

export const supportedLanguages = ['en', 'de'] as const

export type Locale = (typeof supportedLanguages)[number]

export function isSupportedLocale(value: string | undefined): value is Locale {
    return supportedLanguages.some(locale => locale === value)
}

export function normalizeLocale(value: string | undefined): Locale {
    return isSupportedLocale(value) ? value : fallbackLanguage
}

export function detectLocaleFromAcceptLanguage(header: string | null): Locale {
    if (!header) return fallbackLanguage

    const languages = header
        .split(',')
        .map(part => part.split(';')[0]?.trim().toLowerCase().split(/[-_]/)[0])
        .filter(Boolean)

    return languages.find(isSupportedLocale) ?? fallbackLanguage
}

export function getLocalizedPath(locale: Locale, pathname: string) {
    const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`
    return `/${locale}${normalizedPath}`
}
