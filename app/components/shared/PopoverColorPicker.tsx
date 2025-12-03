import { useUpdateCSSVariable } from '@/app/functions/useUpdateCSSVariable'

import { useCallback, useEffect, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

import useClickOutside from '../../functions/useClickOutside'

interface PopoverPosition {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'right'
}

interface PopoverPickerProps {
    variable: string
}

export default function PopoverColorPicker({ variable }: PopoverPickerProps) {
    const popover = useRef<HTMLDivElement>(null)
    const trigger = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState('#FFFFFF')
    const [position, setPosition] = useState<PopoverPosition>({ vertical: 'top', horizontal: 'right' })

    const updateCSSVariable = useUpdateCSSVariable(variable)

    // Calculate optimal position based on available viewport space
    const calculatePosition = useCallback((): PopoverPosition => {
        if (!trigger.current) return { vertical: 'top', horizontal: 'right' }

        const triggerRect = trigger.current.getBoundingClientRect()

        // Approximate color picker dimensions (react-colorful default size)
        const pickerWidth = 200
        const pickerHeight = 200
        const spacing = 8 // Gap between trigger and popover

        // Calculate available space in each direction
        const spaceAbove = triggerRect.top

        // For right positioning (right-0): popover's right edge aligns with trigger's right edge
        // So we need to check if the picker can fit when right-aligned
        const canFitRight = triggerRect.right >= pickerWidth // Can the picker fit when right-aligned?

        // Determine vertical position - prefer top if there's enough space, otherwise bottom
        const vertical: 'top' | 'bottom' = spaceAbove >= pickerHeight + spacing ? 'top' : 'bottom'

        // Determine horizontal position - prefer right if it fits, otherwise left
        const horizontal: 'left' | 'right' = canFitRight ? 'right' : 'left'

        return { vertical, horizontal }
    }, [])

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

            setTimeout(() => setValue(colorValue), 0)
        }
    }, [variable])

    const close = useCallback(() => setIsOpen(false), [setIsOpen])

    const toggle = useCallback(() => {
        setIsOpen(currentIsOpen => {
            if (!currentIsOpen) {
                // Calculate position when opening
                const newPosition = calculatePosition()
                setPosition(newPosition)
            }
            return !currentIsOpen
        })
    }, [calculatePosition])

    const updateValue = useCallback(
        (color: string) => {
            updateCSSVariable(color)
            setValue(color)
        },
        [updateCSSVariable, setValue]
    )

    useClickOutside(popover, close)

    // Recalculate position on window resize if popover is open
    useEffect(() => {
        if (!isOpen) return

        const handleResize = () => {
            const newPosition = calculatePosition()
            setPosition(newPosition)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isOpen, calculatePosition])

    const getPositionClasses = () => {
        const verticalClass = position.vertical === 'top' ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'
        const horizontalClass = position.horizontal === 'right' ? 'right-0' : 'left-0'
        return `absolute ${verticalClass} ${horizontalClass} z-50`
    }

    return (
        <div className='relative'>
            <div
                ref={trigger}
                className='size-8 border-2 border-white rounded-lg shadow-sm cursor-pointer'
                style={{ backgroundColor: value }}
                onClick={() => toggle()}
            />
            {isOpen && (
                <div
                    className={`${getPositionClasses()} border-2 border-gray-200 rounded-lg shadow-lg bg-white`}
                    ref={popover}
                >
                    <HexColorPicker color={value} onChange={updateValue} />
                </div>
            )}
        </div>
    )
}
