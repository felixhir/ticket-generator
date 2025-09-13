import getFontSize, { FontSize } from '@/app/functions/getFontSize'

import { useEffect, useMemo, useState } from 'react'
import Barcode from 'react-barcode'

import { useTicket } from '../../TicketContext'

interface TicketBarcodeProps {
    colorCssVar?: string
    backgroundCssVar?: string
    textFontSize?: FontSize
    textColorCssVar?: string
}

export default function TicketBarcode({
    colorCssVar = '--ticket-light',
    backgroundCssVar = '--ticket-background',
    textFontSize = 'sm',
    textColorCssVar = 'ticket-light'
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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = getComputedStyle(document.documentElement)
            setCssVars({
                maxWidth: 180,
                height: 30,
                color: root.getPropertyValue(colorCssVar) || '#000000',
                background: root.getPropertyValue(backgroundCssVar) || 'transparent'
            })
        }
    }, [colorCssVar, backgroundCssVar])

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
            <p className={`${textFontSizeCss} max-w-[180px] z-10 text-center truncate text-${textColorCssVar}`}>
                {value}
            </p>
        </div>
    )
}
