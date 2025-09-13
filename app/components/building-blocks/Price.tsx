import { currency, useTicket } from '@/app/TicketContext'

import { useMemo } from 'react'

export default function Price() {
    const { data } = useTicket()

    const formattedValue = useMemo(() => {
        switch (data.currency) {
            case currency.SEK:
                return data.price.toFixed(0)
            default:
                return data.price.toFixed(2)
        }
    }, [data.price, data.currency])

    return (
        <p className='text-ticket-light'>
            {formattedValue} {currency[data.currency]}
        </p>
    )
}
