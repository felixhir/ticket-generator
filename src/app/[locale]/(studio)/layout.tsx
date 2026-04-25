import type { ReactNode } from 'react'

import AppShell from '@/components/layout/AppShell'
import I18nProvider from '@/components/providers/I18nProvider'
import StudioPageFrame from '@/components/studio/StudioPageFrame'
import type { Locale } from '@/lib/i18n/routing'

interface StudioLayoutProps {
    children: ReactNode
    params: Promise<{ locale: Locale }>
}

export default async function StudioLayout({ children, params }: StudioLayoutProps) {
    const { locale } = await params

    return (
        <AppShell locale={locale}>
            <I18nProvider locale={locale}>
                <StudioPageFrame locale={locale}>{children}</StudioPageFrame>
            </I18nProvider>
        </AppShell>
    )
}
