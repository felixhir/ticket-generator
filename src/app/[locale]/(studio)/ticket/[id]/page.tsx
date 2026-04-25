import type { Metadata } from 'next'
import TicketStudio from '@/components/studio/TicketStudio'
import type { Locale } from '@/lib/i18n/routing'
import { createTranslator } from '@/lib/i18n/server'

export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string; locale: Locale }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = createTranslator(locale)

    return {
        title: t('ticketDetail.pageTitle')
    }
}

export default async function TicketPage({ params }: { params: Promise<{ id: string; locale: Locale }> }) {
    const { id, locale } = await params

    return <TicketStudio locale={locale} page='ticket' ticketId={id} />
}
