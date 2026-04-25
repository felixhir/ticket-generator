'use client'

import 'altcha'
import type {} from 'altcha/types/react'
import { Loader2, Plus } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { AppSurface } from '@/components/ui/app-primitives'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cloneTicketContent, defaultTicketContent, type TicketContent } from '@/lib/domain/ticket'

type ImportStatus = { type: 'idle' } | { type: 'loading' } | { type: 'error'; message: string }
type ImportedTicketData = Omit<TicketContent, 'barcode'>
type ImportedTicketResponse = Omit<ImportedTicketData, 'datetime'> & {
    datetime: string | null
}
type ImportErrorCode =
    | 'link_not_found'
    | 'provider_unsupported'
    | 'page_fetch_failed'
    | 'no_event_data'
    | 'verification_failed'
type ImportErrorResponse = { error?: string; code?: ImportErrorCode }
type AltchaWidgetElement = HTMLElement & {
    reset: () => void
    verify: () => Promise<void> | void
}

class ImportClientError extends Error {
    constructor(readonly code: ImportErrorCode | null) {
        super(code ?? 'import_failed')
    }
}

function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

const subscribeToClientStore = () => () => undefined
const getClientSnapshot = () => true
const getServerSnapshot = () => false

function useIsClient() {
    return useSyncExternalStore(subscribeToClientStore, getClientSnapshot, getServerSnapshot)
}

function readAltchaPayload(form: HTMLFormElement) {
    const value = new FormData(form).get('altcha')
    return typeof value === 'string' && value ? value : null
}

async function getAltchaPayload(form: HTMLFormElement, widget: AltchaWidgetElement | null) {
    const currentPayload = readAltchaPayload(form)
    if (currentPayload) return currentPayload
    if (!widget) throw new ImportClientError('verification_failed')

    await widget.verify()
    const verifiedPayload = readAltchaPayload(form)
    if (!verifiedPayload) throw new ImportClientError('verification_failed')
    return verifiedPayload
}

async function importEventFromUrl(url: string, altcha: string): Promise<ImportedTicketData> {
    const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, altcha })
    })

    const data = (await res.json()) as ImportedTicketResponse | ImportErrorResponse
    if (!res.ok) {
        throw new ImportClientError('code' in data && data.code ? data.code : null)
    }

    const ticketData = data as ImportedTicketResponse
    return {
        ...ticketData,
        datetime: ticketData.datetime ? new Date(ticketData.datetime) : null
    }
}

function getImportErrorMessage(t: (key: string) => string, err: unknown) {
    if (err instanceof ImportClientError && err.code) {
        return t(`import.errors.${err.code}`)
    }
    return t('import.failed')
}

export default function ImportEventForm({
    onCreateManualTicket,
    onImported
}: {
    onCreateManualTicket: () => void
    onImported: (content: TicketContent) => void
}) {
    const { t } = useTranslation()
    const [url, setUrl] = useState('')
    const [status, setStatus] = useState<ImportStatus>({ type: 'idle' })
    const [isAltchaVerifying, setIsAltchaVerifying] = useState(false)
    const altchaRef = useRef<AltchaWidgetElement | null>(null)
    const isClient = useIsClient()
    const isBusy = status.type === 'loading' || isAltchaVerifying

    useEffect(() => {
        if (!isClient) return

        const widget = altchaRef.current
        if (!widget) return

        function handleAltchaStateChange(event: Event) {
            const state = (event as CustomEvent<{ state?: string }>).detail?.state
            setIsAltchaVerifying(state === 'verifying')
        }

        widget.addEventListener('statechange', handleAltchaStateChange)
        return () => widget.removeEventListener('statechange', handleAltchaStateChange)
    }, [isClient])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const trimmed = url.trim()
        if (!trimmed) return

        if (!isValidUrl(trimmed)) {
            setStatus({ type: 'error', message: t('import.invalidUrl') })
            return
        }

        setStatus({ type: 'loading' })
        try {
            const altcha = await getAltchaPayload(form, altchaRef.current)
            const imported = await importEventFromUrl(trimmed, altcha)
            onImported({ ...cloneTicketContent(defaultTicketContent), ...imported, barcode: imported.title })
            setUrl('')
            setStatus({ type: 'idle' })
        } catch (err) {
            setStatus({ type: 'error', message: getImportErrorMessage(t, err) })
        } finally {
            setIsAltchaVerifying(false)
            altchaRef.current?.reset()
        }
    }

    return (
        <>
            <AppSurface as='form' className='text-left' padding='card' variant='elevated' onSubmit={handleSubmit}>
                <Field>
                    <FieldLabel htmlFor='event-url' className='sr-only'>
                        {t('import.urlLabel')}
                    </FieldLabel>
                    <div className='flex min-w-0 items-center gap-app-card'>
                        <Input
                            id='event-url'
                            className='min-w-0 flex-1'
                            type='url'
                            value={url}
                            onChange={event => {
                                setUrl(event.target.value)
                                if (status.type === 'error') setStatus({ type: 'idle' })
                            }}
                            placeholder={t('import.placeholder')}
                            disabled={isBusy}
                        />
                        <Button
                            type='submit'
                            variant='default'
                            size='icon'
                            className='shrink-0'
                            disabled={isBusy || !url.trim()}
                            aria-label={isBusy ? t('import.importing') : t('import.action')}
                        >
                            <span className='flex size-4 shrink-0 items-center justify-center' aria-hidden>
                                {isBusy ? <Loader2 className='size-4 animate-spin' /> : <Plus className='size-4' />}
                            </span>
                        </Button>
                    </div>
                </Field>
                {isClient && (
                    <altcha-widget
                        ref={altchaRef}
                        auto='onsubmit'
                        challenge='/api/altcha/challenge'
                        display='invisible'
                        name='altcha'
                    />
                )}
                {status.type === 'error' && (
                    <p className='mt-app-card text-app-caption text-app-danger'>{status.message}</p>
                )}
            </AppSurface>
            <Button type='button' variant='ghost' className='w-full' onClick={onCreateManualTicket}>
                {t('landing.enterManually')}
            </Button>
        </>
    )
}
