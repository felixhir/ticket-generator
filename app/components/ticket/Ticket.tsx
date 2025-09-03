import { Roboto_Mono } from 'next/font/google'

import { useTicket } from '../../TicketContext'
import ConcertInfo from '../building-blocks/ConcertInfo'
import Date from '../building-blocks/Date'
import Location from '../building-blocks/Location'
import Price from '../building-blocks/Price'
import Seating from '../building-blocks/Seating'
import TicketBarcode from '../building-blocks/TicketBarcode'

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    weight: ['400', '700']
})

export default function Ticket() {
    const { data } = useTicket()

    return (
        <div
            id='ticket'
            className={`ticket-width ticket-height ticket-bg ticket-shadow ticket-font-size flex flex-col ${robotoMono.className} ${data.useBackground ? 'ticket-text-alt' : 'ticket-text'}`}
        >
            <div className='ticket-header-bg ticket-header-height ticket-header-text ticket-padding font-bold flex items-center'>
                Some Brand
            </div>
            <div className='ticket-padding-content flex flex-1'>
                <div className='ticket-barcode-width flex items-center justify-center'>
                    {data.barcode && (
                        <div className='rotate-270 text-black flex flex-col items-center w-[180px] over'>
                            <TicketBarcode></TicketBarcode>
                        </div>
                    )}
                </div>

                <div
                    className={`ticket-padding-inner ticket-font-size-large relative flex flex-1 flex-col h-full ${data.useBackground ? 'ticket-bg-color' : 'ticket-bg'}`}
                >
                    {data.useBackground && data.background && (
                        <img
                            src={data.background}
                            className='absolute top-[2px] bottom-[2px] left-3/5 -translate-x-1/2 h-[calc(100%-4px)] object-cover [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]'
                        />
                    )}

                    <div className='z-10 flex flex-col h-full justify-between'>
                        <ConcertInfo />
                        <Location />
                        <Date />
                        <Price />
                        <Seating />
                    </div>
                </div>
            </div>
        </div>
    )
}
