import { FileUp } from 'lucide-react'
import { type ChangeEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EmptyState, SectionHeader } from '@/components/ui/app-primitives'
import { Button } from '@/components/ui/button'
import type { StoredTicket } from '@/lib/domain/stored-ticket'
import type { Locale } from '@/lib/i18n/routing'
import { getLocalizedPath } from '@/lib/i18n/routing'
import StoredTicketPreview from './StoredTicketPreview'

const MAX_TICKET_IMPORT_FILE_BYTES = 15 * 1024 * 1024
const TICKET_JSON_MIME_TYPES = new Set(['application/json', 'text/json'])

export default function StoredTicketsScreen({
    locale,
    onDeleteTicket,
    onImportTicket,
    storedTickets
}: {
    locale: Locale
    onDeleteTicket: (ticketId: string) => void
    onImportTicket: (file: File) => Promise<void>
    storedTickets: StoredTicket[]
}) {
    const { t } = useTranslation()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [importError, setImportError] = useState<string | null>(null)

    async function handleImportFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return

        setImportError(null)
        if (!isJsonTicketFile(file)) {
            setImportError(t('storedTickets.importUnsupportedFile'))
            return
        }

        if (!isSupportedTicketImportSize(file)) {
            setImportError(t('storedTickets.importTooLarge'))
            return
        }

        try {
            await onImportTicket(file)
        } catch {
            setImportError(t('storedTickets.importFailed'))
        }
    }

    return (
        <section className='flex flex-1 flex-col gap-app-section'>
            <SectionHeader
                title={t('storedTickets.title')}
                description={t('storedTickets.description')}
                className='[&_h2]:text-app-title [&_h2]:font-bold'
                actions={
                    <Button type='button' variant='ghost' onClick={() => fileInputRef.current?.click()}>
                        <FileUp className='size-4' aria-hidden />
                        {t('import.action')}
                    </Button>
                }
            >
                <input
                    ref={fileInputRef}
                    className='hidden'
                    type='file'
                    accept='application/json,.json'
                    aria-label={t('storedTickets.importJsonLabel')}
                    onChange={handleImportFileChange}
                />
            </SectionHeader>
            {importError && (
                <p className='text-app-small text-app-danger' role='alert'>
                    {importError}
                </p>
            )}
            {storedTickets.length > 0 ? (
                <div className='grid gap-app-card sm:grid-cols-2 xl:grid-cols-3'>
                    {storedTickets.map(ticket => (
                        <StoredTicketPreview
                            key={ticket.id}
                            ticket={ticket}
                            href={getLocalizedPath(locale, `/ticket/${ticket.id}`)}
                            onDelete={() => onDeleteTicket(ticket.id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState>{t('storedTickets.empty')}</EmptyState>
            )}
        </section>
    )
}

function isJsonTicketFile(file: File) {
    const hasJsonName = file.name.toLowerCase().endsWith('.json')
    const hasJsonMimeType = file.type === '' || TICKET_JSON_MIME_TYPES.has(file.type)

    return hasJsonName && hasJsonMimeType
}

function isSupportedTicketImportSize(file: File) {
    return file.size > 0 && file.size <= MAX_TICKET_IMPORT_FILE_BYTES
}
