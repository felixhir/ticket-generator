'use client'

import { useMemo } from 'react'
import Barcode from 'react-barcode'
import { useTicket } from '@/components/studio/providers/TicketContext'
import { TicketCodeContainer } from '@/components/tickets/ticket-primitives'
import getFontSize, { FontSize } from '@/lib/ticket/getFontSize'
import getTicketTextColor, { TicketColor } from '@/lib/ticket/getTicketTextColor'
import { sanitizeForCode128 } from '@/lib/ticket/sanitizeForCode128'

interface TicketBarcodeProps {
    textColor?: TicketColor
    backgroundColor?: TicketColor
    textFontSize?: FontSize
    maxWidth?: number
    height?: number
}

export default function TicketBarcode({
    textColor = 'text-light',
    backgroundColor = 'background',
    textFontSize = 'sm',
    maxWidth = 180,
    height = 30
}: TicketBarcodeProps) {
    const { data } = useTicket()
    const value = data.barcode

    const encoded = useMemo(() => (value ? sanitizeForCode128(value) : ''), [value])

    const textFontSizeCss = useMemo(() => getFontSize(textFontSize), [textFontSize])
    const textColorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    const [componentWidth, barWidth] = useMemo(() => {
        if (!encoded) return [0, 0]

        let nextBarWidth = 0.6
        const charModules = 11

        let estimatedWidth = encoded.length * charModules * nextBarWidth

        if (estimatedWidth < maxWidth) {
            nextBarWidth = maxWidth / (encoded.length * charModules)
            estimatedWidth = encoded.length * charModules * nextBarWidth
        }

        return [estimatedWidth > maxWidth ? maxWidth : estimatedWidth, nextBarWidth]
    }, [encoded, maxWidth])

    if (!value) {
        return null
    }

    return (
        <TicketCodeContainer
            style={
                componentWidth > 0
                    ? { width: `${componentWidth}px`, maxWidth: `${maxWidth}px` }
                    : { maxWidth: `${maxWidth}px` }
            }
        >
            {encoded ? (
                <div className='overflow-hidden'>
                    <Barcode
                        key={encoded}
                        value={encoded}
                        height={height}
                        displayValue={false}
                        width={barWidth}
                        lineColor={`var(--ticket-${textColor})`}
                        background={`var(--ticket-${backgroundColor})`}
                        renderer='svg'
                        className='-m-2.5'
                    />
                </div>
            ) : null}
            <p className={`${textFontSizeCss} z-10 max-w-ticket-barcode-max break-all text-center ${textColorCss}`}>
                {value}
            </p>
        </TicketCodeContainer>
    )
}
