export default function DefaultLayoutIcon() {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' radius={5} className='w-24 h-24'>
            <rect x='0' y='0' width='100' height='100' rx='10' className='fill-gray-200' />
            <rect x='0' y='0' width='100' height='20' rx='6' style={{ fill: 'var(--primary-color)' }} />
            <rect x='0' y='5' width='100' height='35' style={{ fill: 'var(--primary-color)' }} />
            <rect x='10' y='11' width='100' height='18' rx='6' className='fill-gray-500' />
            {/* <text x='10' y='25' fontSize='12' fontWeight='bold'>
                        {data.brand}
                    </text> */}

            {Array.from({ length: 10 }).map((_, i) => (
                <rect key={i} x='15' y={60 + i * 6} width='25' height={2 + (i % 3)} className='fill-gray-700' />
            ))}

            <rect x='60' y='50' width='15' height='60' rx='6' style={{ fill: 'var(--tertiary-color)' }} />
            <rect x='65' y='50' width='50' height='30' rx='6' style={{ fill: 'var(--tertiary-color)' }} />
            <rect x='65' y='50' width='35' height='50' rx='6' style={{ fill: 'var(--tertiary-color)' }} />
        </svg>
    )
}
