import { resources, supportedLanguages } from '@/i18n/resources'
import type { Locale } from './routing'

export type { Locale } from './routing'
export { isSupportedLocale } from './routing'

export type TranslationValues = Record<string, number | string>
export type Translator = (key: string, values?: TranslationValues) => string

const dictionaries = Object.fromEntries(
    supportedLanguages.map(locale => [locale, resources[locale].translation])
) as Record<Locale, (typeof resources)[Locale]['translation']>

export function getDictionary(locale: Locale) {
    return dictionaries[locale]
}

export function createTranslator(locale: Locale): Translator {
    const dictionary = getDictionary(locale)

    return (key, values = {}) => {
        const value = resolveTranslation(dictionary, key, values)
        if (typeof value !== 'string') return key

        return interpolate(value, values)
    }
}

function resolveTranslation(dictionary: unknown, key: string, values: TranslationValues) {
    const pluralKey = typeof values.count === 'number' ? `${key}_${values.count === 1 ? 'one' : 'other'}` : null
    return readPath(dictionary, pluralKey ?? key) ?? (pluralKey ? readPath(dictionary, key) : undefined)
}

function readPath(value: unknown, key: string) {
    return key.split('.').reduce<unknown>((current, segment) => {
        if (!current || typeof current !== 'object') return undefined
        return (current as Record<string, unknown>)[segment]
    }, value)
}

function interpolate(value: string, values: TranslationValues) {
    return value.replace(/{{\s*(\w+)\s*}}/g, (_, key: string) => String(values[key] ?? ''))
}
