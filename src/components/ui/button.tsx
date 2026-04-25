import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    "group/button inline-flex shrink-0 items-center justify-center rounded-app-control border border-transparent bg-clip-padding text-app-small font-medium whitespace-nowrap transition outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:opacity-90 [a]:hover:opacity-90',
                outline:
                    'border-border bg-card text-foreground hover:border-primary hover:bg-secondary aria-expanded:border-primary aria-expanded:bg-secondary',
                secondary:
                    'border-border bg-secondary text-secondary-foreground hover:border-primary aria-expanded:border-primary aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
                ghost: 'text-muted-foreground hover:bg-secondary hover:text-foreground aria-expanded:bg-secondary aria-expanded:text-foreground',
                destructive:
                    'bg-destructive text-primary-foreground hover:opacity-90 focus-visible:border-destructive/40 focus-visible:ring-destructive/20',
                link: 'text-primary underline-offset-4 hover:underline'
            },
            size: {
                default:
                    'gap-1.5 px-app-control-x py-app-control-y has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                xs: "gap-1 px-2 py-1 text-app-caption has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
                sm: "gap-1 px-3 py-1.5 text-app-small has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
                lg: 'gap-1.5 px-app-section py-app-card has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
                icon: 'size-9',
                'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
                'icon-sm': 'size-7',
                'icon-lg': 'size-9'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

function Button({
    className,
    variant = 'default',
    size = 'default',
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot.Root : 'button'

    return (
        <Comp
            data-slot='button'
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }
