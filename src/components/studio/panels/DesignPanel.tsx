'use client'

import { Trash2Icon, Upload } from 'lucide-react'
import type { ChangeEvent, ReactNode } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import PopoverColorPicker from '@/components/shared/PopoverColorPicker'
import { useDesign } from '@/components/studio/providers/DesignContext'
import LayoutIcon from '@/components/tickets/layouts/Icon'
import { SectionHeader } from '@/components/ui/app-primitives'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Layout } from '@/lib/domain/design'
import { BackgroundPattern } from '@/lib/domain/design'
import { cn } from '@/lib/utils'

export type DesignPanelSection = 'layout' | 'dimensions' | 'colors' | 'patternMedia'

const allDesignSections: DesignPanelSection[] = ['layout', 'dimensions', 'colors', 'patternMedia']

export default function DesignPanel({
    sections = allDesignSections,
    showHeader = true,
    showSectionTitles = true,
    className
}: {
    sections?: DesignPanelSection[]
    showHeader?: boolean
    showSectionTitles?: boolean
    className?: string
}) {
    const { t } = useTranslation()

    return (
        <Card className={cn('p-app-section', className)}>
            {showHeader && (
                <SectionHeader className='mb-app-section' eyebrow={t('design.section')} title={t('design.heading')} />
            )}
            <div className='grid gap-app-section'>
                {sections.includes('layout') && <LayoutSection showTitle={showSectionTitles} />}
                {sections.includes('dimensions') && <DimensionsSection showTitle={showSectionTitles} />}
                {sections.includes('colors') && <ColorsSection showTitle={showSectionTitles} />}
                {sections.includes('patternMedia') && <PatternMediaSection />}
            </div>
        </Card>
    )
}

function LayoutSection({ showTitle = true }: { showTitle?: boolean }) {
    const { t } = useTranslation()

    return (
        <section
            className='layout-options-section grid gap-app-card'
            {...(!showTitle ? { 'aria-label': t('design.layout') } : undefined)}
        >
            {showTitle && <h3 className='text-app-body text-app-text-primary'>{t('design.layout')}</h3>}
            <div className='layout-options-grid'>
                <LayoutOption layout='default' label={t('design.standard')} icon={<LayoutIcon layout='default' />} />
                <LayoutOption layout='picture' label={t('design.picture')} icon={<LayoutIcon layout='picture' />} />
                <LayoutOption layout='band' label={t('design.band')} icon={<LayoutIcon layout='band' />} />
            </div>
        </section>
    )
}

export function DimensionsSection({ showTitle = true }: { showTitle?: boolean }) {
    const { t } = useTranslation()
    const { design, setDesign } = useDesign()

    return (
        <section className='grid gap-app-card' {...(!showTitle ? { 'aria-label': t('design.dimensions') } : undefined)}>
            {showTitle && <h3 className='text-app-body text-app-text-primary'>{t('design.dimensions')}</h3>}
            <div className='grid gap-app-card md:grid-cols-2'>
                <Field>
                    <FieldLabel htmlFor='design-short-side'>{t('design.shortSide')}</FieldLabel>
                    <Input
                        id='design-short-side'
                        type='number'
                        value={design.dimensions.short}
                        onChange={event => {
                            const value = Number.parseFloat(event.target.value)
                            if (!Number.isNaN(value)) setDesign({ dimensions: { ...design.dimensions, short: value } })
                        }}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor='design-long-side'>{t('design.longSide')}</FieldLabel>
                    <Input
                        id='design-long-side'
                        type='number'
                        value={design.dimensions.long}
                        onChange={event => {
                            const value = Number.parseFloat(event.target.value)
                            if (!Number.isNaN(value)) setDesign({ dimensions: { ...design.dimensions, long: value } })
                        }}
                    />
                </Field>
            </div>
        </section>
    )
}

function ColorsSection({ showTitle = true }: { showTitle?: boolean }) {
    const { t } = useTranslation()

    return (
        <section className='grid gap-app-card' {...(!showTitle ? { 'aria-label': t('design.colors') } : undefined)}>
            {showTitle && <h3 className='text-app-body text-app-text-primary'>{t('design.colors')}</h3>}
            <ColorInput variable='--ticket-primary' label={t('design.primary')} />
            <ColorInput variable='--ticket-secondary' label={t('design.secondary')} />
            <ColorInput variable='--ticket-tertiary' label={t('design.tertiary')} />
            <ColorInput variable='--ticket-text-light' label={t('design.lightText')} />
            <ColorInput variable='--ticket-text-dark' label={t('design.darkText')} />
            <ColorInput variable='--ticket-background' label={t('design.background')} />
        </section>
    )
}

