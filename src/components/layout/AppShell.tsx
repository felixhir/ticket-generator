import type { ReactNode } from 'react'

import { AppSurface } from '@/components/ui/app-primitives'
import type { Locale } from '@/lib/i18n/routing'
import AppFooter from './AppFooter'
import AppHobbyNote from './AppHobbyNote'

const gitSha = process.env.NEXT_PUBLIC_GIT_SHA?.trim()
const buildVersion =
    gitSha && gitSha.length > 0
        ? gitSha
        : process.env.NEXT_PUBLIC_BUILD_VERSION?.trim() || process.env.BUILD_VERSION?.trim() || 'local'

export default function AppShell({ children, locale }: { children: ReactNode; locale: Locale }) {
    return (
        <main className='flex min-h-screen flex-col bg-app-background text-app-text-primary sm:p-app-frame print:min-h-0 print:p-0'>
            <AppSurface
                variant='shell'
                padding='none'
                className='mx-auto flex min-h-0 w-full max-w-app-shell flex-1 flex-col overflow-hidden rounded-none border-0 sm:rounded-app-shell sm:border print:min-h-0 print:border-0 print:bg-transparent print:shadow-none'
            >
                {children}
            </AppSurface>
            <AppHobbyNote locale={locale} />
            <AppFooter buildVersion={buildVersion} locale={locale} />
        </main>
    )
}
