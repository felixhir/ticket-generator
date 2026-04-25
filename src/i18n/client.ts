'use client'

import { createInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { Locale } from '@/lib/i18n/routing'
import { fallbackLanguage, resources, supportedLanguages } from './resources'

export function createClientI18n(locale: Locale) {
    const i18n = createInstance()

    void i18n.use(initReactI18next).init({
        fallbackLng: fallbackLanguage,
        initAsync: false,
        interpolation: {
            escapeValue: false
        },
        lng: locale,
        load: 'languageOnly',
        resources,
        supportedLngs: supportedLanguages,
        react: {
            useSuspense: false
        }
    })

    return i18n
}
