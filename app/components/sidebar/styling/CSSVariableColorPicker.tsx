import PopoverColorPicker from '@/app/components/shared/PopoverColorPicker'

interface CSSVariableColorPickerProps {
    variable: string
    label: string
}

export default function CSSVariableColorPicker({ variable, label }: CSSVariableColorPickerProps) {
    return (
        <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-300'>{label}</label>
            <PopoverColorPicker variable={variable} />
        </div>
    )
}
