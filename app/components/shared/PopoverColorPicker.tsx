import { useUpdateCSSVariable } from '@/app/functions/useUpdateCSSVariable'

import { useCallback, useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

import useClickOutside from '../../functions/useClickOutside'

interface PopoverPickerProps {
    variable: string
}

export default function PopoverColorPicker({ variable }: PopoverPickerProps) {
    const popover = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState('#FFFFFF')

    const updateCSSVariable = useUpdateCSSVariable(variable)

    // Read the current CSS variable value from the DOM on mount
    useEffect(() => {
        const currentValue = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()

        if (currentValue) {
            // Handle different color formats (hex, rgb, etc.)
            let colorValue = currentValue

            // Convert rgb/rgba to hex if needed
            if (currentValue.startsWith('rgb')) {
                const rgbMatch = currentValue.match(/\d+/g)
                if (rgbMatch && rgbMatch.length >= 3) {
                    const r = parseInt(rgbMatch[0])
                    const g = parseInt(rgbMatch[1])
                    const b = parseInt(rgbMatch[2])
                    colorValue = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
                }
            }

            setValue(colorValue)
        }
    }, [variable])

    const close = useCallback(() => setIsOpen(false), [setIsOpen])
    const toggle = useCallback(() => setIsOpen(value => !value), [setIsOpen])
    const updateValue = useCallback(
        (color: string) => {
            updateCSSVariable(color)
            setValue(color)
        },
        [updateCSSVariable, setValue]
    )

    useClickOutside(popover, close)

    return (
        <div className='relative'>
            <div
                className='size-8 border-2 border-white rounded-lg shadow-sm cursor-pointer'
                style={{ backgroundColor: isOpen ? 'transparent' : value }}
                onClick={() => toggle()}
            />
            {isOpen && (
                <div className='absolute right-0 border-r-8 shadow-sm bottom-[calc(100%+2px)]' ref={popover}>
                    <HexColorPicker color={value} onChange={updateValue} />
                </div>
            )}
        </div>
    )
}
