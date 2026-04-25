'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { I18nextProvider } from 'react-i18next'

import { createClientI18n } from '@/i18n/client'
import type { Locale } from '@/lib/i18n/routing'

export default function I18nProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
    const i18n = useMemo(() => createClientI18n(locale), [locale])

    useEffect(() => {
        document.documentElement.lang = locale
    }, [locale])

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
