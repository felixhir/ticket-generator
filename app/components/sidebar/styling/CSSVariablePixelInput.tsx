import useGetCSSVariableValue from '@/app/functions/useGetCSSVariableValue'
import { useUpdateCSSVariable } from '@/app/functions/useUpdateCSSVariable'

import { useCallback, useMemo, useState } from 'react'

interface CSSVariablePixelInputProps {
    variable: string
    label: string
    min?: number
    max?: number
}

export default function CSSVariablePixelInput({ variable, label, min = 0, max = 1000 }: CSSVariablePixelInputProps) {
    const getCSSVariableValue = useGetCSSVariableValue()
    const updateCSSVariable = useUpdateCSSVariable(variable)

    const initialValue = useMemo(() => getCSSVariableValue(variable), [getCSSVariableValue, variable])
    const [value, setValue] = useState(initialValue)

    const updateValue = useCallback(
        (newValue: number) => {
            const clampedValue = Math.max(min, Math.min(max, newValue))
            setValue(clampedValue)
            updateCSSVariable(`${clampedValue}px`)
        },
        [updateCSSVariable, min, max]
    )

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const numericValue = parseInt(e.target.value) || 0
            updateValue(numericValue)
        },
        [updateValue]
    )

    return (
        <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-300'>{label}</label>
            <div className='flex items-center gap-2'>
                <input
                    type='number'
                    value={value}
                    onChange={handleInputChange}
                    min={min}
                    max={max}
                    className='w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <span className='text-sm text-gray-400'>px</span>
            </div>
        </div>
    )
}
