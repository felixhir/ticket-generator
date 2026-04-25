'use client'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'
import DatePicker, { type ReactDatePickerCustomHeaderProps } from 'react-datepicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface DateTimePickerProps {
    id: string
    language: string
    onChange: (date: Date | null) => void
    placeholder?: string
    timeLabel: string
    value: Date | null
}

const monthIndexes = Array.from({ length: 12 }, (_, index) => index)
const defaultTimeOption = '17:00'

function formatTimeListLabel(date: Date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function shouldUseDefaultTimeScroll(value: Date | null) {
    if (!value) return true
    return value.getHours() === 0 && value.getMinutes() === 0
}

function applyDateTimePickerPanelHeight() {
    const picker = document.querySelector<HTMLElement>('.app-date-time-picker')
    const monthContainer = picker?.querySelector<HTMLElement>('.react-datepicker__month-container')
    if (!picker || !monthContainer) return

    const fromOffset = monthContainer.offsetHeight
    const fromRect = Math.ceil(monthContainer.getBoundingClientRect().height)
    const height = Math.max(fromOffset, fromRect)
    if (height > 0) {
        picker.style.setProperty('--app-date-time-picker-panel-height', `${height}px`)
    }
}

function requestApplyDateTimePickerPanelHeight(onComplete?: () => void) {
    window.requestAnimationFrame(() => {
        applyDateTimePickerPanelHeight()
        onComplete?.()
    })
}

function useNarrowViewport() {
    const subscribe = React.useCallback((onStoreChange: () => void) => {
        const mq = window.matchMedia('(max-width: 640px)')
        mq.addEventListener('change', onStoreChange)
        return () => mq.removeEventListener('change', onStoreChange)
    }, [])

    return React.useSyncExternalStore(
        subscribe,
        () => window.matchMedia('(max-width: 640px)').matches,
        () => false
    )
}

export function DateTimePicker({ id, language, onChange, placeholder, timeLabel, value }: DateTimePickerProps) {
    const isNarrow = useNarrowViewport()
    const monthPanelObserverRef = React.useRef<ResizeObserver | null>(null)

    const stopMonthPanelHeightSync = React.useCallback(() => {
        monthPanelObserverRef.current?.disconnect()
        monthPanelObserverRef.current = null
    }, [])

    const startMonthPanelHeightSync = React.useCallback(() => {
        stopMonthPanelHeightSync()
        window.requestAnimationFrame(() => {
            const picker = document.querySelector<HTMLElement>('.app-date-time-picker')
            const monthContainer = picker?.querySelector<HTMLElement>('.react-datepicker__month-container')
            if (!picker || !monthContainer) return

            applyDateTimePickerPanelHeight()
            const observer = new ResizeObserver(() => {
                applyDateTimePickerPanelHeight()
            })
            observer.observe(monthContainer)
            monthPanelObserverRef.current = observer
            applyDateTimePickerPanelHeight()
        })
    }, [stopMonthPanelHeightSync])

    React.useEffect(() => () => stopMonthPanelHeightSync(), [stopMonthPanelHeightSync])

    const scrollTimeListToSelection = React.useCallback(() => {
        const align = () => {
            const timeList = document.querySelector<HTMLElement>('.app-date-time-picker .react-datepicker__time-list')
            if (!timeList || timeList.clientHeight === 0) return

            let target: HTMLElement | undefined

            if (value && !shouldUseDefaultTimeScroll(value)) {
                target = timeList.querySelector<HTMLElement>('.react-datepicker__time-list-item--selected') ?? undefined
                if (!target) {
                    const label = formatTimeListLabel(value)
                    target = Array.from(
                        timeList.querySelectorAll<HTMLElement>('.react-datepicker__time-list-item')
                    ).find(item => item.textContent?.trim() === label)
                }
            }

            if (!target) {
                target = Array.from(timeList.querySelectorAll<HTMLElement>('.react-datepicker__time-list-item')).find(
                    item => item.textContent?.trim() === defaultTimeOption
                )
            }

            if (!target) return

            const nextTop = target.offsetTop - timeList.clientHeight / 2 + target.clientHeight / 2
            timeList.scrollTop = Math.max(0, nextTop)
        }

        startMonthPanelHeightSync()
        window.requestAnimationFrame(() => {
            applyDateTimePickerPanelHeight()
            window.requestAnimationFrame(() => {
                applyDateTimePickerPanelHeight()
                window.requestAnimationFrame(() => {
                    align()
                    window.requestAnimationFrame(align)
                })
            })
        })
    }, [value, startMonthPanelHeightSync])

    const handleCalendarClose = React.useCallback(() => {
        stopMonthPanelHeightSync()
        document
            .querySelector<HTMLElement>('.app-date-time-picker')
            ?.style.removeProperty('--app-date-time-picker-panel-height')
    }, [stopMonthPanelHeightSync])

    const handleMonthChange = React.useCallback(() => {
        requestApplyDateTimePickerPanelHeight()
    }, [])

    return (
        <DatePicker
            id={id}
            selected={value}
            onChange={(date: Date | null) => onChange(date)}
            onCalendarOpen={scrollTimeListToSelection}
            onCalendarClose={handleCalendarClose}
            onMonthChange={handleMonthChange}
            placeholderText={placeholder}
            customInput={<DateTimePickerInput />}
            calendarClassName='app-date-time-picker'
            popperClassName='app-date-time-picker-popper'
            wrapperClassName='app-date-time-picker-wrapper'
            popperPlacement={isNarrow ? 'bottom' : 'bottom-start'}
            portalId='app-date-time-picker-portal'
            renderCustomHeader={props => <DatePickerHeader {...props} language={language} />}
            showTimeSelect
            timeFormat='HH:mm'
            timeCaption={timeLabel}
            timeIntervals={15}
            dateFormat='dd. MM. yyyy HH:mm'
        />
    )
}

const DateTimePickerInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
    ({ className, ...props }, ref) => <Input ref={ref} className={cn('h-app-nav-control', className)} {...props} />
)

