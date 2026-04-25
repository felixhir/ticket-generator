'use client'

import bwipjs from '@bwip-js/browser'
import { useTicket } from '@/components/studio/providers/TicketContext'
import useObserveCssVariableChange from '@/lib/hooks/useObserveCssVariableChange'
import { cn } from '@/lib/utils'

export type DataMatrixVariant = 'default' | 'picture'

export default function DataMatrix({ variant = 'default' }: { variant?: DataMatrixVariant }) {
    const { data } = useTicket()
    const value = data.barcode

    const color = useObserveCssVariableChange('ticket-text-dark')

    const isPicture = variant === 'picture'

    return (
        <div className={cn(isPicture ? 'flex h-full min-h-0 w-full min-w-0 items-center justify-center' : 'scale-75')}>
            <canvas
                className={isPicture ? 'h-auto w-auto max-h-full max-w-full' : undefined}
                ref={canvas => {
                    if (!canvas) {
                        return
                    }

                    bwipjs.toCanvas(canvas, {
                        bcid: 'datamatrix',
                        text: value,
                        scale: isPicture ? 1 : 2,
                        textxalign: 'center',
                        barcolor: color
                    })
                }}
            />
        </div>
    )
}
