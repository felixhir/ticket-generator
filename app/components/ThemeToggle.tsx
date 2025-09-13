'use client'

import { Moon, Sun } from 'lucide-react'

import { useEffect, useState } from 'react'

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
        <button
            className='absolute right-84 bottom-4 transition-transform transform hover:scale-110 cursor-pointer border rounded-full h-9 w-9 flex items-center justify-center'
            onClick={() => toggle(!isDarkMode)}
        >
            {isDarkMode ? <Sun></Sun> : <Moon></Moon>}
        </button>
    )
}
