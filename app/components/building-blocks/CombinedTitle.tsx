'use client'

import { useTicket } from '@/app/contexts/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'
import getTicketTextColor, { TicketColor } from '@/app/functions/getTicketTextColor'

import { useMemo } from 'react'

interface CombinedTitleProps {
    subtitleFontSize?: FontSize
    titleFontSize?: FontSize
    textColor?: TicketColor
}

export default function CombinedTitle({
    subtitleFontSize: subtitleFontSize = 'sm',
    titleFontSize: titleFontSize = 'md',
    textColor = 'text-light'
}: CombinedTitleProps) {
    const { data } = useTicket()

    const tourCss = useMemo(() => getFontSize(subtitleFontSize), [subtitleFontSize])
    const bandCss = useMemo(() => getFontSize(titleFontSize), [titleFontSize])
    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    return (
        <div className={`${colorCss}`}>
            <p className={`${tourCss} font-semibold -mb-2`}>{data.subtitle}</p>
            <p className={`${bandCss} font-bold`}>{data.title}</p>
        </div>
    )
}
