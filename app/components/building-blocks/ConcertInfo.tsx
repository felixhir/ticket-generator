'use client'

import { useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'
import getTicketTextColor, { TicketColor } from '@/app/functions/getTicketTextColor'

import { useMemo } from 'react'

interface ConcertInfoProps {
    tourFontSize?: FontSize
    bandFontSize?: FontSize
    textColor?: TicketColor
}

export default function ConcertInfo({
    tourFontSize = 'sm',
    bandFontSize = 'md',
    textColor = 'text-light'
}: ConcertInfoProps) {
    const { data } = useTicket()

    const tourCss = useMemo(() => getFontSize(tourFontSize), [tourFontSize])
    const bandCss = useMemo(() => getFontSize(bandFontSize), [bandFontSize])
    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    return (
        <div className={`${colorCss}`}>
            <p className={`${tourCss} font-semibold`}>{data.tour}</p>
            <p className={`${bandCss} font-bold`}>{data.band}</p>
        </div>
    )
}
