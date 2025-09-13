import { Roboto_Mono } from 'next/font/google'

import { useCallback } from 'react'

import { useTicket } from '../../TicketContext'
import CompactLayout from '../layouts/compact/Layout'
import DefaultLayout from '../layouts/default/Layout'

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    weight: ['400', '700']
})

export default function Ticket() {
    const { data } = useTicket()

    const renderLayout = useCallback(() => {
        switch (data.layout) {
            case 'default':
                return <DefaultLayout />
            case 'compact':
                return <CompactLayout />
        }
    }, [data.layout])

    return (
        <div
            id='ticket'
            className={`${data.layout === 'compact' ? 'w-[450px]' : 'w-[760px]'} h-[300px] ticket-bg shadow-lg text-[15px] flex flex-col ${robotoMono.className} ${data.useBackground ? 'text-white' : 'ticket-secondary'}`}
        >
            {renderLayout()}
        </div>
    )
}
