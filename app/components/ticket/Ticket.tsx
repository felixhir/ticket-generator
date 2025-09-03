import { Roboto_Mono } from 'next/font/google'

import { useTicket } from '../../TicketContext'
import CompactLayout from '../layouts/CompactLayout'
import DefaultLayout from '../layouts/DefaultLayout'

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    weight: ['400', '700']
})

export default function Ticket() {
    const { data } = useTicket()

    const renderLayout = () => {
        switch (data.layout) {
            case 'default':
                return <DefaultLayout />
            case 'compact':
                return <CompactLayout />
        }
    }

    return (
        <div
            id='ticket'
            className={`ticket-width ticket-height ticket-bg ticket-shadow ticket-font-size flex flex-col ${robotoMono.className} ${data.useBackground ? 'ticket-text-alt' : 'ticket-text'}`}
        >
            {renderLayout()}
        </div>
    )
}
