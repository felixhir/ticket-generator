'use client'

import { useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'

import { useMemo } from 'react'

interface ConcertInfoProps {
    tourFontSize?: FontSize
    bandFontSize?: FontSize
    tourColorCssVar?: string
    bandColorCssVar?: string
}

export default function ConcertInfo({
    tourFontSize = 'sm',
    bandFontSize = 'md',
    tourColorCssVar = 'ticket-text-light',
    bandColorCssVar = 'ticket-text-light'
}: ConcertInfoProps) {
    const { data } = useTicket()

    const tourCss = useMemo(() => getFontSize(tourFontSize), [tourFontSize])
    const bandCss = useMemo(() => getFontSize(bandFontSize), [bandFontSize])

    return (
        <div>
            <p className={`${tourCss} text-${tourColorCssVar} font-semibold`}>{data.tour}</p>
            <p className={`${bandCss} text-${bandColorCssVar} font-bold`}>{data.band}</p>
        </div>
    )
}
