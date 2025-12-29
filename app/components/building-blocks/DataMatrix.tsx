import { useTicket } from '@/app/contexts/TicketContext'
import useObserveCssVariableChange from '@/app/functions/useObserveCssVariableChange'
import bwipjs from '@bwip-js/browser'

export default function DataMatrix() {
    const { data } = useTicket()
    const value = data.barcode

    const color = useObserveCssVariableChange('ticket-text-dark')

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
