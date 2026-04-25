'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import AppNavigation from '@/components/studio/AppNavigation'
import { SectionEyebrow } from '@/components/ui/app-primitives'
import type { Locale } from '@/lib/i18n/routing'
import { getLocalizedPath } from '@/lib/i18n/routing'

function getStudioPage(pathname: string) {
    const [, , page] = pathname.split('/')

    if (page === 'stored') return 'stored'
    if (page === 'ticket') return 'ticket'
    return 'create'
}

function getCurrentPath(pathname: string) {
    const currentPath = pathname.replace(/^\/[^/]+/, '')
    return currentPath || '/create'
}

export default function StudioPageFrame({ children, locale }: { children: ReactNode; locale: Locale }) {
    const pathname = usePathname()
    const activePage = getStudioPage(pathname)
    const currentPath = getCurrentPath(pathname)
    const { t } = useTranslation()

    return (
        <div className='flex flex-1 flex-col print:block'>
            <header className='flex items-center justify-between gap-app-card border-b border-app-border p-app-card sm:flex-wrap sm:gap-app-section sm:p-app-section print:hidden'>
                <Link
                    href={getLocalizedPath(locale, '/create')}
                    className='min-w-0 max-w-full rounded-sm text-left no-underline outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-app-ring focus-visible:ring-offset-2 focus-visible:ring-offset-app-background'
                    aria-label={`${t('app.name')}: ${t('nav.create')}`}
                >
                    <SectionEyebrow>{t('app.name')}</SectionEyebrow>
                    <h1 className='text-app-body font-bold text-app-text-primary/90 sm:text-app-heading'>
                        {t('app.title')}
                    </h1>
                </Link>
                <AppNavigation activePage={activePage} currentPath={currentPath} locale={locale} />
            </header>

            <section className='flex flex-1 flex-col p-app-card sm:p-app-section print:p-0'>{children}</section>
        </div>
    )
}
