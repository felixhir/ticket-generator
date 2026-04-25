'use client'

import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'
import JSZip from 'jszip'
import { Download, Printer } from 'lucide-react'
import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useDesign } from '@/components/studio/providers/DesignContext'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { buildA4PackPlan } from '@/lib/ticket/packA4'
import { renderA4PackToPngDataUrls } from '@/lib/ticket/renderA4Page'
import { ticketOuterSizeMm } from '@/lib/ticket/ticketSizeMm'

const MIN_COUNT = 1
const MAX_COUNT = 99

type ExportMode = 'pdf' | 'png'
type PrintJob = { pageDataUrls: string[] }

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.append(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}

function loadImageSize(dataUrl: string): Promise<{ w: number; h: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.addEventListener('load', () => {
            resolve({ w: img.naturalWidth, h: img.naturalHeight })
        })
        img.addEventListener('error', () => {
            reject(new Error('image'))
        })
        img.src = dataUrl
    })
}

export default function PrintoutDialog({
    open,
    onOpenChange,
    fileBaseName
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    fileBaseName: string
}) {
    const { t } = useTranslation()
    const { design } = useDesign()
    const [ticketCount, setTicketCount] = useState(String(MIN_COUNT))
    const [exportMode, setExportMode] = useState<ExportMode>('pdf')
    const [exportError, setExportError] = useState<string | null>(null)
    const [isWorking, setIsWorking] = useState(false)
    const [printJob, setPrintJob] = useState<PrintJob | null>(null)
    const [portalReady, setPortalReady] = useState(false)
    const formId = useId()

    useEffect(() => {
        setPortalReady(true)
    }, [])

    useEffect(() => {
        if (!open) {
            setExportError(null)
            setTicketCount(String(MIN_COUNT))
            setExportMode('pdf')
        }
    }, [open])

    useEffect(() => {
        const onAfterPrint = () => {
            document.documentElement.removeAttribute('data-printout')
            setPrintJob(null)
        }
        window.addEventListener('afterprint', onAfterPrint)
        return () => window.removeEventListener('afterprint', onAfterPrint)
    }, [])

    const getResolvedCount = useCallback(() => {
        const parsed = Number.parseInt(ticketCount, 10)
        return Math.min(MAX_COUNT, Math.max(MIN_COUNT, Number.isNaN(parsed) ? MIN_COUNT : parsed))
    }, [ticketCount])

    const buildA4PagePngs = useCallback(
        async (el: HTMLElement, totalTickets: number) => {
            const { wMm, hMm } = ticketOuterSizeMm(design.layout, design.dimensions)
            const dataUrl = await toPng(el, { cacheBust: true, pixelRatio: 3 })
            const { w, h } = await loadImageSize(dataUrl)
            const plans = buildA4PackPlan(totalTickets, wMm, hMm)
            return renderA4PackToPngDataUrls(dataUrl, w, h, plans)
        },
        [design.layout, design.dimensions]
    )

    const runPdf = useCallback(async () => {
        const el = document.querySelector<HTMLElement>('#preview-ticket')
        if (!el) {
            setExportError(t('ticketDetail.printoutNoPreview'))
            return
        }
        const n = getResolvedCount()
        setTicketCount(String(n))
        setIsWorking(true)
        setExportError(null)
        try {
            const pagePngs = await buildA4PagePngs(el, n)
            const pdf = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
            for (let i = 0; i < pagePngs.length; i += 1) {
                if (i > 0) {
                    pdf.addPage()
                }
                pdf.addImage(pagePngs[i]!, 'PNG', 0, 0, 210, 297, undefined, 'FAST')
            }
            pdf.save(`${fileBaseName}.pdf`)
        } catch (error) {
            console.error(error)
            setExportError(t('ticketDetail.printoutCaptureFailed'))
        } finally {
            setIsWorking(false)
        }
    }, [buildA4PagePngs, fileBaseName, getResolvedCount, t])

    const runPng = useCallback(async () => {
        const el = document.querySelector<HTMLElement>('#preview-ticket')
        if (!el) {
            setExportError(t('ticketDetail.printoutNoPreview'))
            return
        }
        const n = getResolvedCount()
        setTicketCount(String(n))
        setIsWorking(true)
        setExportError(null)
        try {
            const pagePngs = await buildA4PagePngs(el, n)
            if (pagePngs.length === 1) {
                const res = await fetch(pagePngs[0]!)
                const blob = await res.blob()
                downloadBlob(blob, `${fileBaseName}.png`)
            } else {
                const zip = new JSZip()
                for (let p = 0; p < pagePngs.length; p += 1) {
                    const url = pagePngs[p]!
                    const base64 = url.includes('base64,') ? (url.split('base64,')[1] ?? '') : url
                    if (!base64) {
                        throw new Error('png data')
                    }
                    const index = p + 1
                    const padded = index < 10 ? `0${String(index)}` : String(index)
                    zip.file(`${fileBaseName}-a4-${padded}.png`, base64, { base64: true })
                }
                const blob = await zip.generateAsync({ type: 'blob' })
                downloadBlob(blob, `${fileBaseName}-a4.zip`)
            }
        } catch (error) {
            console.error(error)
            setExportError(t('ticketDetail.printoutCaptureFailed'))
        } finally {
            setIsWorking(false)
        }
    }, [buildA4PagePngs, fileBaseName, getResolvedCount, t])

    const runPrint = useCallback(async () => {
        const el = document.querySelector<HTMLElement>('#preview-ticket')
        if (!el) {
            setExportError(t('ticketDetail.printoutNoPreview'))
            return
        }
        const n = getResolvedCount()
        setTicketCount(String(n))
        setIsWorking(true)
        setExportError(null)
        try {
            const pagePngs = await buildA4PagePngs(el, n)
            flushSync(() => {
                setPrintJob({ pageDataUrls: pagePngs })
            })
            requestAnimationFrame(() => {
                document.documentElement.setAttribute('data-printout', '1')
                window.print()
            })
        } catch (error) {
            console.error(error)
            setExportError(t('ticketDetail.printoutCaptureFailed'))
        } finally {
            setIsWorking(false)
        }
    }, [buildA4PagePngs, getResolvedCount, t])

    const onDownload = useCallback(() => {
        if (exportMode === 'pdf') {
            void runPdf()
            return
        }
        void runPng()
    }, [exportMode, runPdf, runPng])

    const printoutNode = (
        <div id='printout-root' className='hidden print:block' aria-hidden>
            {printJob?.pageDataUrls.map((url, index) => (
                <div key={`printout-page-${String(index)}`} className='printout-a4-page'>
                    <img src={url} alt='' className='max-h-full max-w-full object-contain' />
                </div>
            ))}
        </div>
    )

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent size='lg' className='max-h-[min(90dvh,36rem)] gap-0 p-0'>
                    <div className='flex min-h-0 max-h-full flex-1 flex-col overflow-hidden'>
                        <DialogHeader className='shrink-0 border-b border-border px-app-section pb-app-section pt-app-frame'>
                            <DialogTitle>{t('ticketDetail.printoutTitle')}</DialogTitle>
                            <DialogDescription>{t('ticketDetail.printoutDescription')}</DialogDescription>
                        </DialogHeader>
                        <div className='min-h-0 flex-1 overflow-y-auto p-app-section'>
                            <div className='flex min-h-0 flex-col gap-app-section' id={formId}>
                                <div className='grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-app-section sm:gap-y-2'>
                                    <p
                                        className='order-1 text-app-small font-medium leading-none text-app-text-primary sm:order-none'
                                        id={`${formId}-format`}
                                    >
                                        {t('ticketDetail.printoutFormat')}
                                    </p>
                                    <FieldLabel
                                        className='order-3 w-full max-w-xs text-app-text-primary sm:order-none sm:max-w-none'
                                        htmlFor='printout-ticket-count'
                                    >
                                        {t('ticketDetail.printoutCount')}
                                    </FieldLabel>
                                    <div className='order-2 min-w-0 sm:order-none sm:max-w-sm'>
                                        <Tabs
                                            value={exportMode}
                                            onValueChange={v => setExportMode(v as ExportMode)}
                                            aria-labelledby={`${formId}-format`}
                                        >
                                            <TabsList className='grid w-full grid-cols-2' variant='default'>
                                                <TabsTrigger className='text-app-caption' value='pdf'>
                                                    {t('ticketDetail.printoutTabPdf')}
                                                </TabsTrigger>
                                                <TabsTrigger className='text-app-caption' value='png'>
                                                    {t('ticketDetail.printoutTabPng')}
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>
                                    <Input
                                        className='order-4 h-app-nav-control w-full max-w-xs sm:order-none sm:max-w-none'
                                        id='printout-ticket-count'
                                        type='number'
                                        min={MIN_COUNT}
                                        max={MAX_COUNT}
                                        value={ticketCount}
                                        onChange={e => {
                                            setTicketCount(e.target.value)
                                        }}
                                        onBlur={() => {
                                            const v = Number.parseInt(ticketCount, 10)
                                            if (Number.isNaN(v) || v < MIN_COUNT) {
                                                setTicketCount(String(MIN_COUNT))
                                                return
                                            }
                                            setTicketCount(String(Math.min(MAX_COUNT, v)))
                                        }}
                                    />
                                </div>
                                {exportError && (
                                    <p className='text-app-small text-app-danger' role='status'>
                                        {exportError}
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter className='shrink-0 flex-wrap gap-1.5 border-t border-border bg-muted/30 px-app-section py-2.5 sm:px-app-section sm:py-2'>
                            <DialogClose type='button'>{t('ticketDetail.printoutClose')}</DialogClose>
                            {exportMode === 'pdf' && (
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => void runPrint()}
                                    disabled={isWorking}
                                >
                                    <Printer className='size-4' aria-hidden />
                                    {t('ticketDetail.printoutPrint')}
                                </Button>
                            )}
                            <Button type='button' onClick={onDownload} disabled={isWorking}>
                                <Download className='size-4' aria-hidden />
                                {t('ticketDetail.printoutDownload')}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
            {portalReady ? createPortal(printoutNode, document.body) : null}
        </>
    )
}
