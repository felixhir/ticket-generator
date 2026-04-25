'use client'

import { Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
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
import { SectionEyebrow } from '@/components/ui/app-primitives'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatTicketPriceAmount, getCurrencyCode } from '@/lib/domain/currency'
import type { StoredTicket } from '@/lib/domain/stored-ticket'

interface StoredTicketPreviewProps {
    href: string
    onDelete: () => void
    ticket: StoredTicket
}

export default function StoredTicketPreview({ href, onDelete, ticket }: StoredTicketPreviewProps) {
    const { i18n, t } = useTranslation()
    const date = ticket.content.datetime ? new Date(ticket.content.datetime) : null
    const language = i18n.resolvedLanguage ?? i18n.language
    const ticketName = ticket.content.title || t('storedTicket.fallbackName')
    const formattedPrice = formatTicketPriceAmount(ticket.content.price, language)

    return (
        <Card className='group relative flex h-full flex-col p-app-section text-left transition hover:border-app-accent'>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute top-app-card right-app-card z-10 text-app-text-secondary hover:text-app-danger'
                        aria-label={t('storedTicket.deleteLabel', { title: ticketName })}
                    >
                        <Trash2Icon className='size-4' aria-hidden />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('storedTicket.deleteConfirmTitle')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('storedTicket.deleteConfirmMessage', { title: ticketName })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel size='sm'>{t('storedTicket.deleteCancel')}</AlertDialogCancel>
                        <AlertDialogAction variant='destructive' size='sm' onClick={onDelete}>
                            {t('storedTicket.deleteConfirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button
                asChild
                type='button'
                variant='ghost'
                className='flex h-full flex-1 flex-col items-start justify-start gap-4 rounded-app-card p-0 pr-12 text-left whitespace-normal hover:bg-transparent'
                aria-label={t('storedTicket.openLabel', { title: ticketName })}
            >
                <Link href={href}>
                    <SectionEyebrow>
                        {date ? date.toLocaleDateString(language) : t('storedTicket.noDate')}
                    </SectionEyebrow>
                    <div className='flex flex-col gap-1'>
                        <h3 className='line-clamp-2 text-app-heading leading-tight text-app-text-primary'>
                            {ticket.content.title}
                        </h3>
                        <div className='flex min-h-5 items-baseline gap-1'>
                            <p className='line-clamp-1 text-app-small text-app-text-secondary'>
                                {ticket.content.venue || t('storedTicket.noVenue')}
                            </p>
                            <span className='shrink-0 text-app-small text-app-text-secondary' aria-hidden>
                                ·
                            </span>
                            <p className='shrink-0 text-app-small text-app-text-secondary'>
                                {formattedPrice} {getCurrencyCode(ticket.content.currency)}
                            </p>
                        </div>
                    </div>
                </Link>
            </Button>
        </Card>
    )
}
