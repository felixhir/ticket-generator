import { useTicket } from '@/app/TicketContext'
import getFontSize, { FontSize } from '@/app/functions/getFontSize'

import { useMemo } from 'react'

interface LocationProps {
    venueFontSize?: FontSize
    addressFontSize?: FontSize
    venueColorCssVar?: string
    addressColorCssVar?: string
}

export default function Location({
    venueFontSize = 'sm',
    addressFontSize = 'sm',
    venueColorCssVar = 'ticket-light',
    addressColorCssVar = 'ticket-light'
}: LocationProps) {
    const { data } = useTicket()

    const venueCss = useMemo(() => getFontSize(venueFontSize), [venueFontSize])
    const addressCss = useMemo(() => getFontSize(addressFontSize), [addressFontSize])

    return (
        <div>
            <p className={`${venueCss} text-${venueColorCssVar}`}>{data.venue}</p>
            <p className={`${addressCss} text-${addressColorCssVar} whitespace-pre-line`}>{data.address}</p>
        </div>
    )
}
