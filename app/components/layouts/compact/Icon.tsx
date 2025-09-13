export default function CompactLayoutIcon() {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' radius={5} className='w-24 h-24'>
            <rect x='0' y='0' width='100' height='100' rx='10' className='fill-gray-200' />
            <rect x='0' y='0' width='20' height='100' rx='6' style={{ fill: 'var(--primary-color)' }} />
            <rect x='10' y='0' width='30' height='100' style={{ fill: 'var(--primary-color)' }} />
            <rect x='11' y='60' width='18' height='100' rx='6' className='fill-gray-500' />

            <rect x='50' y='10' width='40' height='100' rx='6' className='fill-gray-500' />
            <rect x='60' y='10' width='50' height='20' rx='6' className='fill-gray-500' />
            <rect x='60' y='10' width='40' height='90' rx='6' className='fill-gray-500' />
        </svg>
    )
}
