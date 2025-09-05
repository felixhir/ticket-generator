import { useEffect, useState } from 'react'
import Barcode from 'react-barcode'

import { useTicket } from '../../TicketContext'

export default function TicketBarcode() {
    const { data } = useTicket()
    const value = data.barcode
    const [cssVars, setCssVars] = useState({
        maxWidth: 180,
        height: 30,
        color: '#000000',
        background: 'transparent'
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const root = getComputedStyle(document.documentElement)
            setCssVars({
                maxWidth: parseInt(root.getPropertyValue('--ticket-barcode-max-width')) || 180,
                height: parseInt(root.getPropertyValue('--ticket-barcode-height')) || 30,
                color: root.getPropertyValue('--ticket-barcode-color') || '#000000',
                background: root.getPropertyValue('--ticket-barcode-bg') || 'transparent'
            })
        }
    }, [])

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
            <p className='ticket-barcode-text-size ticket-barcode-max-width z-10 text-center truncate'>{value}</p>
        </div>
    )
}
