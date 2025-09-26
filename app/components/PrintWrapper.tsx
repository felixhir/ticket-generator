'use client'

import { useTicket } from '@/app/TicketContext'
import Ticket from '@/app/components/ticket/Ticket'

export default function PrintWrapper() {
    const { data } = useTicket()
    return (
        <div id='print-wrapper' className='h-screen hidden print:flex flex-col justify-between'>
            {Array.from({ length: data.ticketCount }).map((_, i) => (
                <div key={i}>
                    <Ticket layout={data.layout} />
                </div>
            ))}
        </div>
    )
}
