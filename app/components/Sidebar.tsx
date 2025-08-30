import { Printer } from 'lucide-react'

import DatePicker from 'react-datepicker'

import { useTicket } from '../TicketContext'

export default function Sidebar({ ticketCount, setTicketCount }: any) {
    const { data, setData } = useTicket()

    return (
        <div className='bg-gray-200 border-l p-4 h-full flex flex-col text-black space-y-2 overflow-y-auto'>
            <label className='flex flex-col'>
                <span>Tour</span>
                <input
                    type='text'
                    value={data.tour}
                    onChange={e => setData({ tour: e.target.value })}
                    className='border p-1'
                />
            </label>

            <label className='flex flex-col'>
                <span>Band</span>
                <input
                    type='text'
                    value={data.band}
                    onChange={e => setData({ band: e.target.value })}
                    className='border p-1'
                />
            </label>

            <label className='flex flex-col'>
                <span>Venue</span>
                <input
                    type='text'
                    value={data.venue}
                    onChange={e => setData({ venue: e.target.value })}
                    className='border p-1'
                />
            </label>

            <label className='flex flex-col'>
                <span>Address</span>
                <textarea
                    rows={2}
                    value={data.address}
                    onChange={e => setData({ address: e.target.value })}
                    className='border p-1 resize-none'
                />
            </label>

            <label className='flex flex-col'>
                <span>Time</span>
                <DatePicker
                    className='border p-1'
                    showTimeInput={true}
                    selected={data.datetime}
                    onChange={date => setData({ datetime: date })}
                ></DatePicker>
            </label>

            <label>
                <span>Price</span>
                <input
                    type='number'
                    step='0.1'
                    value={data.price}
                    onChange={e => setData({ price: Number(e.target.value) })}
                    className='w-full border p-1 rounded'
                />
            </label>

            <label className='flex flex-col'>
                <span>Area</span>
                <input
                    type='text'
                    value={data.seatType}
                    onChange={e => setData({ seatType: e.target.value })}
                    className='border p-1 rounded'
                />
            </label>

            <label>
                <span>Barcode</span>
                <input
                    type='text'
                    value={data.barcode || ''}
                    onChange={e => setData({ barcode: e.target.value })}
                    className='w-full border p-1 rounded'
                />
            </label>

            <label>
                <span>Background</span>
                <input
                    type='file'
                    onChange={e => {
                        if (e) {
                            setData({ background: URL.createObjectURL(e.target.files![0]) })
                        }
                    }}
                    className='w-full border p-1 rounded'
                />
            </label>

            <div className='mt-auto p-2 flex flex-col gap-2'>
                <label className='text-sm font-medium'>Tickets per page</label>
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
                    className='mt-auto flex items-center justify-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                    <Printer className='w-4 h-4 mr-2' />
                    Print
                </button>
            </div>
        </div>
    )
}
