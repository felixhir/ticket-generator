import { useCallback, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

import useClickOutside from '../../functions/useClickOutside'

interface PopoverPickerProps {
    color: string
    onChange: (color: string) => void
}

export default function PopoverColorPicker({ color, onChange }: PopoverPickerProps) {
    const popover = useRef(null)
    const [isOpen, setIsOpen] = useState(false)

    const close = useCallback(() => setIsOpen(false), [setIsOpen])
    const toggle = useCallback(() => setIsOpen(value => !value), [setIsOpen])

    useClickOutside(popover, close)

    return (
        <div className='relative'>
            <div
                className='size-8 border-2 border-white rounded-lg shadow-sm cursor-pointer'
                style={{ backgroundColor: isOpen ? 'transparent' : color }}
                onClick={() => toggle()}
            />
            {isOpen && (
                <div className='absolute left-0 border-r-8 shadow-sm bottom-[calc(100%+2px)]' ref={popover}>
                    <HexColorPicker color={color} onChange={onChange} />
                </div>
            )}
        </div>
    )
}
