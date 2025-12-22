'use client'

import { BackgroundPattern, Layout, useDesign } from '@/app/contexts/DesignContext'
import { Trash, Upload } from 'lucide-react'

import { useCallback } from 'react'

import LayoutIcon from '../layouts/Icon'
import PopoverColorPicker from '../shared/PopoverColorPicker'

export default function SidebarDesignSection() {
    const { design, setDesign } = useDesign()

    return (
        <div className='space-y-6'>
            <Subsection title='Design'>
                <div className='flex gap-4'>
                    <label className='flex flex-1'>
                        <span>Short Side (cm)</span>
                        <input
                            type='number'
                            onChange={e => {
                                const value = parseFloat(e.target.value)
                                if (isNaN(value)) return
                                setDesign({ dimensions: { long: design.dimensions.long, short: value } })
                            }}
                            value={useDesign().design.dimensions.short}
                            className='w-full'
                        />
                    </label>
                    <label className='flex flex-1'>
                        <span>Long Side(cm)</span>
                        <input
                            type='number'
                            onChange={e => {
                                const value = parseFloat(e.target.value)
                                if (isNaN(value)) return
                                setDesign({ dimensions: { short: design.dimensions.short, long: value } })
                            }}
                            value={useDesign().design.dimensions.long}
                            className='w-full'
                        />
                    </label>
                </div>
            </Subsection>

            <Subsection title='Colors'>
                <div className='space-y-2'>
                    <CSSVariableColorInput variable='--ticket-primary' label='Primary' />
                    <CSSVariableColorInput variable='--ticket-secondary' label='Secondary' />
                    <CSSVariableColorInput variable='--ticket-tertiary' label='Tertiary' />
                    <CSSVariableColorInput variable='--ticket-text-light' label='Light' />
                    <CSSVariableColorInput variable='--ticket-text-dark' label='Dark' />
                    <CSSVariableColorInput variable='--ticket-background' label='Background' />
                    <BackgroundSelector />
                    <label>
                        <span>Pattern Size</span>
                        <input
                            type='range'
                            max={200}
                            min={10}
                            step={1}
                            onChange={e => document.documentElement.style.setProperty('--s', `${e.target.value}px`)}
                        ></input>
                    </label>
                </div>
            </Subsection>

            <Subsection title='Images'>
                <ImageInput propertyName='image' />
                <ImageInput propertyName='bandLogo' useGrayScale={true} />
            </Subsection>

            <Subsection title='Layout'>
                <div className='grid md:grid-cols-2 grid-cols-1 gap-3'>
                    <LayoutOption layout='default' label='Standard' icon={<LayoutIcon layout='default' scale={30} />} />
                    <LayoutOption layout='picture' label='Picture' icon={<LayoutIcon layout='picture' scale={50} />} />
                    <LayoutOption layout='band' label='Band' icon={<LayoutIcon layout='band' scale={50} />} />
                </div>
            </Subsection>
        </div>
    )
}

function Subsection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className='space-y-4'>
            <h3 className='text-md font-semibold border-b border-gray-700 pb-1'>{title}</h3>
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
            <label className='text-sm font-semibold '>{label}</label>
            <div className='flex gap-2 items-center'>
                {children}
                <PopoverColorPicker variable={variable} />
            </div>
        </div>
    )
}

function BackgroundSelector() {
    const { setDesign: setData } = useDesign()

    return (
        <div className='flex justify-between items-center'>
            <label className='text-sm font-semibold'>Background Pattern</label>
            <select onChange={e => setData({ backgroundPattern: e.target.value as BackgroundPattern })}>
                {Object.values(BackgroundPattern).map(pattern => (
                    <option key={pattern} value={pattern} label={pattern} />
                ))}
            </select>
        </div>
    )
}

function LayoutOption({ layout, icon, label }: { layout: Layout; icon: React.ReactNode; label: string }) {
    const { design, setDesign: setData } = useDesign()

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

function ImageInput({ propertyName, useGrayScale = false }: { propertyName: string; useGrayScale?: boolean }) {
    const { design, setDesign: setData } = useDesign()

    const getProperty = () => design[propertyName as keyof typeof design]

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (useGrayScale) {
            const reader = new FileReader()
            reader.onload = e => {
                const imageSrc = e.target?.result as string
                toGrayScale(imageSrc).then(url => setData({ [propertyName]: url }))
            }
            reader.readAsDataURL(file)
        } else {
            setData({ [propertyName]: URL.createObjectURL(file) })
        }
    }

    return (
        <div className='flex justify-between items-center gap-2'>
            <label className='text-sm font-semibold'>
                {propertyName
                    .split(/(?=[A-Z])/)
                    .map(str => str.replace(str[0], str[0].toUpperCase()))
                    .join(' ')}
            </label>
            <div className='flex gap-2 items-center'>
                <div>
                    <label className='block w-full p-1 text-center bg-gray-300 dark:bg-gray-600 rounded cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700'>
                        <input
                            type='file'
                            accept='.jpeg,.png,.jpg'
                            onChange={e => {
                                handleFileChange(e)
                                e.currentTarget.value = ''
                            }}
                            className='hidden'
                        />
                        <Upload />
                    </label>
                </div>
                <button
                    disabled={!getProperty()}
                    className={`block p-1 text-center bg-gray-300 dark:bg-gray-600 rounded ${!!getProperty() ? 'cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700' : ''}`}
                >
                    <Trash
                        color={!getProperty() ? 'gray' : 'red'}
                        onClick={() => setData({ [propertyName]: null })}
                    ></Trash>
                </button>
            </div>
        </div>
    )
}

async function toGrayScale(imageSrc: string): Promise<string> {
    return new Promise(resolve => {
        const img = new Image()
        img.src = imageSrc

        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height

            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, 0, 0)

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data

            for (let i = 0; i < data.length; i += 4) {
                const r = gammaCorrect(data[i])
                const g = gammaCorrect(data[i + 1])
                const b = gammaCorrect(data[i + 2])

                const lum = 0.299 * r + 0.587 * g + 0.114 * b // linear luminance

                data[i] = 255
                data[i + 1] = 255
                data[i + 2] = 255
                const scale = 2 // brightens overall alpha
                data[i + 3] = Math.min(255, Math.round(inverseGamma(lum) * scale))
            }

            ctx.putImageData(imageData, 0, 0)
            resolve(canvas.toDataURL())
        }
    })
}

function gammaCorrect(value: number): number {
    // Convert 0..255 to linear 0..1
    const v = value / 255
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function inverseGamma(value: number): number {
    // Convert linear 0..1 back to 0..255
    return value <= 0.0031308 ? value * 12.92 * 255 : (1.055 * Math.pow(value, 1 / 2.4) - 0.055) * 255
}
