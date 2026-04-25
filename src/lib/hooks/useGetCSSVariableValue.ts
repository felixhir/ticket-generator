import { useCallback } from 'react'

export default function useGetCSSVariableValue() {
    return useCallback((variable: string) => {
        const currentValue = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()

        if (currentValue) {
            // Handle different units and convert to pixels
            if (currentValue.endsWith('px')) {
                return parseInt(currentValue.replace('px', '')) || 0
            } else if (currentValue.endsWith('rem')) {
                // Convert rem to pixels (1rem = 16px typically)
                const remValue = parseFloat(currentValue.replace('rem', ''))
                return Math.round(remValue * 16)
            } else if (currentValue.endsWith('mm')) {
                // Convert mm to pixels (1mm ≈ 3.78px)
                const mmValue = parseFloat(currentValue.replace('mm', ''))
                return Math.round(mmValue * 3.78)
            } else {
                // Try to parse as number (for unitless values)
                return parseInt(currentValue) || 0
            }
        }

        throw new Error(`CSS Variable ${variable} not found`)
    }, [])
}
