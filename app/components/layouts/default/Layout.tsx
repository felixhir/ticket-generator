import { useTicket } from '@/app/TicketContext'

import ConcertInfo from '../../building-blocks/ConcertInfo'
import Date from '../../building-blocks/Date'
import Location from '../../building-blocks/Location'
import Price from '../../building-blocks/Price'
import Seating from '../../building-blocks/Seating'
import TicketBarcode from '../../building-blocks/TicketBarcode'

export default function DefaultLayout() {
    const { data } = useTicket()

    return (
        <div className='flex h-full flex-col'>
            <div className='ticket-primary-bg h-12 ticket-secondary p-2 font-bold flex items-center'>{data.brand}</div>
            <div className='p-2 flex flex-1'>
                <div className='w-[75px] flex items-center justify-center'>
                    {data.barcode && (
                        <div className='rotate-270 text-black flex flex-col items-center w-[180px] over'>
                            <TicketBarcode></TicketBarcode>
                        </div>
                    )}
                </div>

                <div
                    className={`px-1 text-[15px] relative flex flex-1 flex-col h-full ${data.useBackground ? 'ticket-tertiary-bg' : 'ticket-bg'}`}
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
