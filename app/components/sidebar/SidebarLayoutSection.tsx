import { useTicket } from '@/app/TicketContext'
import { useUpdateCSSVariable } from '@/app/functions/useUpdateCSSVariable'

export default function SidebarLayoutSection() {
    const { data, setData } = useTicket()

    const setWidth = useUpdateCSSVariable('--ticket-width')

    return (
        <div className='grid md:grid-cols-2 grid-cols-1 gap-3'>
            <button
                className={`flex items-center flex-col p-2 cursor-pointer gap-2 rounded-xl ${data.layout === 'default' ? 'border-blue-600 border-3' : 'border-2'}`}
                onClick={() => {
                    setData({ layout: 'default' })
                    setWidth('760px')
                }}
            >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' radius={5} className='w-24 h-24'>
                    <rect x='0' y='0' width='100' height='100' rx='10' className='fill-gray-200' />
                    <rect x='0' y='0' width='100' height='20' rx='6' style={{ fill: 'var(--ticket-header-bg)' }} />
                    <rect x='0' y='5' width='100' height='35' style={{ fill: 'var(--ticket-header-bg)' }} />
                    <rect x='10' y='11' width='100' height='18' rx='6' className='fill-gray-500' />
                    {/* <text x='10' y='25' fontSize='12' fontWeight='bold'>
                        {data.brand}
                    </text> */}

                    {Array.from({ length: 10 }).map((_, i) => (
                        <rect key={i} x='15' y={60 + i * 6} width='25' height={2 + (i % 3)} className='fill-gray-700' />
                    ))}

                    <rect x='60' y='50' width='15' height='60' rx='6' style={{ fill: 'var(--ticket-bg-color)' }} />
                    <rect x='65' y='50' width='50' height='30' rx='6' style={{ fill: 'var(--ticket-bg-color)' }} />
                    <rect x='65' y='50' width='35' height='50' rx='6' style={{ fill: 'var(--ticket-bg-color)' }} />
                </svg>
                Standard
            </button>
            <button
                className={`flex flex-col items-center p-2 cursor-pointer gap-2 rounded-xl ${data.layout === 'compact' ? 'border-blue-600 border-3' : 'border-2'}`}
                onClick={() => {
                    setData({ layout: 'compact' })
                    setWidth('450px')
                }}
            >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' radius={5} className='w-24 h-24'>
                    <rect x='0' y='0' width='100' height='100' rx='10' className='fill-gray-200' />
                    <rect x='0' y='0' width='20' height='100' rx='6' style={{ fill: 'var(--ticket-header-bg)' }} />
                    <rect x='10' y='0' width='30' height='100' style={{ fill: 'var(--ticket-header-bg)' }} />
                    <rect x='11' y='60' width='18' height='100' rx='6' className='fill-gray-500' />

                    <rect x='50' y='10' width='40' height='100' rx='6' className='fill-gray-500' />
                    <rect x='60' y='10' width='50' height='20' rx='6' className='fill-gray-500' />
                    <rect x='60' y='10' width='40' height='90' rx='6' className='fill-gray-500' />
                </svg>
                Compact
            </button>
        </div>
    )
}
