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

    return <div className={`bg-ticket-background shadow-lg text-[15px] ${robotoMono.className}`}>{renderLayout()}</div>
}
