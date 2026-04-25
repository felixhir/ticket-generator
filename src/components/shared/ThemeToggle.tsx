'use client'

import { Moon, Sun } from 'lucide-react'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
    const [isDarkMode, toggle] = useState(true)

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark')
        } else {
            document.documentElement.removeAttribute('data-theme')
        }
    }, [isDarkMode])

    return (
        <Button
            type='button'
            aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={isDarkMode}
            size='icon'
            variant='outline'
            className='transition-transform hover:scale-105'
            onClick={() => toggle(!isDarkMode)}
        >
            {isDarkMode ? <Sun></Sun> : <Moon></Moon>}
        </Button>
    )
}
