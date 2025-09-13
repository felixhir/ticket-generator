import { useTicket } from '@/app/TicketContext'

import { useCallback } from 'react'

import CompactLayoutIcon from '../layouts/compact/Icon'
import DefaultLayoutIcon from '../layouts/default/Icon'
import PopoverColorPicker from '../shared/PopoverColorPicker'

export default function SidebarDesignSection() {
    return (
        <div className='space-y-12'>
            {/* Colors */}
            <Subsection title='Colors'>
                <div className='space-y-2'>
                    <CSSVariableColorInput variable='--primary-color' label='Primary Color' />
                    <CSSVariableColorInput variable='--secondary-color' label='Secondary Color' />
                    <CSSVariableColorInput variable='--tertiary-color' label='Tertiary Color' />
                    <CSSVariableColorInput variable='--background-color' label='Background Color' />
                </div>
            </Subsection>

            {/* Layout */}
            <Subsection title='Layout'>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-3'>
                    <LayoutOption layout='default' label='Standard' icon={<DefaultLayoutIcon />} />
                    <LayoutOption layout='compact' label='Compact' icon={<CompactLayoutIcon />} />
                </div>
            </Subsection>
        </div>
    )
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className='space-y-4'>
            <h3 className='text-md font-semibold text-gray-200 border-b border-gray-700 pb-1'>{title}</h3>
            {children}
        </div>
    )
}

function CSSVariableColorInput({ variable, label }: { variable: string; label: string }) {
    return (
        <div className='flex justify-between gap-2'>
            <label className='text-sm font-semibold text-gray-200'>{label}</label>
            <PopoverColorPicker variable={variable} />
        </div>
    )
}

function LayoutOption({
    layout,
    icon,
    label
}: {
    layout: 'default' | 'compact'
    icon: React.ReactNode
    label: string
}) {
    const { data, setData } = useTicket()

    const handleClick = useCallback(() => setData({ layout: layout }), [layout, setData])

    return (
        <button
            className={`flex items-center flex-col p-2 cursor-pointer gap-2 rounded-xl ${data.layout === layout ? 'border-blue-600 border-3' : 'border-2'}`}
            onClick={handleClick}
        >
            {icon}
            {label}
        </button>
    )
}
