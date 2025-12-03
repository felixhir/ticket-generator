import { currency, useTicket } from '@/app/contexts/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'
import getTicketTextColor, { TicketColor } from '@/app/functions/getTicketTextColor'

import { useMemo } from 'react'

interface PriceProps {
    fontSize?: FontSize
    textColor?: TicketColor
}

export default function Price({ fontSize = 'sm', textColor = 'text-light' }: PriceProps) {
    const { data } = useTicket()

    const formattedValue = useMemo(() => {
        switch (data.currency) {
            case currency.SEK:
                return data.price.toFixed(0)
            default:
                return data.price.toFixed(2)
        }
    }, [data.price, data.currency])

    const fontSizeCss = useMemo(() => getFontSize(fontSize), [fontSize])
    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    return (
        <p className={`${fontSizeCss} ${colorCss}`}>
            {formattedValue} {currency[data.currency]}
        </p>
    )
}
