import { Printer, Trash, Upload } from 'lucide-react'

import { useEffect } from 'react'
import { HexColorInput } from 'react-colorful'
import DatePicker from 'react-datepicker'

import { currency, defaultBgColor, useTicket } from '../TicketContext'
import { extractAverageColor } from '../functions/extractAverageColor'
import PopoverPicker from './PopoverPicker'
import './Sidebar.css'

interface SidebarProps {
    ticketCount: number
    setTicketCount: (count: number) => void
}

export default function Sidebar({ ticketCount, setTicketCount }: SidebarProps) {
    const { data, setData } = useTicket()

    useEffect(() => {
        if (!data.background) {
            setData({ bgColor: defaultBgColor })
            return
        }

        const img = new Image()
        img.src = data.background
        img.onload = () => {
            const color = extractAverageColor(img)
            setData({ bgColor: color })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.background])

    return (
        <div className='w-80 bg-white dark:bg-gray-800 shadow-sm border-l p-4 h-full flex flex-col space-y-2 overflow-y-auto'>
            <label>
                <span>Tour</span>
                <input type='text' value={data.tour} onChange={e => setData({ tour: e.target.value })} />
            </label>

            <label>
                <span>Band</span>
                <input type='text' value={data.band} onChange={e => setData({ band: e.target.value })} />
            </label>

            <label>
                <span>Venue</span>
                <input type='text' value={data.venue} onChange={e => setData({ venue: e.target.value })} />
            </label>

            <label>
                <span>Address</span>
                <textarea
                    rows={2}
                    value={data.address}
                    onChange={e => setData({ address: e.target.value })}
                    className='resize-none'
                />
            </label>

            <label>
                <span>Time</span>
                <DatePicker
                    className='w-full'
                    showTimeInput={true}
                    selected={data.datetime}
                    onChange={date => setData({ datetime: date })}
                ></DatePicker>
            </label>

            <label>
                <span>Price</span>
                <div className='flex gap-2'>
                    <input
                        type='number'
                        step='0.1'
                        value={data.price}
                        onChange={e => setData({ price: Number(e.target.value) })}
                    />
                    <select value={data.currency} onChange={e => setData({ currency: Number(e.target.value) })}>
                        <option value={currency.EUR}>EUR</option>
                        <option value={currency.USD}>USD</option>
                        <option value={currency.SEK}>SEK</option>
                    </select>
                </div>
            </label>

            <label>
                <span>Area</span>
                <input type='text' value={data.seatType} onChange={e => setData({ seatType: e.target.value })} />
            </label>

            <label>
                <span>Barcode</span>
                <input type='text' value={data.barcode || ''} onChange={e => setData({ barcode: e.target.value })} />
            </label>

            <div>
                <label>Background</label>
                <div className='flex w-full gap-2 items-center'>
                    <input
                        type='checkbox'
                        checked={data.useBackground}
                        onChange={e => setData({ useBackground: e.target.checked })}
                    ></input>
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
                    <PopoverPicker
                        color={data.bgColor}
                        onChange={(e: string) => setData({ bgColor: e })}
                    ></PopoverPicker>
                    <HexColorInput
                        color={data.bgColor}
                        onChange={e => setData({ bgColor: e })}
                        className='p-1 border rounded w-[3cm]'
                    ></HexColorInput>
                </div>
            </div>

            <div className='flex gap-2 items-center'></div>

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
