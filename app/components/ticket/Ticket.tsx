import moment from 'moment'

import { Roboto_Mono } from 'next/font/google'

import { currency, useTicket } from '../../TicketContext'
import TicketBarcode from './TicketBarcode'

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    weight: ['400', '700']
})

export default function Ticket() {
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
        <div
            id='ticket'
            className={`ticket-width ticket-height ticket-bg ticket-shadow ticket-font-size flex flex-col ${robotoMono.className} ${data.useBackground ? 'ticket-text-alt' : 'ticket-text'}`}
        >
            <div className='ticket-header-bg ticket-header-height ticket-header-text ticket-padding font-bold flex items-center'>
                Some Brand
            </div>
            <div className='ticket-padding-content flex flex-1'>
                <div className='ticket-barcode-width flex items-center justify-center'>
                    {data.barcode && (
                        <div className='rotate-270 text-black flex flex-col items-center w-[180px] over'>
                            <TicketBarcode></TicketBarcode>
                        </div>
                    )}
                </div>

                <div
                    className='ticket-padding-inner ticket-font-size-large relative flex flex-1 flex-col h-full'
                    style={{ backgroundColor: data.useBackground ? data.bgColor : 'var(--ticket-bg)' }}
                >
                    {data.useBackground && data.background && (
                        <img
                            src={data.background}
                            className='absolute top-[2px] bottom-[2px] left-3/5 -translate-x-1/2 h-[calc(100%-4px)] object-cover [mask-image:linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]'
                        />
                    )}

                    <div className='z-10 flex flex-col h-full justify-between'>
                        <div>
                            <p className='ticket-font-size-small'>{data.tour}</p>
                            <p>{data.band}</p>
                        </div>
                        <div>
                            <p>{data.venue}</p>
                            <p className='ticket-font-size-small whitespace-pre-line'>{data.address}</p>
                        </div>
                        <p>{moment(data.datetime).format('dddd, DD. MMM YYYY, HH:mm')} Uhr</p>
                        <p>
                            {formatCurrency(data.price, data.currency)} {currency[data.currency]}
                        </p>
                        <p>{data.seatType}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
