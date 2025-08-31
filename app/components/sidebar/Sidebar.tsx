import { Printer } from 'lucide-react'

import { useState } from 'react'

import SidebarContentSection from './SidebarContentSection'
import SidebarStylingSection from './styling/SidebarStylingSection'

interface SidebarProps {
    ticketCount: number
    setTicketCount: (count: number) => void
}

export default function Sidebar({ ticketCount, setTicketCount }: SidebarProps) {
    const [activeTab, setActiveTab] = useState<'content' | 'styling'>('content')

    return (
        <div className='w-80 bg-white dark:bg-gray-800 shadow-sm border-l p-4 h-full flex flex-col overflow-y-auto'>
            {/* Tab Navigation */}
            <div className='flex mb-4 border-b border-gray-200 dark:border-gray-600'>
                <button
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'content'
                            ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('content')}
                >
                    Content
                </button>
                <button
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'styling'
                            ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('styling')}
                >
                    Styling
                </button>
            </div>

            {/* Tab Content */}
            <div className='flex-1 space-y-2 mb-10'>
                {activeTab === 'content' && <SidebarContentSection />}
                {activeTab === 'styling' && <SidebarStylingSection />}
            </div>

            <div className='mt-auto'>
                <div className='flex flex-1 items-center gap-2'>
                    <label className='text-sm font-medium'>Tickets per page:</label>
                    <select
                        value={ticketCount}
                        onChange={e => setTicketCount(Number(e.target.value))}
                        className='border p-1 rounded'
                    >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                    </select>
                    <button
                        onClick={() => window.print()}
                        className='mt-auto flex items-center justify-center p-2 bg-[var(--accent)] text-white rounded hover:bg-blue-600 flex-1'
                    >
                        <Printer className='w-4 h-4 mr-2' />
                        Print
                    </button>
                </div>
            </div>
        </div>
    )
}
