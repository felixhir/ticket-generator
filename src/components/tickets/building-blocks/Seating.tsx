'use client'

import { useMemo } from 'react'
import { useTicket } from '@/components/studio/providers/TicketContext'
import getFontSize, { FontSize } from '@/lib/ticket/getFontSize'
import getTicketTextColor, { TicketColor } from '@/lib/ticket/getTicketTextColor'

interface SeatingProps {
    fontSize?: FontSize
    textColor?: TicketColor
}

export default function Seating({ fontSize = 'sm', textColor = 'text-light' }: SeatingProps) {
    const { data } = useTicket()

    const fontSizeCss = useMemo(() => getFontSize(fontSize), [fontSize])
    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    return <p className={`${fontSizeCss} ${colorCss}`}>{data.seatType}</p>
}
