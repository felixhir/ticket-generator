'use client'

import { FileJson, Printer, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DesignProvider, useDesign } from '@/components/studio/providers/DesignContext'
import { TicketProvider, useTicket } from '@/components/studio/providers/TicketContext'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { AppSurface, EmptyState, PreviewFrame } from '@/components/ui/app-primitives'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cloneDesign, type Design, defaultDesign } from '@/lib/domain/design'
import type { StoredTicket } from '@/lib/domain/stored-ticket'
import {
    createStoredTicket,
    deserializeTicketContent,
    parseStoredTicketJson,
    serializeTicketContent,
    updateStoredTicketSnapshot,
    upsertStoredTicket
} from '@/lib/domain/stored-ticket'
import type { TicketContent } from '@/lib/domain/ticket'
import { cloneTicketContent, defaultTicketContent } from '@/lib/domain/ticket'
import type { Locale } from '@/lib/i18n/routing'
import { getLocalizedPath } from '@/lib/i18n/routing'
import { readStoredTickets, writeStoredTickets } from '@/lib/storage/tickets'
import type { StudioPage } from './AppNavigation'
import CreateTicketWizard from './CreateTicketWizard'
import LandingScreen from './LandingScreen'
import PrintoutDialog from './PrintoutDialog'
import StoredTicketsScreen from './StoredTicketsScreen'
import TicketConfigurationTabs, { type TicketConfigurationTab } from './TicketConfigurationTabs'
import TicketPreviewCanvas from './TicketPreviewCanvas'

type CreateFlow = 'landing' | 'wizard'

export default function TicketStudio({
    locale,
    page,
    ticketId
}: {
    locale: Locale
    page: StudioPage
    ticketId?: string
}) {
    const router = useRouter()
    const { t } = useTranslation()
    const [createFlow, setCreateFlow] = useState<CreateFlow>('landing')
    const [storedTickets, setStoredTickets] = useState<StoredTicket[]>([])
    const [currentTicket, setCurrentTicket] = useState<StoredTicket | null>(null)
    const [draftTicket, setDraftTicket] = useState<StoredTicket | null>(null)
    const [isStorageReady, setIsStorageReady] = useState(false)
    const siteName = t('app.name')
    const pageTitle = getStudioPageTitle(page, currentTicket, t)

    useEffect(() => {
        const tickets = readStoredTickets()
        setStoredTickets(tickets)
        setCurrentTicket(ticketId ? (tickets.find(ticket => ticket.id === ticketId) ?? null) : (tickets[0] ?? null))
        setIsStorageReady(true)
    }, [ticketId])

    useEffect(() => {
        if (!isStorageReady) return
        writeStoredTickets(storedTickets)
    }, [isStorageReady, storedTickets])

    useEffect(() => {
        document.title = `${pageTitle} | ${siteName}`
    }, [pageTitle, siteName])

    const updateCurrentTicket = useCallback((ticket: StoredTicket) => {
        setCurrentTicket(ticket)
        setStoredTickets(prev => upsertStoredTicket(prev, ticket))
    }, [])

    const createManualTicket = useCallback(() => {
        const ticket = createStoredTicket(cloneTicketContent(defaultTicketContent), cloneDesign(defaultDesign))
        setDraftTicket(ticket)
        setCreateFlow('wizard')
    }, [])

    const createImportedTicket = useCallback((content: TicketContent) => {
        const ticket = createStoredTicket(
            { ...cloneTicketContent(defaultTicketContent), ...content, barcode: content.barcode || content.title },
            cloneDesign(defaultDesign)
        )
        setDraftTicket(ticket)
        setCreateFlow('wizard')
    }, [])

    const finishCreatedTicket = useCallback(
        (ticket: StoredTicket) => {
            setCurrentTicket(ticket)
            setStoredTickets(prev => {
                const next = upsertStoredTicket(prev, ticket)
                writeStoredTickets(next)
                return next
            })
            router.push(getLocalizedPath(locale, `/ticket/${ticket.id}`))
        },
        [locale, router]
    )

    const deleteTicket = useCallback(
        (ticketId: string) => {
            setStoredTickets(prev => prev.filter(ticket => ticket.id !== ticketId))
            if (currentTicket?.id === ticketId) setCurrentTicket(null)
        },
        [currentTicket?.id]
    )

    const importJsonTicket = useCallback(async (file: File) => {
        const ticket = parseStoredTicketJson(await file.text())
        if (!ticket) throw new Error('Invalid ticket JSON')

        setCurrentTicket(ticket)
        setStoredTickets(prev => upsertStoredTicket(prev, ticket))
    }, [])

    if (!isStorageReady) return <LoadingState />

    return (
        <>
            {page === 'create' && createFlow === 'landing' && (
                <LandingScreen
                    onCreateImportedTicket={createImportedTicket}
                    onCreateManualTicket={createManualTicket}
                />
            )}
            {page === 'create' && createFlow === 'wizard' && draftTicket && (
                <CreateTicketWizard
                    initialTicket={draftTicket}
                    onBackToLanding={() => setCreateFlow('landing')}
                    onComplete={finishCreatedTicket}
                />
            )}
            {page === 'stored' && (
                <StoredTicketsScreen
                    locale={locale}
                    onDeleteTicket={deleteTicket}
                    onImportTicket={importJsonTicket}
                    storedTickets={storedTickets}
                />
            )}
            {page === 'ticket' && currentTicket && (
                <EditableTicketWorkspace
                    currentTicket={currentTicket}
                    locale={locale}
                    onDeleteTicket={deleteTicket}
                    onTicketChange={updateCurrentTicket}
                />
            )}
            {page === 'ticket' && !currentTicket && <MissingTicket locale={locale} />}
        </>
    )
}

