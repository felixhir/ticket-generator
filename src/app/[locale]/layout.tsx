import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import 'react-datepicker/dist/react-datepicker.css'
import '../globals.css'

import { createTranslator, isSupportedLocale, type Locale } from '@/lib/i18n/server'

export function generateStaticParams() {
    return [{ locale: 'en' }, { locale: 'de' }]
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
    const { locale } = await params
    const normalizedLocale = isSupportedLocale(locale) ? locale : 'en'
    const t = createTranslator(normalizedLocale)

    return {
        title: {
            default: t('app.name'),
            template: `%s | ${t('app.name')}`
        },
        description: t('landing.description')
    }
}

interface LocaleLayoutProps {
    children: ReactNode
    params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params
    if (!isSupportedLocale(locale)) notFound()

    return (
        <html lang={locale}>
            <body>{children}</body>
        </html>
    )
}

export type LocaleRouteParams = Promise<{ locale: Locale }>
