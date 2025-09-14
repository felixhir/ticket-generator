import getFontSize, { FontSize } from '@/app/functions/getFontSize'
import getTicketTextColor, { TicketColor } from '@/app/functions/getTicketTextColor'

import { useEffect, useMemo, useState } from 'react'
import Barcode from 'react-barcode'

import { useTicket } from '../../TicketContext'

interface TicketBarcodeProps {
    textColor?: TicketColor
    backgroundColor?: TicketColor
    textFontSize?: FontSize
}

export default function TicketBarcode({
    textColor = 'text-light',
    backgroundColor = 'background',
    textFontSize = 'sm'
}: TicketBarcodeProps) {
    const { data } = useTicket()
    const value = data.barcode
    const [cssVars, setCssVars] = useState({
        maxWidth: 180,
        height: 30,
        color: '#000000',
        background: 'transparent'
    })

    const textFontSizeCss = useMemo(() => getFontSize(textFontSize), [textFontSize])
    const textColorCss = useMemo(() => getTicketTextColor(textColor), [textColor])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = getComputedStyle(document.documentElement)
            setCssVars({
                maxWidth: 180,
                height: 30,
                color: root.getPropertyValue(`--ticket-${textColor}`) || '#000000',
                background: root.getPropertyValue(`--ticket-${backgroundColor}`) || 'transparent'
            })
        }
    }, [textColor, backgroundColor])

    console.log(cssVars)

    if (!value) return null

    let barWidth = 0.6
    const charModules = 11
    const maxWidth = cssVars.maxWidth

    let estimatedWidth = value.length * charModules * barWidth

    if (estimatedWidth < maxWidth) {
        barWidth = maxWidth / (value.length * charModules)
        estimatedWidth = value.length * charModules * barWidth
    }

    const finalWidth = estimatedWidth > maxWidth ? maxWidth : estimatedWidth

    return (
        <div
            className='flex flex-col items-center justify-center overflow-hidden'
            style={{ width: `${finalWidth}px`, maxWidth: `${maxWidth}px` }}
        >
            <div className='overflow-hidden'>
                <Barcode
                    value={value}
                    height={cssVars.height}
                    displayValue={false}
                    width={barWidth}
                    lineColor={cssVars.color}
                    background={cssVars.background}
                    renderer='svg'
                    className='-m-2.5'
                />
            </div>
            <p className={`${textFontSizeCss} max-w-[180px] z-10 text-center truncate ${textColorCss}`}>{value}</p>
        </div>
    )
}
