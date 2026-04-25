import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot='input'
            className={cn(
                'h-auto w-full min-w-0 rounded-app-card border border-input bg-secondary px-app-control-x py-app-control-y text-app-small text-foreground transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:text-app-small file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
                className
            )}
            {...props}
        />
    )
}

export { Input }
