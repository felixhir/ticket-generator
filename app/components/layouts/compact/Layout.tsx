import { useTicket } from '@/app/contexts/TicketContext'

import ConcertInfo from '../../building-blocks/ConcertInfo'
import Date from '../../building-blocks/Date'
import Location from '../../building-blocks/Location'
import Price from '../../building-blocks/Price'
import Seating from '../../building-blocks/Seating'
import TicketBarcode from '../../building-blocks/TicketBarcode'

export default function CompactLayout() {
    const { data } = useTicket()

    return (
        <div className='block relative h-[300px] w-[450px]'>
            <div className='flex h-full'>
                <div className='bg-ticket-primary vertical-text text-ticket-text-dark p-2 font-bold flex items-center justify-center h-full'>
                    {data.title}
                </div>

                <div className='p-2'>
                    <div className='px-1 text-[15px] text-ticket-text-dark h-full space-y-4'>
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
        </div>
    )
}
