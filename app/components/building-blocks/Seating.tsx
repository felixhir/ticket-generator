import { useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'
import getTicketTextColor, { TicketColor } from '@/app/functions/getTicketTextColor'

import { useMemo } from 'react'

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