export function PatternMediaSection({ includeDimensions = false }: { includeDimensions?: boolean }) {
    const { t } = useTranslation()
    const { design, setDesign } = useDesign()

    return (
        <section className='grid gap-y-app-frame' aria-label={t('design.patternMedia')}>
            {includeDimensions && <DimensionsSection showTitle />}
            <div className='grid grid-cols-1 gap-x-app-section gap-y-app-section sm:grid-cols-2'>
                <Field>
                    <FieldLabel htmlFor='design-background-pattern'>{t('design.backgroundPattern')}</FieldLabel>
                    <Select
                        value={design.backgroundPattern}
                        onValueChange={value => setDesign({ backgroundPattern: value as BackgroundPattern })}
                    >
                        <SelectTrigger id='design-background-pattern' className='w-full'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(BackgroundPattern).map(pattern => (
                                <SelectItem key={pattern} value={pattern}>
                                    {t(`design.backgroundPatternOptions.${pattern}`)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field>
                    <FieldLabel htmlFor='design-pattern-size'>{t('design.patternSize')}</FieldLabel>
                    <Input
                        id='design-pattern-size'
                        type='range'
                        className='cursor-pointer p-0 accent-app-accent'
                        max={200}
                        min={10}
                        step={1}
                        onChange={event => document.documentElement.style.setProperty('--s', `${event.target.value}px`)}
                    />
                </Field>
            </div>
            <div className='grid grid-cols-1 gap-x-app-section gap-y-app-section sm:grid-cols-2 sm:items-center'>
                <div className='rounded-app-card border border-app-border p-app-card'>
                    <div className='grid gap-y-app-section'>
                        <ImageInput label={t('design.ticketImage')} propertyName='image' />
                        <ImageInput label={t('design.bandLogo')} propertyName='bandLogo' />
                    </div>
                </div>
                <Field>
                    <FieldLabel htmlFor='design-logo-size'>{t('design.logoSize')}</FieldLabel>
                    <Input
                        id='design-logo-size'
                        type='range'
                        className='cursor-pointer p-0 accent-app-accent'
                        max={2}
                        min={0.1}
                        step={0.01}
                        onChange={event =>
                            document.documentElement.style.setProperty('--logo-size', `${event.target.value}`)
                        }
                    />
                </Field>
            </div>
        </section>
    )
}

function LayoutOption({ icon, label, layout }: { icon: ReactNode; label: string; layout: Layout }) {
    const { t } = useTranslation()
    const { design, setDesign } = useDesign()
    const isActive = design.layout === layout

    return (
        <Button
            type='button'
            aria-label={t('design.layoutLabel', { label })}
            aria-pressed={isActive}
            variant={isActive ? 'secondary' : 'outline'}
            className={cn(
                'h-auto min-w-0 w-full flex-col overflow-hidden rounded-app-inner p-app-card',
                isActive
                    ? 'border-app-accent text-app-text-primary'
                    : 'text-app-text-secondary hover:text-app-text-primary'
            )}
            onClick={() => setDesign({ layout })}
        >
            <span
                className='mb-app-card flex w-full min-w-0 justify-center overflow-hidden rounded-app-inner'
                aria-hidden='true'
            >
                {icon}
            </span>
            {label}
        </Button>
    )
}

function ColorInput({ label, variable }: { label: string; variable: string }) {
    return (
        <div className='flex items-center justify-between gap-app-card'>
            <span className='text-app-small text-app-text-secondary'>{label}</span>
            <PopoverColorPicker variable={variable} />
        </div>
    )
}

function ImageInput({ label, propertyName }: { label: string; propertyName: 'image' | 'bandLogo' }) {
    const { t } = useTranslation()
    const { design, setDesign } = useDesign()
    const value = design[propertyName]

    const handleFileChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            if (!file) return

            const reader = new FileReader()
            reader.onload = readerEvent => {
                const result = readerEvent.target?.result
                if (typeof result === 'string') setDesign({ [propertyName]: result })
            }
            reader.readAsDataURL(file)
        },
        [propertyName, setDesign]
    )

    return (
        <div className='flex items-center justify-between gap-app-card'>
            <span className='text-app-small text-app-text-secondary'>{label}</span>
            <div className='flex gap-app-card'>
                <Button asChild variant='outline' size='icon' aria-label={t('design.uploadLabel', { label })}>
                    <label>
                        <input
                            type='file'
                            aria-label={t('design.uploadLabel', { label })}
                            accept='.jpeg,.png,.jpg'
                            className='sr-only'
                            onChange={event => {
                                handleFileChange(event)
                                event.currentTarget.value = ''
                            }}
                        />
                        <Upload className='size-4' />
                    </label>
                </Button>
                <Button
                    type='button'
                    aria-label={t('design.removeLabel', { label })}
                    variant='ghost'
                    size='icon'
                    disabled={!value}
                    onClick={() => setDesign({ [propertyName]: null })}
                >
                    <Trash2Icon className='size-4' />
                </Button>
            </div>
        </div>
    )
}