function EditableTicketWorkspace({
    currentTicket,
    locale,
    onDeleteTicket,
    onTicketChange
}: {
    currentTicket: StoredTicket
    locale: Locale
    onDeleteTicket: (ticketId: string) => void
    onTicketChange: (ticket: StoredTicket) => void
}) {
    const hydrateContent = useMemo(() => deserializeTicketContent(currentTicket.content), [currentTicket.content])
    const [draftVersion, setDraftVersion] = useState(0)

    return (
        <TicketProvider key={`${currentTicket.id}-${draftVersion}`} initialData={hydrateContent}>
            <DesignProvider key={`${currentTicket.id}-${draftVersion}-design`} initialDesign={currentTicket.design}>
                <TicketDetailWorkspace
                    currentTicket={currentTicket}
                    locale={locale}
                    onDeleteTicket={onDeleteTicket}
                    onDiscard={() => setDraftVersion(version => version + 1)}
                    onSave={onTicketChange}
                />
            </DesignProvider>
        </TicketProvider>
    )
}

function TicketDetailWorkspace({
    currentTicket,
    locale,
    onDeleteTicket,
    onDiscard,
    onSave
}: {
    currentTicket: StoredTicket
    locale: Locale
    onDeleteTicket: (ticketId: string) => void
    onDiscard: () => void
    onSave: (ticket: StoredTicket) => void
}) {
    const router = useRouter()
    const { t } = useTranslation()
    const { data } = useTicket()
    const { design } = useDesign()
    const [activeTab, setActiveTab] = useState<TicketConfigurationTab>('data')
    const [isPrintoutOpen, setIsPrintoutOpen] = useState(false)
    const hasChanges = !isSameTicketConfiguration(currentTicket, data, design)
    const title = data.title.trim() || t('storedTicket.fallbackName')
    const fileBaseName = getTicketExportFileName(title)

    function saveChanges() {
        onSave(updateStoredTicketSnapshot(currentTicket, data, design))
    }

    function exportJson() {
        const ticket = createCurrentDraftTicket(currentTicket, data, design)
        const blob = new Blob([JSON.stringify(ticket, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        downloadUrl(url, `${fileBaseName}.json`)
        URL.revokeObjectURL(url)
    }

    return (
        <div className='flex flex-1 flex-col gap-app-section py-app-section pb-[calc(var(--spacing-app-frame)*4)] print:py-0'>
            <header className='flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-2 print:hidden'>
                <h2 className='order-2 min-w-0 flex-1 break-words text-app-title font-bold leading-tight text-app-text-primary [overflow-wrap:anywhere] sm:order-1 sm:pr-2'>
                    {title}
                </h2>
                <div className='order-1 flex w-full flex-row flex-wrap gap-2 sm:order-2 sm:w-auto sm:shrink-0 sm:items-center sm:justify-end sm:gap-1.5'>
                    <Button
                        type='button'
                        variant='default'
                        className='max-sm:min-h-10 max-sm:min-w-0 max-sm:flex-1 max-sm:basis-[calc(50%-0.25rem)] sm:flex-initial'
                        onClick={() => setIsPrintoutOpen(true)}
                    >
                        <Printer className='size-4' aria-hidden />
                        {t('ticketDetail.printout')}
                    </Button>
                    <Button
                        type='button'
                        variant='outline'
                        className='max-sm:min-h-10 max-sm:min-w-0 max-sm:flex-1 max-sm:basis-[calc(50%-0.25rem)] sm:flex-initial'
                        onClick={exportJson}
                    >
                        <FileJson className='size-4' aria-hidden />
                        {t('ticketDetail.export')}
                    </Button>
                </div>
            </header>

            <PreviewFrame>
                <TicketPreviewCanvas fitMode='width' />
            </PreviewFrame>

            <TicketConfigurationTabs activeTab={activeTab} onActiveTabChange={setActiveTab} />

            <div className='mt-app-card flex justify-center print:hidden'>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            type='button'
                            variant='ghost'
                            className='inline-flex shrink-0 items-center gap-2 rounded-full border border-app-danger px-4 py-2 text-app-danger hover:bg-transparent hover:text-app-danger'
                        >
                            <Trash2 className='size-4 shrink-0' aria-hidden />
                            {t('ticketDetail.delete')}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('storedTicket.deleteConfirmTitle')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('storedTicket.deleteConfirmMessage', { title })}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel size='sm'>{t('storedTicket.deleteCancel')}</AlertDialogCancel>
                            <AlertDialogAction
                                variant='destructive'
                                size='sm'
                                onClick={() => {
                                    onDeleteTicket(currentTicket.id)
                                    router.push(getLocalizedPath(locale, '/stored'))
                                }}
                            >
                                {t('storedTicket.deleteConfirm')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <PrintoutDialog open={isPrintoutOpen} onOpenChange={setIsPrintoutOpen} fileBaseName={fileBaseName} />

            {hasChanges && <UnsavedTicketChangesBar onDiscard={onDiscard} onSave={saveChanges} />}
        </div>
    )
}

function UnsavedTicketChangesBar({ onDiscard, onSave }: { onDiscard: () => void; onSave: () => void }) {
    const { t } = useTranslation()

    return (
        <div className='fixed inset-x-0 bottom-app-section z-30 flex justify-center px-app-card print:hidden'>
            <AppSurface
                variant='floating'
                padding='none'
                className='flex max-w-full flex-wrap items-center justify-center gap-app-card px-app-section py-app-card'
            >
                <p className='text-app-small text-app-text-secondary'>{t('ticketDetail.unsavedChanges')}</p>
                <div className='flex items-center gap-app-card'>
                    <Button type='button' variant='ghost' onClick={onDiscard}>
                        {t('ticketDetail.discardChanges')}
                    </Button>
                    <Button type='button' onClick={onSave}>
                        {t('ticketDetail.saveChanges')}
                    </Button>
                </div>
            </AppSurface>
        </div>
    )
}

function isSameTicketConfiguration(ticket: StoredTicket, data: TicketContent, design: Design) {
    return (
        JSON.stringify(ticket.content) === JSON.stringify(serializeTicketContent(data)) &&
        JSON.stringify(ticket.design) === JSON.stringify(design)
    )
}

function createCurrentDraftTicket(ticket: StoredTicket, data: TicketContent, design: Design): StoredTicket {
    return {
        ...ticket,
        content: serializeTicketContent(data),
        design: cloneDesign(design)
    }
}

function downloadUrl(url: string, filename: string) {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.append(link)
    link.click()
    link.remove()
}

function getTicketExportFileName(title: string) {
    const normalizedTitle = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    return normalizedTitle || 'ticket'
}

function getStudioPageTitle(page: StudioPage, currentTicket: StoredTicket | null, t: (key: string) => string) {
    if (page === 'create') return t('landing.title')
    if (page === 'stored') return t('storedTickets.title')

    return currentTicket?.content.title.trim() || t('ticketDetail.pageTitle')
}

function LoadingState() {
    const { t } = useTranslation()

    return <EmptyState>{t('ticketDetail.loading')}</EmptyState>
}

function MissingTicket({ locale }: { locale: Locale }) {
    const { t } = useTranslation()

    return (
        <Card className='m-auto w-full max-w-lg p-app-section text-center'>
            <h2 className='text-app-heading text-app-text-primary'>{t('ticketDetail.notFoundTitle')}</h2>
            <p className='text-app-small text-app-text-secondary'>{t('ticketDetail.notFoundDescription')}</p>
            <div className='mt-app-card flex flex-wrap justify-center gap-app-card'>
                <Button asChild variant='outline'>
                    <Link href={getLocalizedPath(locale, '/stored')}>{t('ticketDetail.backToStored')}</Link>
                </Button>
                <Button asChild>
                    <Link href={getLocalizedPath(locale, '/create')}>{t('ticketDetail.createNew')}</Link>
                </Button>
            </div>
        </Card>
    )
}

export type { StoredTicket }
