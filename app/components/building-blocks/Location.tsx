import { useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'
import getTicketTextColor, { TicketColor } from '@/app/functions/getTicketTextColor'

import { useMemo } from 'react'

interface LocationProps {
    venueFontSize?: FontSize
    addressFontSize?: FontSize
    textColor?: TicketColor
}

export default function Location({
    venueFontSize = 'sm',
    addressFontSize = 'sm',
    textColor = 'text-light'
}: LocationProps) {
    const { data } = useTicket()

    const venueCss = useMemo(() => getFontSize(venueFontSize), [venueFontSize])
    const addressCss = useMemo(() => getFontSize(addressFontSize), [addressFontSize])
    const colorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    return (
        <div className={`${colorCss}`}>
            <p className={`${venueCss}`}>{data.venue}</p>
            <p className={`${addressCss} whitespace-pre-line`}>{data.address}</p>
        </div>
    )
}
