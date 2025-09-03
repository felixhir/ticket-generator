import { currency, useTicket } from '@/app/TicketContext'

export default function Price() {
    const { data } = useTicket()

    const formatCurrency = (value: number, curr: currency) => {
        switch (curr) {
            case currency.SEK:
                return value.toFixed(0)
            default:
                return value.toFixed(2)
        }
    }

    return (
        <p>
            {formatCurrency(data.price, data.currency)} {currency[data.currency]}
        </p>
    )
}
