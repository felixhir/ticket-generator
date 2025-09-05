import { useTicket } from '@/app/TicketContext'

export default function Location() {
    const { data } = useTicket()

    return (
        <div>
            <p>{data.venue}</p>
            <p className='ticket-font-size-small whitespace-pre-line'>{data.address}</p>
        </div>
    )
}
