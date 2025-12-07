import { Layout } from '@/app/contexts/DesignContext'

import Ticket from '../ticket/Ticket'

interface LayoutIconProps {
    layout: Layout
    scale: number
}

export default function LayoutIcon({ layout, scale }: LayoutIconProps) {
    return (
        <div className='w-[100px] h-[100px] overflow-hidden text-left'>
            <div className={`scale-${scale} origin-top-left`}>
                <Ticket layout={layout} />
            </div>
        </div>
    )
}
