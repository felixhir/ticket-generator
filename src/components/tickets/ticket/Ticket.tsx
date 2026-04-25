'use client'

import { Roboto_Mono } from 'next/font/google'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { Layout } from '@/lib/domain/design'

import BandLayout from '../layouts/band/Layout'
import DefaultLayout from '../layouts/default/Layout'
import PictureLayout from '../layouts/image/Layout'
import { TicketSurface } from '../ticket-primitives'

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    weight: ['400', '700']
})

interface TicketProps {
    layout: Layout
}

export default function Ticket({ layout }: TicketProps) {
    const { t } = useTranslation()

    const renderLayout = useCallback(() => {
        switch (layout) {
            case 'default':
                return <DefaultLayout />
            case 'picture':
                return <PictureLayout />
            case 'band':
                return <BandLayout />
            default:
                return <p>{t('ticket.missingLayout')}</p>
        }
    }, [layout, t])

    return <TicketSurface className={robotoMono.className}>{renderLayout()}</TicketSurface>
}
