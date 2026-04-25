'use client'

import { Dialog as DialogPrimitive } from 'radix-ui'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
    return <DialogPrimitive.Root data-slot='dialog' {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />
}

function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot='dialog-overlay'
            className={cn(
                'fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
                className
            )}
            {...props}
        />
    )
}

function DialogContent({
    className,
    size = 'default',
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    size?: 'default' | 'lg'
}) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot='dialog-content'
                data-size={size}
                className={cn(
                    'fixed top-1/2 left-1/2 z-50 flex w-full min-w-0 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-app-card border border-border bg-popover p-0 text-popover-foreground shadow-app-overlay ring-1 ring-foreground/10 outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
                    'data-[size=default]:max-w-sm data-[size=default]:sm:max-w-md data-[size=default]:md:max-w-lg',
                    'data-[size=lg]:max-w-lg data-[size=lg]:sm:max-w-2xl data-[size=lg]:md:max-w-3xl data-[size=lg]:lg:max-w-4xl',
                    className
                )}
                {...props}
            />
        </DialogPortal>
    )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='dialog-header'
            className={cn('flex w-full min-w-0 flex-col gap-app-card px-app-section pt-app-frame', className)}
            {...props}
        />
    )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='dialog-footer'
            className={cn(
                'flex w-full shrink-0 flex-col gap-2 border-t border-border p-app-card sm:flex-row sm:justify-end',
                className
            )}
            {...props}
        />
    )
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot='dialog-title'
            className={cn(
                'font-heading text-app-title font-bold leading-tight tracking-tight text-app-text-primary',
                className
            )}
            {...props}
        />
    )
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot='dialog-description'
            className={cn('text-app-body text-balance text-app-text-secondary', className)}
            {...props}
        />
    )
}

function DialogClose({
    className,
    variant = 'outline',
    size = 'default',
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close> & Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
    return (
        <Button variant={variant} size={size} asChild>
            <DialogPrimitive.Close data-slot='dialog-close' className={cn(className)} {...props} />
        </Button>
    )
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger
}
