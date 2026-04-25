import de from './locales/de.json'
import en from './locales/en.json'

export { fallbackLanguage, supportedLanguages } from '@/lib/i18n/routing'

export const resources = {
    en: {
        translation: en
    },
    de: {
        translation: de
    }
} as const
