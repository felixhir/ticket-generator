import { useCallback, useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

import useClickOutside from '../functions/useClickOutside'
import Popover from './Popover'

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

            <Popover isOpen={isOpen} ref={popover}>
                <HexColorPicker color={color} onChange={onChange} />
            </Popover>
        </div>
    )
}
