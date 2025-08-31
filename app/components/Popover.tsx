interface PopoverProps {
    isOpen: boolean
    children: React.ReactNode
    ref?: React.RefObject<HTMLDivElement | null>
}

export default function Popover({ isOpen, children, ref }: PopoverProps) {
    if (!isOpen) return null
    return (
        <div className='absolute left-0 border-r-8 shadow-sm bottom-[calc(100%+2px)]' ref={ref}>
            {children}
        </div>
    )
}
