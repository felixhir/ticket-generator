import type { Locale } from '@/lib/i18n/routing'
import { createTranslator } from '@/lib/i18n/server'

export default function AppHobbyNote({ locale }: { locale: Locale }) {
    const t = createTranslator(locale)

    return (
        <p
            className='mx-auto mt-4 mb-0 w-full max-w-app-shell shrink-0 px-app-section text-center text-app-caption leading-relaxed text-app-text-secondary/50 sm:mt-5 print:hidden'
            role='note'
        >
            {t('footer.hobbyNote')}
        </p>
    )
}
