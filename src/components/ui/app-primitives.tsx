import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const appSurfaceVariants = cva('text-app-text-primary', {
    variants: {
        variant: {
            card: 'rounded-app-card border border-app-border bg-card',
            elevated: 'rounded-app-card border border-app-border bg-app-surface-elevated shadow-app-overlay',
            shell: 'rounded-app-shell border border-app-border bg-app-surface shadow-app-shell',
            floating: 'rounded-app-card border border-app-border bg-app-surface-elevated shadow-app-floating-bar',
            transparent: 'rounded-app-card border border-app-border bg-transparent'
        },
        padding: {
            none: 'p-0',
            card: 'p-app-card',
            section: 'p-app-section',
            frame: 'p-app-frame'
        }
    },
    defaultVariants: {
        variant: 'card',
        padding: 'section'
    }
})

type AppSurfaceProps<T extends React.ElementType> = VariantProps<typeof appSurfaceVariants> & {
    as?: T
    className?: string
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'className'>

function AppSurface<T extends React.ElementType = 'div'>({
    as,
    className,
    padding,
    variant,
    ...props
}: AppSurfaceProps<T>) {
    const Component = as ?? 'div'

    return <Component className={cn(appSurfaceVariants({ variant, padding }), className)} {...props} />
}

function SectionEyebrow({ className, ...props }: React.ComponentProps<'p'>) {
    return (
        <p
            className={cn('text-app-caption uppercase tracking-app-label text-app-text-secondary', className)}
            {...props}
        />
    )
}

function SectionHeader({
    actions,
    children,
    className,
    description,
    eyebrow,
    title,
    titleAs = 'h2'
}: {
    actions?: React.ReactNode
    children?: React.ReactNode
    className?: string
    description?: React.ReactNode
    eyebrow?: React.ReactNode
    title: React.ReactNode
    titleAs?: 'h1' | 'h2' | 'h3'
}) {
    const Title = titleAs

    return (
        <header className={cn('flex flex-wrap items-start justify-between gap-app-card', className)}>
            <div className='min-w-0'>
                {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
                <Title className='text-app-heading font-semibold leading-tight text-app-text-primary'>{title}</Title>
                {description && <p className='mt-1 text-app-small text-app-text-secondary'>{description}</p>}
            </div>
            {actions}
            {children}
        </header>
    )
}

function SegmentedControl({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'flex w-fit max-w-full items-center justify-center gap-1 overflow-x-auto rounded-app-control border border-app-border bg-app-surface p-1',
                className
            )}
            {...props}
        />
    )
}

function PreviewFrame({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <AppSurface
            variant='transparent'
            padding='none'
            className={cn('flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden', className)}
            {...props}
        />
    )
}

function EmptyState({
    children,
    className,
    ...props
}: React.ComponentProps<'div'> & {
    children: React.ReactNode
}) {
    return (
        <Card className={cn('p-app-section text-center text-app-small text-app-text-secondary', className)} {...props}>
            {children}
        </Card>
    )
}

export { AppSurface, appSurfaceVariants, EmptyState, PreviewFrame, SectionEyebrow, SectionHeader, SegmentedControl }
