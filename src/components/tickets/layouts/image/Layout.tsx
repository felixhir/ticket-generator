'use client'

import { Poppins } from 'next/font/google'
import { useMemo } from 'react'
import { useDesign } from '@/components/studio/providers/DesignContext'
import { useTicket } from '@/components/studio/providers/TicketContext'
import { cmToPx } from '@/lib/ticket/cmToPx'
import getPatternClass from '@/lib/ticket/getPatternClass'

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
                {design.image && <img width={cmToPx(design.dimensions.short)} src={design.image} alt='' />}
            </div>
            <div
                className='absolute left-ticket-picture-marker-left flex h-ticket-picture-marker-height w-ticket-picture-marker-width flex-col bg-ticket-text-light'
                style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)',
                    top: cmToPx(design.dimensions.short) - 34
                }}
            >
                {data.barcode ? (
                    <div className='flex h-3/4 min-h-0 w-full shrink-0 items-center justify-center p-0.5 pt-0.5 pb-1.5'>
                        <DataMatrix variant='picture' />
                    </div>
                ) : null}
            </div>
            <div className={`${poppins.className} flex flex-1 flex-col px-5 pt-8`}>
                <div className='extenda'>
                    <Title />
                </div>
                <div className='mt-3 mb-6 flex h-full flex-col justify-between'>
                    <div className='flex flex-1 items-center'>
                        <Location venueFontSize='md' addressFontSize='sm' />
                    </div>

                    <div className='flex items-end justify-between'>
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
