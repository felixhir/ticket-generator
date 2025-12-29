'use client'

import { useDesign } from '@/app/contexts/DesignContext'
import { useTicket } from '@/app/contexts/TicketContext'
import { cmToPx } from '@/app/functions/cmToPx'
import getPatternClass from '@/app/functions/getPatternClass'

import { Poppins } from 'next/font/google'

import { useMemo } from 'react'

import DataMatrix from '../../building-blocks/DataMatrix'
import Date from '../../building-blocks/Date'
import Location from '../../building-blocks/Location'
import Price from '../../building-blocks/Price'
import Seating from '../../building-blocks/Seating'
import Title from '../../building-blocks/Title'
import '../patterns.css'
import './styles.css'

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['400', '500', '700']
})

export default function PictureLayout() {
    const { data } = useTicket()
    const { design } = useDesign()

    const pattern = useMemo(() => getPatternClass(design.backgroundPattern), [design.backgroundPattern])

    return (
        <div
            className={`relative flex flex-col ${pattern}`}
            style={{ width: cmToPx(design.dimensions.short), height: cmToPx(design.dimensions.long) }}
        >
            <div style={{ height: cmToPx(design.dimensions.long / 2) }}>
                {design.image && <img width={cmToPx(design.dimensions.short)} src={design.image} />}
            </div>
            <div
                className='absolute left-[25px] w-15 h-17 bg-ticket-text-light flex  justify-center'
                style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)',
                    top: cmToPx(design.dimensions.short) - 34
                }}
            >
                {data.barcode && <DataMatrix />}
            </div>
            <div className={`${poppins.className} flex flex-1 flex-col px-5 pt-8`}>
                <div className='extenda'>
                    <Title />
                </div>
                <div className='flex flex-col justify-between h-full mt-3 mb-6'>
                    <div className='flex items-center flex-1'>
                        <Location venueFontSize='md' addressFontSize='sm' />
                    </div>

                    <div className='flex justify-between items-end'>
                        <Date fontSize='sm' />

                        <div className='place-items-end'>
                            <Seating fontSize='sm' />
                            <div className='font-semibold'>
                                <Price fontSize='sm' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
