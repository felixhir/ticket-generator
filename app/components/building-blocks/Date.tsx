import { useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'
import moment from 'moment'

import { useMemo } from 'react'

interface DateProps {
    fontSize?: FontSize
    colorCssVar?: string
}

export default function Date({ fontSize = 'sm', colorCssVar = 'ticket-text-light' }: DateProps) {
    const { data } = useTicket()

    const fontSizeCss = useMemo(() => getFontSize(fontSize), [fontSize])

    return (
        <p className={`${fontSizeCss} text-${colorCssVar}`}>
            {moment(data.datetime).format('dddd, DD. MMM YYYY, HH:mm')}
        </p>
    )
}
