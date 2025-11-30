import { useTicket } from '@/app/contexts/TicketContext'
import bwipjs from '@bwip-js/browser'

import { useEffect, useState } from 'react'

export default function DataMatrix() {
    const { data } = useTicket()
    const value = data.barcode

    const [color, setColor] = useState('#FFFFFF')

    useEffect(() => {
        const target = document.documentElement

        const observer = new MutationObserver(() => {
            const newColor = getComputedStyle(target).getPropertyValue('--ticket-text-light')
            setColor(newColor)
        })

        observer.observe(target, {
            attributes: true,
            attributeFilter: ['style']
        })

        return () => observer.disconnect()
    }, [])

    return (
        <div className='scale-[0.75]'>
            <canvas
                ref={canvas => {
                    if (!canvas) {
                        return
                    }

                    bwipjs.toCanvas(canvas, {
                        bcid: 'datamatrix',
                        text: value,
                        scale: 2,
                        textxalign: 'center',
                        barcolor: color
                    })
                }}
            />
        </div>
    )
}
