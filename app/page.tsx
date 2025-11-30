'use client'

import GitHubButton from './components/GitHub'
import PrintWrapper from './components/PrintWrapper'
import ThemeToggle from './components/ThemeToggle'
import Sidebar from './components/sidebar/Sidebar'
import Ticket from './components/ticket/Ticket'
import { DesignProvider, useDesign } from './contexts/DesignContext'
import { TicketProvider } from './contexts/TicketContext'

export default function Home() {
    return (
        <TicketProvider>
            <DesignProvider>
                <PrintWrapper />
                <div className='flex w-screen h-screen print:hidden'>
                    <div className='flex flex-1 h-screen flex-col p-5'>
                        <h1 className='text-3xl font-semibold tracking-tight'>
                            Printed Event Nostalgia Information Sheets
                        </h1>
                        <p className='text-base text-gray-600 dark:text-gray-400'>
                            Create personalized tickets as keepsakes
                        </p>
                        <TicketWithData />
                    </div>

                    <Sidebar />

                    <div className='absolute left-4 bottom-4'>
                        <GitHubButton />
                    </div>
                    <div className='absolute right-84 bottom-4'>
                        <ThemeToggle />
                    </div>
                </div>
            </DesignProvider>
        </TicketProvider>
    )
}

function TicketWithData() {
    const { design: data } = useDesign()

    return (
        <div className='flex-1 flex items-center justify-center px-4'>
            <div id='preview-ticket'>
                <Ticket layout={data.layout} />
            </div>
        </div>
    )
}
