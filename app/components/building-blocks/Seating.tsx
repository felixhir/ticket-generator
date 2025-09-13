import { useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'

import { useMemo } from 'react'

interface SeatingProps {
    fontSize?: FontSize
    colorCssVar?: string
}

export default function Seating({ fontSize = 'sm', colorCssVar = 'ticket-light' }: SeatingProps) {
    const { data } = useTicket()

    const fontSizeCss = useMemo(() => getFontSize(fontSize), [fontSize])

    return <p className={`${fontSizeCss} text-${colorCssVar}`}>{data.seatType}</p>
}
