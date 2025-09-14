import { useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'
import getTicketTextColor, { TicketColor } from '@/app/functions/getTicketTextColor'
import moment from 'moment'

import { useMemo } from 'react'

interface DateProps {
    fontSize?: FontSize
    textColor?: TicketColor
}

export default function Date({ fontSize = 'sm', textColor = 'text-light' }: DateProps) {
    const { data } = useTicket()

    const fontSizeCss = useMemo(() => getFontSize(fontSize), [fontSize])
    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    return <p className={`${fontSizeCss} ${colorCss}`}>{moment(data.datetime).format('dddd, DD. MMM YYYY, HH:mm')}</p>
}
