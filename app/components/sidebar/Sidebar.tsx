'use client'

import { useState } from 'react'

import ExportButton from './ExportButton'
import SidebarContentSection from './SidebarContentSection'
import SidebarDesignSection from './SidebarDesignSection'

export default function Sidebar() {
    const [activeTab, setActiveTab] = useState<'content' | 'design'>('content')
    return (
        <div className='w-80 bg-white dark:bg-gray-800 shadow-sm border-l h-full flex flex-col overflow-y-auto'>
            {/* Tab Navigation */}
            <div className='flex  border-b border-gray-200 dark:border-gray-600'>
                <TabButton label='Content' active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
                <TabButton label='Design' active={activeTab === 'design'} onClick={() => setActiveTab('design')} />
            </div>

            {/* Tab Content */}
            <div className='flex-1 space-y-2 overflow-auto p-4'>
                {activeTab === 'content' && <SidebarContentSection />}
                {activeTab === 'design' && <SidebarDesignSection />}
            </div>

            <div className='mt-auto p-4'>
                <ExportButton />
            </div>
        </div>
    )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors cursor-pointer border-b-2 ${active ? 'text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent'}`}
            onClick={onClick}
        >
            {label}
        </button>
    )
}
