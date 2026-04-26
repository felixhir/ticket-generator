'use client'

import { useDesign } from '@/components/studio/providers/DesignContext'
import useBandLogoMask from '@/lib/hooks/useBandLogoMask'

export default function LogoMask() {
    const { design } = useDesign()
    const normalizedLogo = useBandLogoMask()

    return (
        <>
            {normalizedLogo && (
                <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
                    <svg viewBox={`0 0 ${design.logoDimensions.width} ${design.logoDimensions.height}`}>
                        <defs>
                            <mask id='logoMask' maskUnits='userSpaceOnUse'>
                                <image
                                    href={normalizedLogo.url}
                                    width={design.logoDimensions.width}
                                    height={design.logoDimensions.height}
                                />
                            </mask>
                        </defs>
                    </svg>
                </div>
            )}
        </>
    )
}
