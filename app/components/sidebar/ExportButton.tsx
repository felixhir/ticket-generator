import { toPng } from 'html-to-image'
import { Image } from 'lucide-react'

import { useCallback } from 'react'

export default function ExportButton() {
    const saveImage = useCallback(() => {
        const node = document.getElementById('preview-ticket')
        if (node) {
            toPng(node, {
                width: node.scrollWidth * 3,
                height: node.scrollHeight * 3,
                style: {
                    transform: 'scale(3)', // scale up image for print quality
                    transformOrigin: 'top left'
                }
            }).then((dataUrl: string) => {
                const link = document.createElement('a')
                link.download = 'ticket.png'
                link.href = dataUrl
                link.click()
            })
        }
    }, [])

    return (
        <button
            onClick={saveImage}
            className='flex items-center justify-center gap-2 p-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 flex-1'
        >
            <Image className='w-4 h-4' />
            Export
        </button>
    )
}
