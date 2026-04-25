'use client'

import { Roboto } from 'next/font/google'
import { useDesign } from '@/components/studio/providers/DesignContext'
import useObserveCssVariableChange from '@/lib/hooks/useObserveCssVariableChange'
import { cmToPx } from '@/lib/ticket/cmToPx'

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
            className={`relative flex min-h-0 min-w-0 justify-between ${roboto.className}`}
        >
            <div className='background absolute inset-0 z-0 columns-5 gap-2 overflow-hidden'>
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

            <div className='absolute top-1/2 left-4/11 z-10 -translate-y-1/2 scale-(--logo-size)'>
                {design.bandLogo && <BandLogo />}
            </div>

            <div className='z-10 flex min-h-0 min-w-0 flex-1 flex-col justify-between p-4'>
                <CombinedTitle titleFontSize='xl' subtitleFontSize='md' />
                <div className='flex flex-col gap-2'>
                    <Date fontSize='md' />
                    <Location venueFontSize='md' />
                </div>
            </div>

            <div className='flex min-h-0 min-w-0 max-w-full shrink-0 self-stretch'>
                <div className='z-10 flex min-w-0 flex-col justify-end px-4 pb-2 text-end'>
                    <Seating />
                    <Price fontSize='md' />
                </div>
                <div className='relative z-20 flex w-ticket-side-rail flex-none overflow-hidden self-stretch bg-ticket-secondary/80'>
                    <div className='flex h-full min-h-0 w-full min-w-0 items-center justify-center p-0.5'>
                        <div className='w-max -rotate-90'>
                            <TicketBarcode backgroundColor='secondary-muted' textColor='text-dark' />
                        </div>
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
