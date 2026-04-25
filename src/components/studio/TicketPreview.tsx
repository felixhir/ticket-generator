'use client'

import LogoMask from '@/components/shared/LogoMask'
import { useDesign } from '@/components/studio/providers/DesignContext'
import Ticket from '@/components/tickets/ticket/Ticket'

export default function TicketPreview() {
    const { design } = useDesign()

    return (
        <div id='print-wrapper'>
            <div id='preview-ticket' className='relative'>
                <LogoMask />
                <Ticket layout={design.layout} />
            </div>
        </div>
    )
}
