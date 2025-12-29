'use client'

import { useDesign } from '@/app/contexts/DesignContext'
import { cmToPx } from '@/app/functions/cmToPx'
import useObserveCssVariableChange from '@/app/functions/useObserveCssVariableChange'

import { Roboto } from 'next/font/google'

import CombinedTitle from '../../building-blocks/CombinedTitle'
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

export default function BandLayout() {
    const { design } = useDesign()

    useObserveCssVariableChange('logo-size')

    return (
        <div
            style={{ height: cmToPx(design.dimensions.short), width: cmToPx(design.dimensions.long) }}
            className={`flex relative ${roboto.className} overflow-hidden justify-between`}
        >
            {/* Background */}
            <div className='absolute inset-0 columns-5 gap-2 overflow-hidden background z-0'>
                {Array.from({ length: 25 }).map((_, i) => (
                    <div
                        key={i}
                        className='opacity-25'
                        style={{
                            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskSize: '100% 100%'
                        }}
                    >
                        <BandLogo />
                    </div>
                ))}
            </div>

            <div className='absolute left-4/11 top-1/2 -translate-y-1/2 scale-(--logo-size) z-10'>
                {design.bandLogo && <BandLogo />}
            </div>

            {/* Content */}
            <div className='flex flex-col justify-between p-4 z-10'>
                <CombinedTitle titleFontSize='xl' subtitleFontSize='md' />
                <div className='gap-2 flex flex-col'>
                    <Date fontSize='md' />
                    <Location venueFontSize='md' />
                </div>
            </div>

            <div className='flex'>
                <div className='flex flex-col pb-2 px-4 z-10 justify-end text-end'>
                    <Seating />
                    <Price fontSize='md' />
                </div>
                <div className='relative w-20 bg-ticket-secondary opacity-80 z-20'>
                    <div className='absolute top-1/2 -right-14 -translate-y-1/2 rotate-270'>
                        <TicketBarcode backgroundColor='secondary-muted' textColor='text-dark' />
                    </div>
                </div>
            </div>
        </div>
    )
}

function BandLogo() {
    const { design } = useDesign()

    const logoColor = useObserveCssVariableChange('ticket-text-light')

    return (
        <svg
            viewBox={`0 0 ${design.logoDimensions?.width} ${design.logoDimensions?.height}`}
            preserveAspectRatio='xMidYMid meet'
            className='h-full w-full'
        >
            <rect
                width={design.logoDimensions?.width}
                height={design.logoDimensions?.height}
                fill={logoColor}
                mask='url(#logoMask)'
            />
        </svg>
    )
}
