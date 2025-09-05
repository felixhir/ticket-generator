import { useTicket } from '@/app/TicketContext'

import ConcertInfo from '../building-blocks/ConcertInfo'
import Date from '../building-blocks/Date'
import Location from '../building-blocks/Location'
import Price from '../building-blocks/Price'
import Seating from '../building-blocks/Seating'
import TicketBarcode from '../building-blocks/TicketBarcode'

export default function CompactLayout() {
    const { data } = useTicket()

    return (
        <div className='flex h-full'>
            <div className='ticket-header-bg vertical-text ticket-header-text ticket-padding font-bold flex items-center justify-center h-full'>
                {data.brand}
            </div>

            <div className='ticket-padding-content'>
                <div className='ticket-padding-inner ticket-font-size-large ticket-text h-full space-y-4'>
                    <ConcertInfo />
                    <Location />
                    <Date />
                    <Price />
                    <Seating />
                    {data.barcode && (
                        <div className='text-black flex flex-col items-center w-[180px] over'>
                            <TicketBarcode />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
