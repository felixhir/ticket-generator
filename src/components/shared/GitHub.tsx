'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function GitHubButton() {
    return (
        <Button
            type='button'
            size='icon-lg'
            variant='ghost'
            aria-label='Open GitHub repository'
            onClick={() => window.open('https://github.com/felixhir/ticket-generator', '_blank')}
            className='transition-transform hover:scale-105 dark:bg-white'
        >
            <Image src='github.svg' alt='Github Icon' width={20} height={20} />
        </Button>
    )
}
