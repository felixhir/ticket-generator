import { currency, useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'

import { useMemo } from 'react'

interface PriceProps {
    fontSize?: FontSize
    colorCssVar?: string
}

export default function Price({ fontSize = 'sm', colorCssVar = 'ticket-light' }: PriceProps) {
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

    return (
        <p className={`${fontSizeCss} text-${colorCssVar}`}>
            {formattedValue} {currency[data.currency]}
        </p>
    )
}
