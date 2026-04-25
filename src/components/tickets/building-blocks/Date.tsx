'use client'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTicket } from '@/components/studio/providers/TicketContext'
import getFontSize, { FontSize } from '@/lib/ticket/getFontSize'
import getTicketTextColor, { TicketColor } from '@/lib/ticket/getTicketTextColor'

interface DateProps {
    fontSize?: FontSize
    textColor?: TicketColor
}

export default function Date({ fontSize = 'sm', textColor = 'text-light' }: DateProps) {
    const { i18n } = useTranslation()
    const { data } = useTicket()

    const fontSizeCss = useMemo(() => getFontSize(fontSize), [fontSize])
    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])
    const language = i18n.resolvedLanguage ?? i18n.language
    const formattedDate = useMemo(
        () =>
            new Intl.DateTimeFormat(language, {
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                month: 'short',
                weekday: 'long',
                year: 'numeric'
            }).format(data.datetime ?? new globalThis.Date()),
        [data.datetime, language]
    )

    return <p className={`${fontSizeCss} ${colorCss}`}>{formattedDate}</p>
}
