import { useTicket } from '@/app/TicketContext'

export default function SidebarLayoutSection() {
    const { setData } = useTicket()

    return (
        <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
            <button className='cursor-pointer' onClick={() => setData({ layout: 'default' })}>
                Standard
            </button>
            <button className='cursor-pointer' onClick={() => setData({ layout: 'compact' })}>
                Compact
            </button>
        </div>
    )
}
