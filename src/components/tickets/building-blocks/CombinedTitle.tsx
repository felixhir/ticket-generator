'use client'

import { useMemo } from 'react'
import { useTicket } from '@/components/studio/providers/TicketContext'
import getFontSize, { FontSize } from '@/lib/ticket/getFontSize'
import getTicketTextColor, { TicketColor } from '@/lib/ticket/getTicketTextColor'

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
