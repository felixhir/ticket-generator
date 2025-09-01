import { useCallback } from 'react'

export function useUpdateCSSVariable(name: string) {
    return useCallback((color: string) => document.documentElement.style.setProperty(name, color), [name])
}
