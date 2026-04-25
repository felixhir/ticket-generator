import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import AppShell from '@/components/layout/AppShell'
import type { Locale } from '@/lib/i18n/routing'
import { createTranslator } from '@/lib/i18n/server'

const rightsItems = [
    'privacy.general.restriction.itemAccuracy',
    'privacy.general.restriction.itemUnlawful',
    'privacy.general.restriction.itemClaims',
    'privacy.general.restriction.itemObjection'
] as const

function Section({ children, title }: { children: ReactNode; title: string }) {
    return (
        <section>
            <h2>{title}</h2>
            {children}
        </section>
    )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
    const { locale } = await params
    const t = createTranslator(locale)

    return {
        title: t('privacy.title')
    }
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params
    const t = createTranslator(locale)

    return (
        <AppShell locale={locale}>
            <article className='legal-content mx-auto w-full max-w-3xl flex-1 px-app-section py-app-nav-outer'>
                <h1>{t('privacy.title')}</h1>

                <Section title={t('privacy.overview.title')}>
                    <h3>{t('privacy.overview.general.heading')}</h3>
                    <p>{t('privacy.overview.general.description')}</p>

                    <h3>{t('privacy.overview.collection.heading')}</h3>
                    <h4>{t('privacy.overview.collection.responsibleQuestion')}</h4>
                    <p>{t('privacy.overview.collection.responsibleAnswer')}</p>
                    <h4>{t('privacy.overview.collection.howQuestion')}</h4>
                    <p>{t('privacy.overview.collection.howAnswerOne')}</p>
                    <p>{t('privacy.overview.collection.howAnswerTwo')}</p>
                    <h4>{t('privacy.overview.collection.purposeQuestion')}</h4>
                    <p>{t('privacy.overview.collection.purposeAnswer')}</p>
                    <h4>{t('privacy.overview.collection.rightsQuestion')}</h4>
                    <p>{t('privacy.overview.collection.rightsAnswer')}</p>
                    <p>{t('privacy.overview.collection.contactAnswer')}</p>
                </Section>

                <Section title={t('privacy.hosting.title')}>
                    <p>{t('privacy.hosting.intro')}</p>
                    <h3>{t('privacy.hosting.hetzner.heading')}</h3>
                    <p>{t('privacy.hosting.hetzner.provider')}</p>
                    <p>
                        {t('privacy.hosting.hetzner.details')}{' '}
                        <a
                            href='https://www.hetzner.com/de/legal/privacy-policy/'
                            rel='noopener noreferrer'
                            target='_blank'
                        >
                            https://www.hetzner.com/de/legal/privacy-policy/
                        </a>
                        .
                    </p>
                    <p>{t('privacy.hosting.hetzner.legalBasis')}</p>
                    <h4>{t('privacy.hosting.dpa.heading')}</h4>
                    <p>{t('privacy.hosting.dpa.description')}</p>
                </Section>

                <Section title={t('privacy.general.title')}>
                    <h3>{t('privacy.general.dataProtection.heading')}</h3>
                    <p>{t('privacy.general.dataProtection.descriptionOne')}</p>
                    <p>{t('privacy.general.dataProtection.descriptionTwo')}</p>
                    <p>{t('privacy.general.dataProtection.descriptionThree')}</p>

                    <h3>{t('privacy.general.controller.heading')}</h3>
                    <p>{t('privacy.general.controller.intro')}</p>
                    <address>
                        Jonas Scholl
                        <br />
                        Schwetzinger Str. 44
                        <br />
                        69168 Wiesloch
                    </address>
                    <p>
                        {t('legal.email')}: <a href='mailto:jonas@scholl.tech'>jonas@scholl.tech</a>
                    </p>
                    <p>{t('privacy.general.controller.description')}</p>

                    <h3>{t('privacy.general.storage.heading')}</h3>
                    <p>{t('privacy.general.storage.description')}</p>

                    <h3>{t('privacy.general.legalBases.heading')}</h3>
                    <p>{t('privacy.general.legalBases.description')}</p>

                    <h3>{t('privacy.general.recipients.heading')}</h3>
                    <p>{t('privacy.general.recipients.description')}</p>

                    <h3>{t('privacy.general.consent.heading')}</h3>
                    <p>{t('privacy.general.consent.description')}</p>

                    <h3>{t('privacy.general.objection.heading')}</h3>
                    <p className='legal-emphasis'>{t('privacy.general.objection.caseSpecific')}</p>
                    <p className='legal-emphasis'>{t('privacy.general.objection.directMarketing')}</p>

                    <h3>{t('privacy.general.complaint.heading')}</h3>
                    <p>{t('privacy.general.complaint.description')}</p>

                    <h3>{t('privacy.general.portability.heading')}</h3>
                    <p>{t('privacy.general.portability.description')}</p>

                    <h3>{t('privacy.general.access.heading')}</h3>
                    <p>{t('privacy.general.access.description')}</p>

                    <h3>{t('privacy.general.restriction.heading')}</h3>
                    <p>{t('privacy.general.restriction.description')}</p>
                    <ul>
                        {rightsItems.map(itemKey => (
                            <li key={itemKey}>{t(itemKey)}</li>
                        ))}
                    </ul>
                    <p>{t('privacy.general.restriction.final')}</p>

                    <h3>{t('privacy.general.ssl.heading')}</h3>
                    <p>{t('privacy.general.ssl.descriptionOne')}</p>
                    <p>{t('privacy.general.ssl.descriptionTwo')}</p>

                    <p>
                        {t('privacy.source.label')}:{' '}
                        <a href='https://www.datenschutzerklaerung.de' rel='noopener noreferrer' target='_blank'>
                            https://www.datenschutzerklaerung.de
                        </a>
                    </p>
                </Section>
            </article>
        </AppShell>
    )
}
