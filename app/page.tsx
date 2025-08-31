'use client'

import { useState } from 'react'

import { TicketProvider } from './TicketContext'
import Sidebar from './components/Sidebar'
import Ticket from './components/Ticket'

export default function Home() {
    const [ticketCount, setTicketCount] = useState(1)

    return (
        <TicketProvider>
            <div id='print-wrapper' className='h-screen hidden print:flex flex-col justify-between'>
                {Array.from({ length: ticketCount }).map((_, i) => (
                    <div key={i} className='print-ticket'>
                        <Ticket />
                    </div>
                ))}
            </div>

            <div className='flex h-screen print:hidden'>
                <div className='flex-1 flex items-center justify-center bg-gray-100 px-4'>
                    <Ticket />
                </div>

                <div className='min-w-[300px]'>
                    <Sidebar ticketCount={ticketCount} setTicketCount={setTicketCount} />
                </div>
            </div>
        </TicketProvider>
    )
}
