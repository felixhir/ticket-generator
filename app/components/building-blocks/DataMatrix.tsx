import { useTicket } from '@/app/TicketContext'
import bwipjs from '@bwip-js/browser'

export default function DataMatrix() {
    const { data } = useTicket()
    const value = data.barcode

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
                        textxalign: 'center'
                    })
                }}
            />
        </div>
    )
}
