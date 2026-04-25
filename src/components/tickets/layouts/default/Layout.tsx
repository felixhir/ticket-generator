'use client'

import { Roboto } from 'next/font/google'
import { useMemo } from 'react'
import { useDesign } from '@/components/studio/providers/DesignContext'
import { useTicket } from '@/components/studio/providers/TicketContext'
import { cmToPx } from '@/lib/ticket/cmToPx'
import getPatternClass from '@/lib/ticket/getPatternClass'

import CombinedTitle from '../../building-blocks/CombinedTitle'
import Date from '../../building-blocks/Date'
import Location from '../../building-blocks/Location'
import Price from '../../building-blocks/Price'
import Seating from '../../building-blocks/Seating'
import TicketBarcode from '../../building-blocks/TicketBarcode'
import '../patterns.css'
import './styles.css'

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '500', '700']
})

export default function DefaultLayout() {
    const { data } = useTicket()
    const { design } = useDesign()

    const pattern = useMemo(() => getPatternClass(design.backgroundPattern), [design.backgroundPattern])

    return (
        <div
            id='default-layout'
            className={`${roboto.className} bg-fade ${pattern}`}
            style={{ height: cmToPx(design.dimensions.short), width: cmToPx(design.dimensions.long) }}
        >
            <div className='flex h-full flex-1'>
                <div className='background-gradient slanted-main relative flex h-full flex-1 flex-col p-2 px-1 text-ticket-body'>
                    <div className='z-10 flex h-full flex-col justify-between p-6'>
                        <CombinedTitle titleFontSize='xl' subtitleFontSize='md' />
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
                    <div className='relative w-20 bg-ticket-secondary-muted slanted-side barcode-gradient'>
                        <div className='absolute top-1/2 -right-14 -translate-y-1/2 rotate-270'>
                            <TicketBarcode />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
