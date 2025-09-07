import { useTicket } from '@/app/TicketContext'

export default function ConcertInfo() {
    const { data } = useTicket()

    return (
        <div>
            <p className='ticket-font-size-small'>{data.tour}</p>
            <p>{data.band}</p>
        </div>
    )
}
