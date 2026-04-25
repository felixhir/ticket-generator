import Link from 'next/link'

import type { Locale } from '@/lib/i18n/routing'
import { getLocalizedPath } from '@/lib/i18n/routing'
import { createTranslator } from '@/lib/i18n/server'

export default function AppFooter({ buildVersion, locale }: { buildVersion: string; locale: Locale }) {
    const t = createTranslator(locale)

    return (
        <footer className='mx-auto w-full max-w-app-shell shrink-0 px-app-section pt-2 text-center text-app-caption leading-5 text-app-text-secondary/50 max-md:mb-6 print:hidden'>
            <nav aria-label={t('footer.legalLabel')} className='mt-1 flex items-center justify-center gap-2'>
                <Link className='transition hover:text-app-text-primary' href={getLocalizedPath(locale, '/privacy')}>
                    {t('legal.privacy')}
                </Link>
                <span aria-hidden='true' className='h-3 w-px bg-app-border' />
                <Link className='transition hover:text-app-text-primary' href={getLocalizedPath(locale, '/imprint')}>
                    {t('legal.imprint')}
                </Link>
            </nav>
            <p className='mt-1 text-app-micro'>{t('footer.build', { version: buildVersion })}</p>
        </footer>
    )
}
