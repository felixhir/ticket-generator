'use client'

import { useMemo } from 'react'
import { useTicket } from '@/components/studio/providers/TicketContext'
import getTicketTextColor, { TicketColor } from '@/lib/ticket/getTicketTextColor'

interface TitleProps {
    textColor?: TicketColor
}

export default function Title({ textColor = 'text-light' }: TitleProps) {
    const { data } = useTicket()

    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    return <p className={`${colorCss} text-ticket-display`}>{data.title.toUpperCase()}</p>
}
