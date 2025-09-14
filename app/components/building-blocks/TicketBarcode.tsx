import getFontSize, { FontSize } from '@/app/functions/getFontSize'
import getTicketTextColor, { TicketColor } from '@/app/functions/getTicketTextColor'

import { useMemo } from 'react'
import Barcode from 'react-barcode'

import { useTicket } from '../../TicketContext'

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

    const textFontSizeCss = useMemo(() => getFontSize(textFontSize), [textFontSize])
    const textColorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    const [componentWidth, barWidth] = useMemo(() => {
        if (!value) return [0, 0]

        let barWidth = 0.6
        const charModules = 11

        let estimatedWidth = value.length * charModules * barWidth

        if (estimatedWidth < maxWidth) {
            barWidth = maxWidth / (value.length * charModules)
            estimatedWidth = value.length * charModules * barWidth
        }

        return [estimatedWidth > maxWidth ? maxWidth : estimatedWidth, barWidth]
    }, [value, maxWidth])

    if (!value) {
        return null
    }

    return (
        <div
            className='flex flex-col items-center justify-center overflow-hidden'
            style={{ width: `${componentWidth}px`, maxWidth: `${maxWidth}px` }}
        >
            <div className='overflow-hidden'>
                <Barcode
                    value={value}
                    height={height}
                    displayValue={false}
                    width={barWidth}
                    lineColor={`var(--ticket-${textColor})`}
                    background={`var(--ticket-${backgroundColor})`}
                    renderer='svg'
                    className='-m-2.5'
                />
            </div>
            <p className={`${textFontSizeCss} max-w-[180px] z-10 text-center truncate ${textColorCss}`}>{value}</p>
        </div>
    )
}
