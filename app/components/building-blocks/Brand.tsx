import { useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'
import getTicketTextColor, { TicketColor } from '@/app/functions/getTicketTextColor'

import { useMemo } from 'react'

interface BrandProps {
    fontSize?: FontSize
    textColor?: TicketColor
}

export default function Brand({ fontSize = 'sm', textColor = 'text-light' }: BrandProps) {
    const { data } = useTicket()

    const fontSizeCss = useMemo(() => getFontSize(fontSize), [fontSize])
    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    return <p className={`${colorCss} ${fontSizeCss}`}>{data.brand}</p>
}
