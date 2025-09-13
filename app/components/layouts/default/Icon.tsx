export default function DefaultLayoutIcon() {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' radius={5} className='w-24 h-24'>
            <rect x='0' y='0' width='100' height='100' rx='10' className='fill-ticket-background' />
            <rect x='0' y='0' width='100' height='20' rx='6' className='fill-ticket-primary' />
            <rect x='0' y='5' width='100' height='35' className='fill-ticket-primary' />
            <rect x='10' y='11' width='100' height='18' rx='6' className='fill-ticket-secondary' />

            {Array.from({ length: 10 }).map((_, i) => (
                <rect key={i} x='15' y={60 + i * 6} width='25' height={2 + (i % 3)} className='fill-ticket-light' />
            ))}

            <rect x='60' y='50' width='15' height='60' rx='6' className='fill-ticket-secondary' />
            <rect x='65' y='50' width='50' height='30' rx='6' className='fill-ticket-secondary' />
            <rect x='65' y='50' width='35' height='50' rx='6' className='fill-ticket-secondary' />
        </svg>
    )
}
