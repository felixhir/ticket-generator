/**
 * Get the font size for a given size
 *
 * String interpolation does not work in Tailwind, so we need to predefine the font sizes
 *
 * @param size - The size to get the font size for
 * @returns The font size
 */
export default function getFontSize(size: 'sm' | 'md' | 'lg' | 'xl' | '2xl') {
    switch (size) {
        case 'sm':
            return 'text-[8px]'
        case 'md':
            return 'text-[16px]'
        case 'lg':
            return 'text-[24px]'
        case 'xl':
            return 'text-[32px]'
        case '2xl':
            return 'text-[48px]'
    }
}

export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
