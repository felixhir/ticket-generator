/**
 * Get the font size for a given size
 *
 * String interpolation does not work in Tailwind, so we need to predefine the font sizes
 *
 * @param size - The size to get the font size for
 * @returns The font size
 */
export default function getTicketTextColor(size: TicketColor) {
    switch (size) {
        case 'primary':
            return 'text-ticket-primary'
        case 'primary-muted':
            return 'text-ticket-primary-muted'
        case 'secondary':
            return 'text-ticket-secondary'
        case 'secondary-muted':
            return 'text-ticket-secondary-muted'
        case 'tertiary':
            return 'text-ticket-tertiary'
        case 'tertiary-muted':
            return 'text-ticket-tertiary-muted'
        case 'text-light':
            return 'text-ticket-text-light'
        case 'text-dark':
            return 'text-ticket-text-dark'
        case 'background':
            return 'text-ticket-background'
    }
}

export type TicketColor =
    | 'primary'
    | 'primary-muted'
    | 'secondary'
    | 'secondary-muted'
    | 'tertiary'
    | 'tertiary-muted'
    | 'text-light'
    | 'text-dark'
    | 'background'
