import { useTicket } from '@/app/TicketContext'

export default function Seating() {
    const { data } = useTicket()

    return <p>{data.seatType}</p>
}
