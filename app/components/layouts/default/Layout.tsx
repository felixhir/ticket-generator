'use client'

import { useTicket } from '@/app/TicketContext'

import { Roboto } from 'next/font/google'

import ConcertInfo from '../../building-blocks/ConcertInfo'
import Date from '../../building-blocks/Date'
import Location from '../../building-blocks/Location'
import Price from '../../building-blocks/Price'
import Seating from '../../building-blocks/Seating'
import TicketBarcode from '../../building-blocks/TicketBarcode'
import './styles.css'

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700']
})

export default function DefaultLayout() {
    const { data } = useTicket()

    return (
        <div id='default-layout' className={`flex h-full flex-col ${roboto.className}`}>
            <div className='flex flex-1'>
                <div className='p-2 px-1 text-[15px] relative flex flex-1 flex-col h-full background-gradient slanted-main'>
                    {data.background && (
                        <img
                            src={data.background}
                            className='absolute top-[2px] bottom-[2px] left-3/5 -translate-x-1/2 h-[calc(100%-4px)] object-cover [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]'
                        />
                    )}

                    <div className='z-10 p-6 flex flex-col h-full justify-between'>
                        <ConcertInfo bandFontSize='xl' tourFontSize='md' />
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='flex flex-col gap-2'>
                                <Date fontSize='md' />
                                <Location venueFontSize='md' addressFontSize='sm' />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Seating fontSize='md' />
                                <Price fontSize='md' />
                            </div>
                        </div>
                    </div>
                </div>

                {data.barcode && (
                    <div className='relative w-[80px] bg-ticket-secondary-muted slanted-side barcode-gradient'>
                        <div className='absolute top-1/2 -right-14 -translate-y-1/2 rotate-270'>
                            <TicketBarcode />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
