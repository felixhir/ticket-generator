import { useTicket } from '@/app/TicketContext'
import { extractAverageColor } from '@/app/functions/extractAverageColor'
import { useUpdateCSSVariable } from '@/app/functions/useUpdateCSSVariable'
import { Trash, Upload } from 'lucide-react'

import { useEffect } from 'react'

import PopoverColorPicker from '../../shared/PopoverColorPicker'

export default function TicketBackground() {
    const { data, setData } = useTicket()
    const updateCSSVariable = useUpdateCSSVariable('--ticket-bg-color')

    useEffect(() => {
        if (!data.background) {
            return
        }

        const img = new Image()
        img.src = data.background
        img.onload = () => {
            const color = extractAverageColor(img)
            updateCSSVariable(color)
        }
    }, [data.background, updateCSSVariable])

    return (
        <div className='flex w-full gap-2 items-center'>
            <input
                type='checkbox'
                checked={data.useBackground}
                onChange={e => setData({ useBackground: e.target.checked })}
            ></input>
            <div>
                <label className='block w-full p-1 text-center bg-gray-300 dark:bg-gray-600 rounded cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700'>
                    <input
                        type='file'
                        accept='.jpeg,.png,.jpg'
                        onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                                setData({ background: URL.createObjectURL(e.target.files[0]) })
                            }
                        }}
                        className='hidden'
                        id='background-upload'
                    />
                    <Upload />
                </label>
            </div>
            <button
                disabled={!data.background}
                className={`block p-1 text-center bg-gray-300 dark:bg-gray-600 rounded ${!!data.background ? 'cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-700' : ''}`}
            >
                <Trash color={!data.background ? 'gray' : 'red'} onClick={() => setData({ background: null })}></Trash>
            </button>
            <PopoverColorPicker variable='--ticket-bg-color'></PopoverColorPicker>
        </div>
    )
}
