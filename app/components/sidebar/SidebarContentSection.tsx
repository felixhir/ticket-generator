'use client'

import { Trash, Upload } from 'lucide-react'

import DatePicker from 'react-datepicker'

import { currency, useTicket } from '../../TicketContext'

export default function SidebarContentSection() {
    const { data, setData } = useTicket()

    return (
        <div className='space-y-2'>
            <label>
                <span>Event Title</span>
                <input type='text' value={data.title} onChange={e => setData({ title: e.target.value })} />
            </label>

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

            <ImageInput />
        </div>
    )
}

function ImageInput() {
    const { data, setData } = useTicket()

    return (
        <div className='flex justify-between items-center gap-2'>
            <label className='text-sm font-semibold text-gray-200'>Picture</label>
            <div className='flex gap-2 items-center'>
                <div>
                    <label className='block w-full p-1 text-center bg-gray-300 dark:bg-gray-600 rounded cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700'>
                        <input
                            type='file'
                            accept='.jpeg,.png,.jpg'
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    setData({ image: URL.createObjectURL(e.target.files[0]) })
                                }
                                e.currentTarget.value = ''
                            }}
                            className='hidden'
                        />
                        <Upload />
                    </label>
                </div>
                <button
                    disabled={!data.image}
                    className={`block p-1 text-center bg-gray-300 dark:bg-gray-600 rounded ${!!data.image ? 'cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700' : ''}`}
                >
                    <Trash color={!data.image ? 'gray' : 'red'} onClick={() => setData({ image: null })}></Trash>
                </button>
            </div>
        </div>
    )
}
