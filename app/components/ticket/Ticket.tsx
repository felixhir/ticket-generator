import { Roboto_Mono } from 'next/font/google'

import { useCallback } from 'react'

import { Layout } from '../../TicketContext'
import CompactLayout from '../layouts/compact/Layout'
import DefaultLayout from '../layouts/default/Layout'

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    weight: ['400', '700']
})

interface TicketProps {
    layout: Layout
}

export default function Ticket({ layout }: TicketProps) {
    const renderLayout = useCallback(() => {
        switch (layout) {
            case 'default':
                return <DefaultLayout />
            case 'compact':
                return <CompactLayout />
        }
    }, [layout])

    return (
        <div
            id='ticket'
            className={`${data.layout === 'compact' ? 'w-[450px]' : 'w-[760px]'} h-[300px] bg-ticket-background shadow-lg text-[15px] flex flex-col ${robotoMono.className}`}
        >
            {renderLayout()}
        </div>
    )
}
