'use client'

import { Moon, Sun } from 'lucide-react'

import Image from 'next/image'

import { useEffect, useState } from 'react'

import { TicketProvider } from './TicketContext'
import Sidebar from './components/Sidebar'
import Ticket from './components/Ticket'

export default function Home() {
    const [ticketCount, setTicketCount] = useState(1)
    const [isDarkMode, toggle] = useState(true)

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark')
        } else {
            document.documentElement.removeAttribute('data-theme')
        }
    }, [isDarkMode])

    return (
        <TicketProvider>
            <div id='print-wrapper' className='h-screen hidden print:flex flex-col justify-between'>
                {Array.from({ length: ticketCount }).map((_, i) => (
                    <div key={i} className='print-ticket'>
                        <Ticket />
                    </div>
                ))}
            </div>

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

                <div>
                    <Sidebar ticketCount={ticketCount} setTicketCount={setTicketCount} />
                </div>

                <button
                    onClick={() => window.open('https://github.com/felixhir/ticket-generator', '_blank')}
                    className='absolute left-4 bottom-4 transition-transform transform hover:scale-110 cursor-pointer'
                >
                    <Image src='/github.svg' alt='' width='50' height='50'></Image>
                </button>
                <button
                    className='absolute right-84 bottom-4 transition-transform transform hover:scale-110 cursor-pointer border rounded-full h-9 w-9 flex items-center justify-center'
                    onClick={() => toggle(!isDarkMode)}
                >
                    {isDarkMode ? <Sun></Sun> : <Moon></Moon>}
                </button>
            </div>
        </TicketProvider>
    )
}
