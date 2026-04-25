'use client'

import { Plus } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppSurface } from '@/components/ui/app-primitives'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cloneTicketContent, defaultTicketContent, type TicketContent } from '@/lib/domain/ticket'
import { importEventFromUrl, isValidUrl } from '@/lib/import-event/client'

type ImportStatus = { type: 'idle' } | { type: 'loading' } | { type: 'error'; message: string }

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

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const trimmed = url.trim()
        if (!trimmed) return

        if (!isValidUrl(trimmed)) {
            setStatus({ type: 'error', message: t('import.invalidUrl') })
            return
        }

        setStatus({ type: 'loading' })
        try {
            const imported = await importEventFromUrl(trimmed)
            onImported({ ...cloneTicketContent(defaultTicketContent), ...imported, barcode: imported.title })
            setUrl('')
            setStatus({ type: 'idle' })
        } catch {
            setStatus({ type: 'error', message: t('import.failed') })
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
                            disabled={status.type === 'loading'}
                        />
                        <Button
                            type='submit'
                            variant='default'
                            size='icon'
                            className='shrink-0'
                            disabled={status.type === 'loading' || !url.trim()}
                            aria-label={status.type === 'loading' ? t('import.importing') : t('import.action')}
                        >
                            <Plus className='size-4' aria-hidden />
                        </Button>
                    </div>
                </Field>
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
