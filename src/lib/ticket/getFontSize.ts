export default function getFontSize(size: FontSize) {
    switch (size) {
        case 'sm':
            return 'text-ticket-sm'
        case 'md':
            return 'text-ticket-md'
        case 'lg':
            return 'text-ticket-lg'
        case 'xl':
            return 'text-ticket-xl'
        case '2xl':
            return 'text-ticket-2xl'
    }
}

export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
