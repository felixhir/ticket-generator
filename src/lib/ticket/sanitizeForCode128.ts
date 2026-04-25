export function sanitizeForCode128(value: string): string {
    return value
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .split('')
        .filter(c => {
            const code = c.charCodeAt(0)
            return code >= 0x20 && code <= 0x7e
        })
        .join('')
}
