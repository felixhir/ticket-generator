import { useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'

import { useMemo } from 'react'

interface BrandProps {
    fontSize?: FontSize
    colorCssVar?: string
}

export default function Brand({ fontSize = 'sm', colorCssVar = 'ticket-text-light' }: BrandProps) {
    const { data } = useTicket()

    const fontSizeCss = useMemo(() => getFontSize(fontSize), [fontSize])

    return (
        <div className={`text-${colorCssVar}`}>
            <p className={fontSizeCss}>{data.brand}</p>
        </div>
    )
}
