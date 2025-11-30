'use client'

import { useDesign } from '@/app/contexts/DesignContext'
import { BackgroundPattern, Layout } from '@/app/contexts/TicketContext'

import { useCallback } from 'react'

import LayoutIcon from '../layouts/Icon'
import PopoverColorPicker from '../shared/PopoverColorPicker'

export default function SidebarDesignSection() {
    return (
        <div className='space-y-12'>
            <Subsection title='Colors'>
                <div className='space-y-2'>
                    <CSSVariableColorInput variable='--ticket-primary' label='Primary' />
                    <CSSVariableColorInput variable='--ticket-secondary' label='Secondary' />
                    <CSSVariableColorInput variable='--ticket-tertiary' label='Tertiary' />
                    <CSSVariableColorInput variable='--ticket-text-light' label='Light' />
                    <CSSVariableColorInput variable='--ticket-text-dark' label='Dark' />
                    <CSSVariableColorInput variable='--ticket-background' label='Background' />
                    <BackgroundSelector />
                </div>
            </Subsection>

            <Subsection title='Layout'>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-3'>
                    <LayoutOption layout='default' label='Standard' icon={<LayoutIcon layout='default' scale={30} />} />
                    <LayoutOption layout='compact' label='Compact' icon={<LayoutIcon layout='compact' scale={50} />} />
                    <LayoutOption layout='picture' label='Picture' icon={<LayoutIcon layout='picture' scale={50} />} />
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

function CSSVariableColorInput({
    variable,
    label,
    children
}: {
    variable: string
    label: string
    children?: React.ReactNode
}) {
    return (
        <div className='flex justify-between items-center gap-2'>
            <label className='text-sm font-semibold text-gray-200'>{label}</label>
            <div className='flex gap-2 items-center'>
                {children}
                <PopoverColorPicker variable={variable} />
            </div>
        </div>
    )
}

function BackgroundSelector() {
    const { setData } = useDesign()

    return (
        <div className='flex justify-between items-center'>
            <label className='text-sm font-semibold text-gray-200'>Background Pattern</label>
            <select onChange={e => setData({ backgroundPattern: e.target.value as BackgroundPattern })}>
                <option value='lines' label='Lines' />
                <option value='blocks' label='Blocks' />
                <option value='hearts' label='Hearts' />
            </select>
        </div>
    )
}

function LayoutOption({ layout, icon, label }: { layout: Layout; icon: React.ReactNode; label: string }) {
    const { design, setData } = useDesign()

    const handleClick = useCallback(() => setData({ layout: layout }), [layout, setData])

    return (
        <button
            className={`flex items-center flex-col p-2 cursor-pointer gap-2 rounded-xl ${design.layout === layout ? 'border-blue-600 border-3' : 'border-2'}`}
            onClick={handleClick}
        >
            {icon}
            {label}
        </button>
    )
}
