import { useTicket } from '@/app/TicketContext'

export default function ConcertInfo() {
    const { data } = useTicket()

    return (
        <div>
            <p className='text-[8px]'>{data.tour}</p>
            <p>{data.band}</p>
        </div>
    )
}
