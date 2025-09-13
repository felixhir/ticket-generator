import { useTicket } from '@/app/TicketContext'
import moment from 'moment'

export default function Date() {
    const { data } = useTicket()

    return <p className='text-ticket-light'>{moment(data.datetime).format('dddd, DD. MMM YYYY, HH:mm')}</p>
}
