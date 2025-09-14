'use client'

import { useTicket } from '@/app/TicketContext'
import { extractAverageColor } from '@/app/functions/extractAverageColor'
import { useUpdateCSSVariable } from '@/app/functions/useUpdateCSSVariable'
import { Trash, Upload } from 'lucide-react'

import { useCallback, useEffect } from 'react'

import CompactLayoutIcon from '../layouts/compact/Icon'
import DefaultLayoutIcon from '../layouts/default/Icon'
import PopoverColorPicker from '../shared/PopoverColorPicker'

export default function SidebarDesignSection() {
    return (
        <div className='space-y-12'>
            <Subsection title='Colors'>
                <div className='space-y-2'>
                    <CSSVariableColorInput variable='--ticket-primary' label='Primary' />
                    <CSSVariableColorInput variable='--ticket-secondary' label='Secondary' />
                    <CSSVariableColorInput variable='--ticket-tertiary' label='Tertiary' />
                    <CSSVariableColorInput variable='--ticket-light' label='Light' />
                    <CSSVariableColorInput variable='--ticket-dark' label='Dark' />
                    <BackgroundInput />
                </div>
            </Subsection>

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

function BackgroundInput() {
    const { data, setData } = useTicket()
    const updateCSSVariable = useUpdateCSSVariable('--ticket-background')

    useEffect(() => {
        if (!data.background) {
            return
        }

        const img = new Image()
        img.src = data.background
        img.onload = () => {
            const color = extractAverageColor(img)
            updateCSSVariable(color)
        }
    }, [data.background, updateCSSVariable])

    return (
        <CSSVariableColorInput variable='--ticket-background' label='Background'>
            <>
                <div>
                    <label className='block w-full p-1 text-center bg-gray-300 dark:bg-gray-600 rounded cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700'>
                        <input
                            type='file'
                            accept='.jpeg,.png,.jpg'
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    setData({ background: URL.createObjectURL(e.target.files[0]) })
                                }
                            }}
                            className='hidden'
                            id='background-upload'
                        />
                        <Upload />
                    </label>
                </div>
                <button
                    disabled={!data.background}
                    className={`block p-1 text-center bg-gray-300 dark:bg-gray-600 rounded ${!!data.background ? 'cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700' : ''}`}
                >
                    <Trash
                        color={!data.background ? 'gray' : 'red'}
                        onClick={() => setData({ background: null })}
                    ></Trash>
                </button>
            </>
        </CSSVariableColorInput>
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
