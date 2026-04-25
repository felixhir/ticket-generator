import { redirect } from 'next/navigation'
import type { Locale } from '@/lib/i18n/routing'
import { getLocalizedPath } from '@/lib/i18n/routing'

export default async function LocaleIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params
    redirect(getLocalizedPath(locale, '/create'))
}
