import { useTicket } from '@/app/TicketContext'

export default function Location() {
    const { data } = useTicket()

    return (
        <div>
            <p>{data.venue}</p>
            <p className='text-[8px] whitespace-pre-line'>{data.address}</p>
        </div>
    )
}
