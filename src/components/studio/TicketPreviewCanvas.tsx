'use client'

import { Expand, Maximize2, Minus, Plus, X } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppSurface } from '@/components/ui/app-primitives'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import TicketPreview from './TicketPreview'

const MIN_ZOOM = 0.05
const MAX_ZOOM = 3
const MAX_VIEWPORT_HEIGHT_PX = 600

type PanState = { active: boolean; lastX: number; lastY: number }
type CanvasFitMode = 'view' | 'width'

export default function TicketPreviewCanvas({
    className,
    fitMode = 'view'
}: {
    className?: string
    fitMode?: CanvasFitMode
}) {
    const { t } = useTranslation()
    const containerRef = useRef<HTMLDivElement>(null)
    const viewportRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false)
    const [widthFitViewportHeight, setWidthFitViewportHeight] = useState<number | null>(null)
    const stateRef = useRef({ scale: 1, x: 0, y: 0 })
    const pan = useRef<PanState | null>(null)
    const shouldFitWidth = fitMode === 'width' && !isExpanded
    const lastRenderScaleRef = useRef(scale)
    lastRenderScaleRef.current = scale

    useLayoutEffect(() => {
        stateRef.current = { scale, x, y }
    }, [scale, x, y])

    const getPrintContentEl = useCallback((): HTMLElement | null => {
        return containerRef.current?.querySelector<HTMLElement>('#print-wrapper') ?? null
    }, [])

    const fitToView = useCallback((): boolean => {
        const vp = viewportRef.current
        const content = getPrintContentEl()
        if (!vp || !content) return false
        setWidthFitViewportHeight(null)
        const w = content.offsetWidth
        const h = content.offsetHeight
        if (w < 1 || h < 1) return false
        const vw = vp.clientWidth
        const vh = vp.clientHeight
        if (vw < 1 || vh < 1) return false
        const margin = 0.92
        const s = Math.min((vw * margin) / w, (vh * margin) / h, 1)
        const nextX = (vw - w * s) / 2
        const nextY = (vh - h * s) / 2
        stateRef.current = { scale: s, x: nextX, y: nextY }
        setScale(s)
        setX(nextX)
        setY(nextY)
        return true
    }, [getPrintContentEl])

    const fitToWidth = useCallback((): boolean => {
        const vp = viewportRef.current
        const content = getPrintContentEl()
        if (!vp || !content) return false
        const w = content.offsetWidth
        const h = content.offsetHeight
        if (w < 1 || h < 1) return false
        const vw = vp.clientWidth
        if (vw < 1) return false
        const margin = 0.96
        const s = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (vw * margin) / w))
        const nextHeight = Math.min(MAX_VIEWPORT_HEIGHT_PX, Math.ceil(h * s))
        const nextX = (vw - w * s) / 2
        stateRef.current = { scale: s, x: nextX, y: 0 }
        setScale(s)
        setX(nextX)
        setY(0)
        setWidthFitViewportHeight(current => (current === nextHeight ? current : nextHeight))
        return true
    }, [getPrintContentEl])

    const fitForMode = useCallback((): boolean => {
        if (shouldFitWidth) {
            return fitToWidth()
        }
        return fitToView()
    }, [fitToView, fitToWidth, shouldFitWidth])

    const centerAtHundredPercent = useCallback(() => {
        const vp = viewportRef.current
        const content = getPrintContentEl()
        if (!vp || !content) return
        const w = content.offsetWidth
        const h = content.offsetHeight
        if (w < 1 || h < 1) return
        const vw = vp.clientWidth
        if (vw < 1) return
        const nx = (vw - w) / 2
        setScale(1)
        if (shouldFitWidth) {
            setY(0)
            const nextHeight = Math.min(MAX_VIEWPORT_HEIGHT_PX, Math.ceil(h))
            setWidthFitViewportHeight(c => (c === nextHeight ? c : nextHeight))
            stateRef.current = { scale: 1, x: nx, y: 0 }
            setX(nx)
        } else {
            const vh = vp.clientHeight
            if (vh < 1) return
            const ny = (vh - h) / 2
            stateRef.current = { scale: 1, x: nx, y: ny }
            setX(nx)
            setY(ny)
        }
    }, [getPrintContentEl, shouldFitWidth])

    const reframeAtCurrentScale = useCallback(() => {
        if (blockAutoFitRef.current) return
        const vp = viewportRef.current
        const content = getPrintContentEl()
        if (!vp || !content) return
        const w = content.offsetWidth
        const h = content.offsetHeight
        if (w < 1 || h < 1) return
        const vw = vp.clientWidth
        if (vw < 1) return
        const s = lastRenderScaleRef.current
        setX((vw - w * s) / 2)
        if (shouldFitWidth) {
            setY(0)
            const nextHeight = Math.min(MAX_VIEWPORT_HEIGHT_PX, Math.ceil(h * s))
            setWidthFitViewportHeight(c => (c === nextHeight ? c : nextHeight))
        } else {
            const vh = vp.clientHeight
            if (vh < 1) return
            setY((vh - h * s) / 2)
        }
    }, [getPrintContentEl, shouldFitWidth])

    const wasExpandedRef = useRef(false)
    const blockAutoFitRef = useRef(false)
    const initialFitRef = useRef(true)

    const syncCanvasLayout = useCallback(() => {
        requestAnimationFrame(() => {
            if (blockAutoFitRef.current) return
            if (initialFitRef.current) {
                if (fitForMode()) {
                    initialFitRef.current = false
                }
            } else {
                reframeAtCurrentScale()
            }
        })
    }, [fitForMode, reframeAtCurrentScale])

    useEffect(() => {
        if (isExpanded) {
            wasExpandedRef.current = true
            return
        }
        if (!wasExpandedRef.current) {
            return
        }
        wasExpandedRef.current = false
        blockAutoFitRef.current = true
        let cancelled = false
        const id = requestAnimationFrame(() => {
            if (cancelled) return
            requestAnimationFrame(() => {
                if (cancelled) return
                centerAtHundredPercent()
                requestAnimationFrame(() => {
                    blockAutoFitRef.current = false
                })
            })
        })
        return () => {
            cancelled = true
            blockAutoFitRef.current = false
            cancelAnimationFrame(id)
        }
    }, [centerAtHundredPercent, isExpanded])

    useEffect(() => {
        const vp = viewportRef.current
        if (!vp) return

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            const { scale: sc, x: panX, y: panY } = stateRef.current
            if (e.ctrlKey || e.metaKey) {
                const rect = vp.getBoundingClientRect()
                const mouseX = e.clientX - rect.left
                const mouseY = e.clientY - rect.top
                const factor = 1 - e.deltaY * 0.0012
                const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, sc * factor))
                if (newScale === sc) return
                const wx = (mouseX - panX) / sc
                const wy = (mouseY - panY) / sc
                setX(mouseX - wx * newScale)
                setY(mouseY - wy * newScale)
                setScale(newScale)
                return
            }
            setX(a => a - e.deltaX)
            setY(a => a - e.deltaY)
        }

        vp.addEventListener('wheel', onWheel, { passive: false })
        return () => vp.removeEventListener('wheel', onWheel)
    }, [])

    useEffect(() => {
        if (!isExpanded) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [isExpanded])

    useEffect(() => {
        if (!isExpanded) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                setIsExpanded(false)
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isExpanded])

    useEffect(() => {
        const id = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                syncCanvasLayout()
            })
        })
        return () => cancelAnimationFrame(id)
    }, [syncCanvasLayout])

    useEffect(() => {
        if (!isExpanded) return
        const id = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (blockAutoFitRef.current) return
                centerAtHundredPercent()
            })
        })
        return () => cancelAnimationFrame(id)
    }, [isExpanded, centerAtHundredPercent])

    useEffect(() => {
        let ro: ResizeObserver | undefined
        let cancelled = false
        const attach = () => {
            if (cancelled) return
            const el = getPrintContentEl()
            if (!el) {
                requestAnimationFrame(attach)
                return
            }
            ro = new ResizeObserver(() => {
                syncCanvasLayout()
            })
            ro.observe(el)
        }
        const raf = requestAnimationFrame(attach)
        return () => {
            cancelled = true
            cancelAnimationFrame(raf)
            ro?.disconnect()
        }
    }, [getPrintContentEl, syncCanvasLayout])

    useEffect(() => {
        const vp = viewportRef.current
        if (!vp) return
        const ro = new ResizeObserver(() => {
            syncCanvasLayout()
        })
        ro.observe(vp)
        return () => ro.disconnect()
    }, [syncCanvasLayout])

    useEffect(() => {
        window.addEventListener('resize', syncCanvasLayout)
        return () => window.removeEventListener('resize', syncCanvasLayout)
    }, [syncCanvasLayout])

    const zoomIn = useCallback(() => {
        setScale(s => Math.min(MAX_ZOOM, s * 1.15))
    }, [])

    const zoomOut = useCallback(() => {
        setScale(s => Math.max(MIN_ZOOM, s / 1.15))
    }, [])

    function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (e.button !== 0) return
        e.preventDefault()
        e.currentTarget.setPointerCapture(e.pointerId)
        pan.current = { active: true, lastX: e.clientX, lastY: e.clientY }
    }

    function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!pan.current?.active) return
        e.preventDefault()
        const dx = e.clientX - pan.current.lastX
        const dy = e.clientY - pan.current.lastY
        pan.current.lastX = e.clientX
        pan.current.lastY = e.clientY
        setX(p => p + dx)
        setY(p => p + dy)
    }

    function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (pan.current?.active) {
            try {
                e.currentTarget.releasePointerCapture(e.pointerId)
            } catch {}
        }
        pan.current = null
    }

    const panel = (
        <div
            ref={containerRef}
            className={cn(
                'relative flex min-h-0 min-w-0 flex-col overflow-hidden bg-transparent',
                shouldFitWidth ? 'w-full flex-none' : 'flex-1',
                isExpanded &&
                    'fixed inset-4 z-50 flex-col bg-app-surface p-0 shadow-app-overlay print:static print:max-h-none',
                isExpanded && 'rounded-app-card border border-app-border',
                className
            )}
        >
            {isExpanded && (
                <Button
                    type='button'
                    size='icon-sm'
                    variant='ghost'
                    className='print:hidden absolute top-app-card right-app-card z-20 text-app-text-secondary hover:bg-app-surface-elevated'
                    onClick={() => setIsExpanded(false)}
                    aria-label={t('ticketPreview.closeExpanded')}
                >
                    <X className='size-4' aria-hidden />
                </Button>
            )}
            <div
                ref={viewportRef}
                role='application'
                aria-label={t('ticketPreview.canvas')}
                className={cn(
                    'ticket-preview-viewport relative min-h-0 min-w-0 w-full cursor-grab touch-none overflow-hidden print:min-h-0 print:overflow-visible print:max-h-none active:cursor-grabbing',
                    !isExpanded && 'max-h-app-preview-max',
                    shouldFitWidth ? 'flex-none' : 'flex-1'
                )}
                style={shouldFitWidth && widthFitViewportHeight ? { height: widthFitViewportHeight } : undefined}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                <div
                    className='ticket-preview-canvas-layer w-max will-change-transform print:transform-none!'
                    style={{
                        transform: `translate(${x}px, ${y}px) scale(${scale})`,
                        transformOrigin: '0 0'
                    }}
                >
                    <TicketPreview />
                </div>
            </div>
            <div className='print:hidden flex min-h-0 shrink-0 items-center justify-between gap-app-card border-t border-app-border px-app-section pb-app-card pt-app-card sm:flex-nowrap'>
                <div className='flex min-w-0 justify-start'>
                    <Button
                        type='button'
                        size='sm'
                        variant='outline'
                        className='gap-1.5'
                        onClick={() => {
                            if (fitForMode()) {
                                initialFitRef.current = false
                            }
                        }}
                    >
                        <Expand className='size-3.5' aria-hidden />
                        {t('ticketPreview.fit')}
                    </Button>
                </div>
                <div className='flex min-w-0 shrink-0 items-center justify-end gap-app-card text-app-small text-app-text-secondary'>
                    <AppSurface
                        variant='transparent'
                        padding='none'
                        className='flex items-center gap-0.5 rounded-app-card p-0.5'
                    >
                        <Button
                            type='button'
                            size='icon-sm'
                            variant='ghost'
                            onClick={zoomOut}
                            aria-label={t('ticketPreview.zoomOut')}
                        >
                            <Minus className='size-4' aria-hidden />
                        </Button>
                        <span className='min-w-13 text-center text-app-text-primary tabular-nums'>
                            {Math.round(scale * 100)}%
                        </span>
                        <Button
                            type='button'
                            size='icon-sm'
                            variant='ghost'
                            onClick={zoomIn}
                            aria-label={t('ticketPreview.zoomIn')}
                        >
                            <Plus className='size-4' aria-hidden />
                        </Button>
                    </AppSurface>
                    {!isExpanded && (
                        <Button
                            type='button'
                            size='icon-sm'
                            variant='ghost'
                            className='text-app-text-secondary'
                            onClick={() => setIsExpanded(true)}
                            aria-label={t('ticketPreview.openExpanded')}
                        >
                            <Maximize2 className='size-4' aria-hidden />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <>
            {isExpanded && (
                <div className='fixed inset-0 z-40 print:hidden' data-expanded-backdrop>
                    <Button
                        type='button'
                        variant='ghost'
                        className='absolute inset-0 h-full w-full cursor-default rounded-none border-0 bg-app-background/75 p-0 hover:bg-app-background/75'
                        aria-label={t('ticketPreview.closeExpanded')}
                        onClick={() => setIsExpanded(false)}
                    />
                </div>
            )}
            {panel}
        </>
    )
}
