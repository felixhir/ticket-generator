import { useTicket } from '@/app/TicketContext'

export default function Seating() {
    const { data } = useTicket()

    return <p className='text-ticket-light'>{data.seatType}</p>
}