DateTimePickerInput.displayName = 'DateTimePickerInput'

function DatePickerHeader({
    changeMonth,
    changeYear,
    date,
    decreaseMonth,
    increaseMonth,
    language,
    nextMonthButtonDisabled,
    prevMonthButtonDisabled
}: ReactDatePickerCustomHeaderProps & { language: string }) {
    const currentYear = new Date().getFullYear()
    const selectedYear = date.getFullYear()
    const years = React.useMemo(() => {
        const firstYear = Math.min(selectedYear, currentYear) - 80
        const lastYear = Math.max(selectedYear, currentYear) + 10

        return Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index)
    }, [currentYear, selectedYear])

    const monthFormatter = React.useMemo(() => new Intl.DateTimeFormat(language, { month: 'long' }), [language])

    return (
        <div className='flex flex-col gap-3 px-2 pt-3 sm:grid sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-rows-1 sm:items-center sm:gap-app-card sm:px-app-card sm:pt-app-card'>
            <Button
                type='button'
                variant='ghost'
                size='icon'
                className='hidden sm:col-start-1 sm:row-start-1 sm:flex sm:justify-self-start'
                aria-label='Previous month'
                disabled={prevMonthButtonDisabled}
                onClick={decreaseMonth}
            >
                <ChevronLeftIcon className='size-4' aria-hidden />
            </Button>
            <Button
                type='button'
                variant='ghost'
                size='icon'
                className='hidden sm:col-start-3 sm:row-start-1 sm:flex sm:justify-self-end'
                aria-label='Next month'
                disabled={nextMonthButtonDisabled}
                onClick={increaseMonth}
            >
                <ChevronRightIcon className='size-4' aria-hidden />
            </Button>
            <div className='flex min-w-0 w-full flex-col gap-2 sm:col-start-2 sm:row-start-1 sm:flex-row sm:items-center sm:justify-center sm:gap-app-card'>
                <Select
                    value={String(date.getMonth())}
                    onValueChange={value => {
                        changeMonth(Number(value))
                        requestApplyDateTimePickerPanelHeight()
                    }}
                >
                    <SelectTrigger
                        className='h-app-nav-control min-w-0 w-full rounded-app-control sm:min-w-36 sm:w-auto'
                        size='sm'
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align='center'>
                        {monthIndexes.map(monthIndex => (
                            <SelectItem key={monthIndex} value={String(monthIndex)}>
                                {monthFormatter.format(new Date(2024, monthIndex, 1))}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={String(selectedYear)}
                    onValueChange={value => {
                        changeYear(Number(value))
                        requestApplyDateTimePickerPanelHeight()
                    }}
                >
                    <SelectTrigger
                        className='h-app-nav-control min-w-0 w-full rounded-app-control sm:min-w-28 sm:w-auto'
                        size='sm'
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent align='center'>
                        {years.map(year => (
                            <SelectItem key={year} value={String(year)}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
