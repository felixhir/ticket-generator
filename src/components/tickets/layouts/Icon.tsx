'use client'

import type { Layout } from '@/lib/domain/design'

import LayoutVariantThumbnail from './LayoutVariantThumbnail'

export default function LayoutIcon({ layout }: { layout: Layout }) {
    return <LayoutVariantThumbnail layout={layout} />
}
