import type { Metadata } from 'next'
import AppShell from '@/components/layout/AppShell'
import I18nProvider from '@/components/providers/I18nProvider'
import TicketStudio from '@/components/studio/TicketStudio'
import type { Locale } from '@/lib/i18n/routing'
import { createTranslator } from '@/lib/i18n/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
    const { locale } = await params
    const t = createTranslator(locale)

    return {
        title: t('landing.title'),
        description: t('landing.description')
    }
}

export default async function CreatePage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params

    return (
        <AppShell locale={locale}>
            <I18nProvider locale={locale}>
                <TicketStudio locale={locale} page='create' />
            </I18nProvider>
        </AppShell>
    )
}
