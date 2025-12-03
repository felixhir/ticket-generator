import domtoimage from 'dom-to-image'
import { ChevronUp, Image, Printer } from 'lucide-react'

import { useCallback, useEffect, useRef, useState } from 'react'

export default function ExportButton() {
    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // close menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const saveImage = useCallback(() => {
        const node = document.getElementById('preview-ticket')
        if (node) {
            domtoimage
                .toPng(node, {
                    width: node.scrollWidth * 3,
                    height: node.scrollHeight * 3,
                    style: {
                        transform: 'scale(3)', // scale up image for print quality
                        transformOrigin: 'top left'
                    }
                })
                .then(dataUrl => {
                    const link = document.createElement('a')
                    link.download = 'ticket.png'
                    link.href = dataUrl
                    link.click()
                })
        }
    }, [])

    return (
        <div ref={menuRef} className='relative flex w-full'>
            <button
                onClick={() => window.print}
                className='flex items-center justify-center gap-2 p-2 bg-blue-500 text-white rounded-l hover:bg-blue-600 flex-1'
            >
                <Printer className='w-4 h-4' />
                Print
            </button>

            <button
                onClick={() => setOpen(open => !open)}
                className='p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 flex items-center'
            >
                <ChevronUp className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`} />
            </button>

            <div
                className={`absolute right-0 bottom-full rounded border mb-1 w-full bg-white dark:bg-gray-800 transition duration-200 transform origin-bottom
                ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
            >
                <Button
                    callback={() => {
                        setOpen(false)
                        window.print()
                    }}
                >
                    <Printer className='w-4 h-4' />
                    Print
                </Button>

                <Button
                    callback={() => {
                        setOpen(false)
                        saveImage()
                    }}
                >
                    <Image className='w-4 h-4' />
                    Export
                </Button>
            </div>
        </div>
    )
}

function Button({ children, callback }: { children: React.ReactNode; callback: () => void }) {
    return (
        <button
            onClick={() => callback()}
            className='w-full px-3 py-2 flex items-center gap-2 dark:hover:bg-gray-700 hover:bg-gray-200'
        >
            {children}
        </button>
    )
}
