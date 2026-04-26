'use client'

import { useMemo } from 'react'
import { useDesign } from '@/components/studio/providers/DesignContext'
import { TicketPreviewSlice, TicketThumbnail } from '@/components/tickets/ticket-primitives'
import type { Layout } from '@/lib/domain/design'

import getPatternClass from '@/lib/ticket/getPatternClass'
import { cn } from '@/lib/utils'

import './band/styles.css'
import './default/styles.css'
import './patterns.css'
import useBandLogoMask from '@/lib/hooks/useBandLogoMask'

const BAND_CELLS = 25

export default function LayoutVariantThumbnail({ layout }: { layout: Layout }) {
    return (
        <TicketThumbnail>
            {layout === 'default' && <DefaultThumbnail />}
            {layout === 'picture' && <PictureThumbnail />}
            {layout === 'band' && <BandThumbnail />}
        </TicketThumbnail>
    )
}

function DefaultThumbnail() {
    const { design } = useDesign()
    const pattern = useMemo(() => getPatternClass(design.backgroundPattern), [design.backgroundPattern])

    return (
        <TicketPreviewSlice>
            <div className={cn('bg-fade min-w-0 flex-1', pattern)} />
            <div className='w-ticket-thumbnail-rail shrink-0 border-l border-ticket-tertiary/15 bg-ticket-secondary/90' />
        </TicketPreviewSlice>
    )
}

function PictureThumbnail() {
    const { design } = useDesign()
    const pattern = useMemo(() => getPatternClass(design.backgroundPattern), [design.backgroundPattern])

    return (
        <div
            className={cn(
                'flex h-full min-h-0 w-full flex-col overflow-hidden bg-ticket-background shadow-ticket-preview',
                pattern
            )}
        >
            <div className='h-1/2 w-full min-h-0 shrink-0 overflow-hidden border-b border-ticket-tertiary/20'>
                {design.image ? (
                    <img src={design.image} alt='' className='h-full w-full object-cover' />
                ) : (
                    <div className='h-full w-full bg-ticket-tertiary/25' />
                )}
            </div>
            <div className='min-h-0 flex-1' />
        </div>
    )
}

function BandThumbnail() {
    const normalizedLogo = useBandLogoMask()
    const src = normalizedLogo?.url

    return (
        <TicketPreviewSlice className='min-w-0'>
            <div className='relative min-w-0 flex-1'>
                <div className='background absolute inset-0' />
                <div className='absolute inset-0 grid grid-cols-5 gap-0.5 p-0.5'>
                    {Array.from({ length: BAND_CELLS }).map((_, i) => (
                        <div
                            key={i}
                            className='flex min-h-0 min-w-0 items-center justify-center overflow-hidden'
                            aria-hidden
                        >
                            {src && (
                                <img
                                    src={src}
                                    alt=''
                                    className='h-full w-full object-contain opacity-25'
                                    style={{
                                        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                                        WebkitMaskRepeat: 'no-repeat',
                                        WebkitMaskSize: '100% 100%',
                                        maskImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))',
                                        maskRepeat: 'no-repeat',
                                        maskSize: '100% 100%'
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                {src && (
                    <div className='absolute top-1/2 left-ticket-thumbnail-logo-offset z-10 h-ticket-thumbnail-logo-size w-ticket-thumbnail-logo-size -translate-x-1/2 -translate-y-1/2 drop-shadow-sm'>
                        <img src={src} alt='' className='h-full w-full object-contain' />
                    </div>
                )}
            </div>
            <div className='relative z-20 w-ticket-thumbnail-narrow-rail shrink-0 border-l border-ticket-tertiary/10 bg-ticket-secondary/80' />
        </TicketPreviewSlice>
    )
}
