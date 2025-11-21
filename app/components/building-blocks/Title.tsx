'use client'

import { useTicket } from '@/app/TicketContext'
import getTicketTextColor, { TicketColor } from '@/app/functions/getTicketTextColor'

import { useMemo } from 'react'

interface TitleProps {
    textColor?: TicketColor
}

export default function Title({ textColor = 'text-light' }: TitleProps) {
    const { data } = useTicket()

    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    return <p className={`${colorCss} text-6xl`}>{data.title.toUpperCase()}</p>
}
