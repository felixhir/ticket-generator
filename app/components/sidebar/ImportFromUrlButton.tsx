'use client'

import { getSupportedSite, importEventFromUrl } from '@/app/functions/importEventFromUrl'
import { Link } from 'lucide-react'

import { useState } from 'react'

import { useTicket } from '../../contexts/TicketContext'

type Status = { type: 'idle' } | { type: 'loading' } | { type: 'error'; message: string } | { type: 'success' }

export default function ImportFromUrlButton() {
    const { setData } = useTicket()
    const [open, setOpen] = useState(false)
    const [url, setUrl] = useState('')
    const [status, setStatus] = useState<Status>({ type: 'idle' })

    async function handleImport() {
        const trimmed = url.trim()
        if (!trimmed) return

        if (!getSupportedSite(trimmed)) {
            setStatus({
                type: 'error',
                message:
                    'Only eventim, ticketmaster, and reservix URLs are supported right now. Other websites coming soon!'
            })
            return
        }

        setStatus({ type: 'loading' })

        try {
            const ticketData = await importEventFromUrl(trimmed)
            setData(ticketData)
            setStatus({ type: 'success' })
            setTimeout(() => {
                setOpen(false)
                setStatus({ type: 'idle' })
                setUrl('')
            }, 1000)
        } catch (err) {
            setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to import event data' })
        }
    }

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className='flex items-center justify-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded w-full hover:bg-gray-200 dark:hover:bg-gray-600 flex-1'
            >
                <Link className='w-4 h-4' />
                Import from URL
            </button>
        )
    }

    return (
        <div className='space-y-2'>
            <div className='flex gap-2'>
                <input
                    type='url'
                    value={url}
                    onChange={e => {
                        setUrl(e.target.value)
                        if (status.type === 'error') setStatus({ type: 'idle' })
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleImport()
                        if (e.key === 'Escape') {
                            setOpen(false)
                            setStatus({ type: 'idle' })
                            setUrl('')
                        }
                    }}
                    placeholder='Paste event URL…'
                    className='flex-1 min-w-0'
                    autoFocus
                    disabled={status.type === 'loading'}
                />
                <button
                    onClick={handleImport}
                    disabled={status.type === 'loading' || !url.trim()}
                    className='px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shrink-0'
                >
                    {status.type === 'loading' ? '…' : 'Import'}
                </button>
            </div>

            {status.type === 'error' && <p className='text-xs text-red-500'>{status.message}</p>}
            {status.type === 'success' && <p className='text-xs text-green-500'>Event data imported!</p>}
        </div>
    )
}
