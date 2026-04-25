import type * as React from 'react'

import { cn } from '@/lib/utils'

function TicketSurface({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'bg-ticket-background text-ticket-body text-ticket-text-light shadow-ticket-preview',
                className
            )}
            {...props}
        />
    )
}

function TicketThumbnail({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'pointer-events-none aspect-square w-full min-w-0 overflow-hidden rounded-app-inner bg-transparent',
                className
            )}
            {...props}
        />
    )
}

function TicketPreviewSlice({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'flex h-full w-full min-h-0 overflow-hidden bg-ticket-background shadow-ticket-preview',
                className
            )}
            {...props}
        />
    )
}

function TicketCodeContainer({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn('flex min-w-0 flex-col items-center justify-center overflow-hidden', className)}
            {...props}
        />
    )
}

export { TicketCodeContainer, TicketPreviewSlice, TicketSurface, TicketThumbnail }
