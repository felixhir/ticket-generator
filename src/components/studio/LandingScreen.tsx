'use client'

import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import type { TicketContent } from '@/lib/domain/ticket'
import ImportEventForm from './ImportEventForm'

export default function LandingScreen({
    onCreateImportedTicket,
    onCreateManualTicket
}: {
    onCreateImportedTicket: (content: TicketContent) => void
    onCreateManualTicket: () => void
}) {
    const { t } = useTranslation()

    return (
        <div className='mx-auto flex w-full max-w-app-narrow flex-1 items-center py-app-section sm:py-app-frame'>
            <Card className='w-full border-transparent p-app-section text-center'>
                <h2 className='mx-auto max-w-2xl text-nowrap text-app-display leading-none text-app-text-primary'>
                    {t('landing.title')}
                </h2>
                <p className='mx-auto mt-app-card max-w-xl text-pretty text-app-body text-app-text-secondary sm:mt-app-control-y'>
                    {t('landing.description')}
                </p>
                <div className='mx-auto mt-app-frame grid max-w-xl gap-app-card sm:mt-12'>
                    <ImportEventForm onImported={onCreateImportedTicket} onCreateManualTicket={onCreateManualTicket} />
                </div>
            </Card>
        </div>
    )
}
