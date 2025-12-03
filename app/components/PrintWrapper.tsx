'use client'

import Ticket from '@/app/components/ticket/Ticket'

import { useDesign } from '../contexts/DesignContext'

export default function PrintWrapper() {
    const { design } = useDesign()
    return (
        <div id='print-wrapper' className='h-screen hidden print:flex flex-col justify-between w-min'>
            {Array.from({ length: design.ticketCount }).map((_, i) => (
                <div key={i}>
                    <Ticket layout={design.layout} />
                </div>
            ))}
        </div>
    )
}
