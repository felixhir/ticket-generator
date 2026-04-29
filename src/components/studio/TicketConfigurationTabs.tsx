import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PreviewFrame, SegmentedControl } from '@/components/ui/app-primitives'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import DesignPanel, { PatternMediaSection } from './panels/DesignPanel'
import TicketEditor from './panels/TicketEditor'
import TicketPreviewCanvas from './TicketPreviewCanvas'

export type TicketConfigurationTab = 'data' | 'layout' | 'colors'

export const ticketConfigurationTabs: TicketConfigurationTab[] = ['data', 'layout', 'colors']

export default function TicketConfigurationTabs({
    activeTab,
    className,
    onActiveTabChange
}: {
    activeTab: TicketConfigurationTab
    className?: string
    onActiveTabChange: (tab: TicketConfigurationTab) => void
}) {
    const { t } = useTranslation()

    const tabIndex = useCallback(() => {
        return ticketConfigurationTabs.indexOf(activeTab)
    }, [activeTab])

    return (
        <div className={cn('flex w-full flex-col gap-app-section', className)}>
            <nav aria-label={t('ticketDetail.configurationTabs')} className='flex justify-center'>
                <SegmentedControl activeTab={tabIndex()}>
                    {ticketConfigurationTabs.map(tab => (
                        <Button
                            key={tab}
                            type='button'
                            variant='segmented'
                            className={cn({ 'text-primary-foreground': activeTab === tab })}
                            aria-current={activeTab === tab ? 'page' : undefined}
                            onClick={() => onActiveTabChange(tab)}
                        >
                            {t(`createWizard.steps.${tab}.label`)}
                        </Button>
                    ))}
                </SegmentedControl>
            </nav>

            <TicketConfigurationContent activeTab={activeTab} />
        </div>
    )
}
export function TicketConfigurationContent({
    activeTab,
    includePreview = false
}: {
    activeTab: TicketConfigurationTab
    includePreview?: boolean
}) {
    const [displayTab, setDisplayTab] = useState(activeTab)
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        setVisible(false)

        const timeout = setTimeout(() => {
            setDisplayTab(activeTab)
            setVisible(true)
        }, 150)

        return () => clearTimeout(timeout)
    }, [activeTab])

    return (
        <div
            className={cn('transition-all duration-150', {
                'opacity-100 translate-y-0': visible,
                'opacity-0 translate-y-1': !visible
            })}
        >
            {displayTab === 'data' && (
                <div className='mx-auto w-full max-w-3xl'>
                    <TicketEditor variant='plain' stackGap='section' />
                </div>
            )}

            {displayTab === 'layout' && <LayoutConfiguration includePreview={includePreview} />}

            {displayTab === 'colors' && <ColorsConfiguration includePreview={includePreview} />}
        </div>
    )
}

function LayoutConfiguration({ includePreview }: { includePreview: boolean }) {
    if (!includePreview) {
        return (
            <div className='grid gap-app-section'>
                <DesignPanel sections={['layout', 'dimensions']} showHeader={false} showSectionTitles={false} />
                <Card className='w-full px-app-section py-app-frame'>
                    <PatternMediaSection />
                </Card>
            </div>
        )
    }

    return (
        <div className='flex w-full min-w-0 flex-col gap-y-app-frame'>
            <div className='grid items-stretch gap-x-app-section gap-y-app-frame xl:grid-cols-[minmax(0,1fr)_24rem]'>
                <PreviewFrame>
                    <TicketPreviewCanvas />
                </PreviewFrame>
                <DesignPanel
                    className='h-full min-h-0'
                    sections={['layout']}
                    showHeader={false}
                    showSectionTitles={false}
                />
            </div>
            <Card className='w-full px-app-section py-app-frame'>
                <PatternMediaSection includeDimensions />
            </Card>
        </div>
    )
}

function ColorsConfiguration({ includePreview }: { includePreview: boolean }) {
    if (!includePreview) {
        return <DesignPanel sections={['colors']} showHeader={false} showSectionTitles={false} />
    }

    return (
        <div className='grid items-stretch gap-x-app-section gap-y-app-frame xl:grid-cols-[minmax(0,1fr)_24rem]'>
            <PreviewFrame>
                <TicketPreviewCanvas />
            </PreviewFrame>
            <DesignPanel
                className='h-full min-h-0'
                sections={['colors']}
                showHeader={false}
                showSectionTitles={false}
            />
        </div>
    )
}
