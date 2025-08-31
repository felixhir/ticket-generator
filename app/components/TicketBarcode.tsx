import Barcode from 'react-barcode'

import { useTicket } from '../TicketContext'

export default function TicketBarcode() {
    const { data } = useTicket()
    const value = data.barcode

    if (!value) return null

    let barWidth = 0.6
    const charModules = 11
    const maxWidth = 180

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
                    height={30}
                    displayValue={false}
                    width={barWidth}
                    lineColor='#000000'
                    background=''
                    renderer='svg'
                    className='-m-2.5'
                />
            </div>
            <p className='z-10 text-center text-xs truncate max-w-[180px]'>{value}</p>
        </div>
    )
}
