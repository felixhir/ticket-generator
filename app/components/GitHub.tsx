import Image from 'next/image'

export default function GitHubButton() {
    return (
        <button
            onClick={() => window.open('https://github.com/felixhir/ticket-generator', '_blank')}
            className='absolute left-4 bottom-4 transition-transform transform hover:scale-110 cursor-pointer dark:bg-white rounded-full'
        >
            <Image src='github.svg' className='-mt-[1px]' alt='Github Icon' width='50' height='50' />
        </button>
    )
}
