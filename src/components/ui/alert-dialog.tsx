'use client'

import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
    return <AlertDialogPrimitive.Root data-slot='alert-dialog' {...props} />
}

function AlertDialogTrigger({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
    return <AlertDialogPrimitive.Trigger data-slot='alert-dialog-trigger' {...props} />
}

function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
    return <AlertDialogPrimitive.Portal data-slot='alert-dialog-portal' {...props} />
}

function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
    return (
        <AlertDialogPrimitive.Overlay
            data-slot='alert-dialog-overlay'
            className={cn(
                'fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
                className
            )}
            {...props}
        />
    )
}

function AlertDialogContent({
    className,
    size = 'default',
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
    size?: 'default' | 'sm'
}) {
    return (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Content
                data-slot='alert-dialog-content'
                data-size={size}
                className={cn(
                    'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 flex w-full min-w-0 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-app-card bg-popover p-0 text-popover-foreground shadow-app-overlay ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-sm data-[size=default]:sm:max-w-md data-[size=default]:md:max-w-lg data-[size=default]:lg:max-w-xl data-[size=sm]:max-w-xs data-[size=sm]:sm:max-w-sm data-[size=sm]:md:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
                    className
                )}
                {...props}
            />
        </AlertDialogPortal>
    )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='alert-dialog-header'
            className={cn(
                'flex w-full min-w-0 flex-col gap-app-card px-app-section pt-app-frame pb-app-section text-center sm:group-data-[size=default]/alert-dialog-content:items-start sm:group-data-[size=default]/alert-dialog-content:text-left',
                className
            )}
            {...props}
        />
    )
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='alert-dialog-footer'
            className={cn(
                'flex w-full shrink-0 flex-col gap-2 border-t border-border bg-muted/50 p-app-card sm:flex-row sm:justify-end group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2',
                className
            )}
            {...props}
        />
    )
}

function AlertDialogMedia({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot='alert-dialog-media'
            className={cn(
                "mb-2 inline-flex size-10 items-center justify-center rounded-app-inner bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6",
                className
            )}
            {...props}
        />
    )
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
    return (
        <AlertDialogPrimitive.Title
            data-slot='alert-dialog-title'
            className={cn(
                'font-heading text-app-title font-bold leading-tight tracking-tight text-app-text-primary',
                className
            )}
            {...props}
        />
    )
}

function AlertDialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
    return (
        <AlertDialogPrimitive.Description
            data-slot='alert-dialog-description'
            className={cn(
                'text-app-body text-balance text-app-text-secondary md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
                className
            )}
            {...props}
        />
    )
}

function AlertDialogAction({
    className,
    variant = 'default',
    size = 'default',
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
    Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
    return (
        <Button variant={variant} size={size} asChild>
            <AlertDialogPrimitive.Action data-slot='alert-dialog-action' className={cn(className)} {...props} />
        </Button>
    )
}

function AlertDialogCancel({
    className,
    variant = 'outline',
    size = 'default',
    ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
    Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
    return (
        <Button variant={variant} size={size} asChild>
            <AlertDialogPrimitive.Cancel data-slot='alert-dialog-cancel' className={cn(className)} {...props} />
        </Button>
    )
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTitle,
    AlertDialogTrigger
}
