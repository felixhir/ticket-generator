'use client'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTicket } from '@/components/studio/providers/TicketContext'
import { formatTicketPriceAmount, getCurrencyCode } from '@/lib/domain/currency'
import getFontSize, { FontSize } from '@/lib/ticket/getFontSize'
import getTicketTextColor, { TicketColor } from '@/lib/ticket/getTicketTextColor'

interface PriceProps {
    fontSize?: FontSize
    textColor?: TicketColor
}

export default function Price({ fontSize = 'sm', textColor = 'text-light' }: PriceProps) {
    const { i18n } = useTranslation()
    const { data } = useTicket()
    const language = i18n.resolvedLanguage ?? i18n.language

    const formattedValue = useMemo(() => {
        return formatTicketPriceAmount(data.price, language)
    }, [data.price, language])

    const fontSizeCss = useMemo(() => getFontSize(fontSize), [fontSize])
    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    return (
        <p className={`${fontSizeCss} ${colorCss}`}>
            {formattedValue} {getCurrencyCode(data.currency)}
        </p>
    )
}
