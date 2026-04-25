'use client'

import { useCallback, useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useUpdateCSSVariable } from '@/lib/hooks/useUpdateCSSVariable'

interface PopoverPickerProps {
    variable: string
}

export default function PopoverColorPicker({ variable }: PopoverPickerProps) {
    const { t } = useTranslation()
    const [value, setValue] = useState('#FFFFFF')

    const updateCSSVariable = useUpdateCSSVariable(variable)

    useEffect(() => {
        const currentValue = getComputedStyle(document.documentElement).getPropertyValue(variable).trim()

        if (currentValue) {
            let colorValue = currentValue

            if (currentValue.startsWith('rgb')) {
                const rgbMatch = currentValue.match(/\d+/g)
                if (rgbMatch && rgbMatch.length >= 3) {
                    const r = parseInt(rgbMatch[0])
                    const g = parseInt(rgbMatch[1])
                    const b = parseInt(rgbMatch[2])
                    colorValue = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
                }
            }

            setTimeout(() => setValue(colorValue), 0)
        }
    }, [variable])

    const updateValue = useCallback(
        (color: string) => {
            updateCSSVariable(color)
            setValue(color)
        },
        [updateCSSVariable]
    )

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    aria-label={t('colorPicker.changeColor', { name: variable.replace('--', '').replaceAll('-', ' ') })}
                    className='rounded-app-card'
                    style={{ backgroundColor: value }}
                />
            </PopoverTrigger>
            <PopoverContent align='end' className='w-auto p-app-card'>
                <HexColorPicker color={value} onChange={updateValue} />
                <Input
                    type='text'
                    className='text-center'
                    value={value}
                    onChange={event => updateValue(event.target.value)}
                    maxLength={7}
                />
            </PopoverContent>
        </Popover>
    )
}
