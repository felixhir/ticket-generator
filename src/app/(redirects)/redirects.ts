import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { detectLocaleFromAcceptLanguage, getLocalizedPath } from '@/lib/i18n/routing'

export async function redirectToLocalizedPath(pathname: string) {
    const requestHeaders = await headers()
    const locale = detectLocaleFromAcceptLanguage(requestHeaders.get('accept-language'))
    redirect(getLocalizedPath(locale, pathname))
}
