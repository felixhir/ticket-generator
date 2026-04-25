'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DesignProvider, useDesign } from '@/components/studio/providers/DesignContext'
import { TicketProvider, useTicket } from '@/components/studio/providers/TicketContext'
import { AppSurface } from '@/components/ui/app-primitives'
import { Button } from '@/components/ui/button'
import type { StoredTicket } from '@/lib/domain/stored-ticket'
import { deserializeTicketContent, updateStoredTicketSnapshot } from '@/lib/domain/stored-ticket'
import { cn } from '@/lib/utils'
import {
    TicketConfigurationContent,
    type TicketConfigurationTab,
    ticketConfigurationTabs
} from './TicketConfigurationTabs'

type WizardStep = TicketConfigurationTab

export default function CreateTicketWizard({
    initialTicket,
    onBackToLanding,
    onComplete
}: {
    initialTicket: StoredTicket
    onBackToLanding: () => void
    onComplete: (ticket: StoredTicket) => void
}) {
    const initialContent = useMemo(() => deserializeTicketContent(initialTicket.content), [initialTicket.content])

    return (
        <TicketProvider key={initialTicket.id} initialData={initialContent}>
            <DesignProvider key={`${initialTicket.id}-design`} initialDesign={initialTicket.design}>
                <WizardContent
                    initialTicket={initialTicket}
                    onBackToLanding={onBackToLanding}
                    onComplete={onComplete}
                />
            </DesignProvider>
        </TicketProvider>
    )
}

function WizardContent({
    initialTicket,
    onBackToLanding,
    onComplete
}: {
    initialTicket: StoredTicket
    onBackToLanding: () => void
    onComplete: (ticket: StoredTicket) => void
}) {
    const { t } = useTranslation()
    const { data } = useTicket()
    const { design } = useDesign()
    const [activeStep, setActiveStep] = useState<WizardStep>('data')
    const activeStepIndex = ticketConfigurationTabs.indexOf(activeStep)
    const isLastStep = activeStepIndex === ticketConfigurationTabs.length - 1

    function goBack() {
        if (activeStepIndex === 0) {
            onBackToLanding()
            return
        }

        setActiveStep(ticketConfigurationTabs[activeStepIndex - 1])
    }

    function goNext() {
        if (!isLastStep) {
            setActiveStep(ticketConfigurationTabs[activeStepIndex + 1])
            return
        }

        onComplete(updateStoredTicketSnapshot(initialTicket, data, design))
    }

    return (
        <div className='flex flex-1 flex-col gap-6 lg:gap-10 xl:gap-14'>
            <nav aria-label={t('createWizard.stepsLabel')} className='print:hidden'>
                <AppSurface
                    as='ol'
                    variant='elevated'
                    padding='card'
                    className='flex flex-wrap items-center justify-center gap-app-card border-0 bg-transparent shadow-none sm:flex-nowrap sm:gap-app-section sm:border sm:bg-app-surface-elevated sm:shadow-none'
                >
                    {ticketConfigurationTabs.map((step, index) => {
                        const isActive = step === activeStep

                        return (
                            <li
                                key={step}
                                className={cn('flex items-center gap-app-section', !isActive && 'hidden sm:flex')}
                            >
                                <Button
                                    type='button'
                                    variant='ghost'
                                    className={cn(
                                        'h-auto gap-app-card rounded-app-control px-0 py-0 text-app-body hover:bg-transparent',
                                        isActive ? 'text-app-text-primary' : 'text-app-text-secondary'
                                    )}
                                    aria-current={isActive ? 'step' : undefined}
                                    onClick={() => setActiveStep(step)}
                                >
                                    <span
                                        className={cn(
                                            'grid size-10 place-items-center rounded-full text-app-small font-semibold transition-colors',
                                            isActive
                                                ? 'bg-app-border text-app-text-primary'
                                                : 'border border-app-border bg-transparent text-app-text-secondary'
                                        )}
                                    >
                                        {index + 1}
                                    </span>
                                    <span className='text-app-heading font-semibold'>
                                        {t(`createWizard.steps.${step}.label`)}
                                    </span>
                                </Button>
                                {index < ticketConfigurationTabs.length - 1 && (
                                    <span className='hidden h-px w-10 bg-app-border sm:block' aria-hidden />
                                )}
                            </li>
                        )
                    })}
                </AppSurface>
            </nav>

            <TicketConfigurationContent activeTab={activeStep} includePreview />

            <footer className='flex items-center justify-between gap-app-card border-t border-app-border pt-app-section print:hidden'>
                <Button type='button' variant='ghost' onClick={goBack}>
                    <ArrowLeft className='size-4' aria-hidden />
                    {t('createWizard.actions.back')}
                </Button>
                <Button type='button' onClick={goNext}>
                    {isLastStep ? t('createWizard.actions.create') : t('createWizard.actions.next')}
                    {!isLastStep && <ArrowRight className='size-4' aria-hidden />}
                </Button>
            </footer>
        </div>
    )
}
