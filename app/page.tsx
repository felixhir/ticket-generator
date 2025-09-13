'use client'

import { TicketProvider } from './TicketContext'
import GitHubButton from './components/GitHub'
import PrintWrapper from './components/PrintWrapper'
import ThemeToggle from './components/ThemeToggle'
import Sidebar from './components/sidebar/Sidebar'
import Ticket from './components/ticket/Ticket'

export default function Home() {
    return (
        <TicketProvider>
            <PrintWrapper />
            <div className='flex w-screen h-screen print:hidden'>
                <div className='flex flex-1 h-screen flex-col p-5'>
                    <h1 className='text-3xl font-semibold tracking-tight'>
                        Printed Event Nostalgia Information Sheets
                    </h1>
                    <p className='text-base text-gray-600 dark:text-gray-400'>
                        Create personalized tickets as keepsakes
                    </p>
                    <div className='flex-1 flex items-center justify-center px-4'>
                        <Ticket />
                    </div>
                </div>

                <Sidebar />

                <GitHubButton />
                <ThemeToggle />
            </div>
        </TicketProvider>
    )
}
