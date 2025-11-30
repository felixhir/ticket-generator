'use client'

import { useDesign } from '@/app/contexts/DesignContext'
import { useTicket } from '@/app/contexts/TicketContext'

import { Poppins } from 'next/font/google'

import { useMemo } from 'react'

import DataMatrix from '../../building-blocks/DataMatrix'
import Date from '../../building-blocks/Date'
import Location from '../../building-blocks/Location'
import Price from '../../building-blocks/Price'
import Seating from '../../building-blocks/Seating'
import Title from '../../building-blocks/Title'
import './styles.css'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '700']
})

export default function PictureLayout() {
    const { data } = useTicket()
    const { design } = useDesign()

    const pattern = useMemo(() => {
        switch (design.backgroundPattern) {
            case 'lines':
                return 'bg-lines'
            case 'blocks':
                return 'bg-blocks'
            case 'hearts':
                return 'bg-hearts'
            default:
                return 'bg-lines'
        }
    }, [design.backgroundPattern])

    return (
        <div className={`relative w-[300px] h-[600px] flex flex-col ${pattern}`}>
            <div className='h-[300px]'>{design.image && <img width={300} src={design.image} />}</div>
            <div
                className='absolute top-[266px] left-[25px] w-15 h-17 bg-ticket-text-dark flex  justify-center'
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' }}
            >
                {data.barcode && <DataMatrix />}
            </div>
            <div className={`${poppins.className} flex flex-1 flex-col px-5 pt-8`}>
                <div className='extenda'>
                    <Title textColor='text-dark' />
                </div>
                <div className='flex flex-col justify-between h-full mt-3 mb-6'>
                    <div className='flex items-center flex-1'>
                        <Location venueFontSize='md' addressFontSize='sm' textColor='text-dark' />
                    </div>

                    <div className='flex justify-between items-end'>
                        <Date fontSize='sm' textColor='text-dark' />

                        <div className='place-items-end'>
                            <Seating fontSize='sm' textColor='text-dark' />
                            <div className='font-semibold'>
                                <Price fontSize='sm' textColor='text-dark' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
