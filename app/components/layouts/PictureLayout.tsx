'use client'

import { useTicket } from '@/app/TicketContext'

import { Roboto } from 'next/font/google'

import ConcertInfo from '../building-blocks/ConcertInfo'
import DataMatrix from '../building-blocks/DataMatrix'
import Date from '../building-blocks/Date'
import Location from '../building-blocks/Location'
import Price from '../building-blocks/Price'
import Seating from '../building-blocks/Seating'
import './layoutStyles.css'

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700']
})

export default function PictureLayout() {
    const { data } = useTicket()

    return (
        <div className={`${roboto.className} relative w-[300px] h-[625px] flex flex-col picture-gradient`}>
            <div className='opacity-85 bg-linear-to-r from-ticket-secondary to-ticket-tertiary  '>
                <div className='h-[80px] py-1 px-4 text-center items-center'>
                    <ConcertInfo bandFontSize='lg' tourFontSize='md' textColor='text-dark' />
                </div>
            </div>
            {data.background && <img src={data.background} />}
            <div className='flex flex-1 flex-col mt-4'>
                <div className='pt-1 pb-6 px-5 flex flex-col h-full justify-end'>
                    <div className='flex flex-col gap-2 text-center mb-4'>
                        <Date fontSize='md' />
                        <Location venueFontSize='md' addressFontSize='sm' />
                        <br />
                        <Seating fontSize='md' />
                    </div>

                    <div className='flex justify-between items-end'>
                        <Price fontSize='md' />
                        {data.barcode && <DataMatrix />}
                    </div>
                </div>
            </div>
        </div>
    )
}
