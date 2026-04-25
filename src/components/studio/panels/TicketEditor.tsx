'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTicket } from '@/components/studio/providers/TicketContext'
import { SectionHeader } from '@/components/ui/app-primitives'
import { Card } from '@/components/ui/card'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    formatTicketPriceAmount,
    getCurrencyCode,
    parseTicketPriceInput,
    supportedCurrencies
} from '@/lib/domain/currency'
import { cn } from '@/lib/utils'

export default function TicketEditor({
    variant = 'card',
    stackGap = 'card'
}: {
    variant?: 'card' | 'plain'
    stackGap?: 'card' | 'section'
}) {
    const { i18n, t } = useTranslation()
    const { data, setData } = useTicket()
    const language = i18n.resolvedLanguage ?? i18n.language
    const [priceText, setPriceText] = useState(() => formatTicketPriceAmount(data.price, language))

    // biome-ignore lint/correctness/useExhaustiveDependencies: `language` only — listing `data.price` would clobber the field while the user types (see `onChange` → `setData`)
    useEffect(() => {
        setPriceText(formatTicketPriceAmount(data.price, language))
    }, [language])
    const rowGap = stackGap === 'section' ? 'gap-app-section' : 'gap-app-card'
    const form = (
        <div className={cn('grid', rowGap)}>
            <Field>
                <FieldLabel htmlFor='ticket-title'>{t('content.title')}</FieldLabel>
                <Input
                    id='ticket-title'
                    type='text'
                    placeholder={t('content.placeholders.title')}
                    value={data.title}
                    onChange={event => setData({ title: event.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor='ticket-subtitle'>{t('content.subtitle')}</FieldLabel>
                <Input
                    id='ticket-subtitle'
                    type='text'
                    placeholder={t('content.placeholders.subtitle')}
                    value={data.subtitle}
                    onChange={event => setData({ subtitle: event.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor='ticket-venue'>{t('content.venue')}</FieldLabel>
                <Input
                    id='ticket-venue'
                    type='text'
                    placeholder={t('content.placeholders.venue')}
                    value={data.venue}
                    onChange={event => setData({ venue: event.target.value })}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor='ticket-address'>{t('content.address')}</FieldLabel>
                <Textarea
                    id='ticket-address'
                    rows={3}
                    placeholder={t('content.placeholders.address')}
                    value={data.address}
                    onChange={event => setData({ address: event.target.value })}
                />
            </Field>
            <div className={cn('grid md:grid-cols-2', rowGap)}>
                <Field>
                    <FieldLabel htmlFor='ticket-date-time'>{t('content.dateTime')}</FieldLabel>
                    <DateTimePicker
                        id='ticket-date-time'
                        language={language}
                        placeholder={t('content.placeholders.dateTime')}
                        timeLabel={t('content.time')}
                        value={data.datetime}
                        onChange={(date: Date | null) => setData({ datetime: date })}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor='ticket-area'>{t('content.area')}</FieldLabel>
                    <Input
                        id='ticket-area'
                        type='text'
                        placeholder={t('content.placeholders.area')}
                        value={data.seatType}
                        onChange={event => setData({ seatType: event.target.value })}
                    />
                </Field>
            </div>
            <div className={cn('grid md:grid-cols-2', rowGap)}>
                <Field>
                    <FieldLabel htmlFor='ticket-price'>{t('content.price')}</FieldLabel>
                    <Input
                        id='ticket-price'
                        type='text'
                        inputMode='decimal'
                        autoComplete='off'
                        placeholder={t('content.placeholders.price')}
                        value={priceText}
                        onChange={event => {
                            const next = event.target.value
                            setPriceText(next)
                            setData({ price: parseTicketPriceInput(next) })
                        }}
                        onBlur={() => {
                            const n = parseTicketPriceInput(priceText)
                            setData({ price: n })
                            setPriceText(formatTicketPriceAmount(n, language))
                        }}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor='ticket-currency'>{t('content.currency')}</FieldLabel>
                    <Select value={String(data.currency)} onValueChange={value => setData({ currency: Number(value) })}>
                        <SelectTrigger id='ticket-currency' className='w-full'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {supportedCurrencies.map(currencyValue => (
                                <SelectItem key={currencyValue} value={String(currencyValue)}>
                                    {getCurrencyCode(currencyValue)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>
            <Field>
                <FieldLabel htmlFor='ticket-barcode'>{t('content.barcode')}</FieldLabel>
                <Input
                    id='ticket-barcode'
                    type='text'
                    placeholder={t('content.placeholders.barcode')}
                    value={data.barcode}
                    onChange={event => setData({ barcode: event.target.value })}
                />
            </Field>
        </div>
    )

    if (variant === 'plain') return form

    return (
        <Card className='p-app-section'>
            <SectionHeader className='mb-app-section' eyebrow={t('content.section')} title={t('content.heading')} />
            {form}
        </Card>
    )
}
