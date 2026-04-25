import type { Metadata } from 'next'
import AppShell from '@/components/layout/AppShell'
import type { Locale } from '@/lib/i18n/routing'
import { createTranslator } from '@/lib/i18n/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
    const { locale } = await params
    const t = createTranslator(locale)

    return {
        title: t('imprint.title')
    }
}

export default async function ImprintPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params
    const t = createTranslator(locale)

    return (
        <AppShell locale={locale}>
            <article className='legal-content mx-auto w-full max-w-3xl flex-1 px-app-section py-app-nav-outer'>
                <h1>{t('imprint.title')}</h1>

                <section>
                    <h2>{t('imprint.provider.heading')}</h2>
                    <address>
                        Jonas Scholl
                        <br />
                        Schwetzinger Str. 44
                        <br />
                        69168 Wiesloch
                    </address>
                </section>

                <section>
                    <h2>{t('imprint.contact.heading')}</h2>
                    <p>
                        {t('legal.email')}: <a href='mailto:jonas@scholl.tech'>jonas@scholl.tech</a>
                    </p>
                </section>

                <section>
                    <h2>{t('imprint.content.heading')}</h2>
                    <address>
                        Jonas Scholl
                        <br />
                        Schwetzinger Str. 44
                        <br />
                        69168 Wiesloch
                    </address>
                </section>
            </article>
        </AppShell>
    )
}
