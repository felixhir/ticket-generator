import { Trash, Upload } from 'lucide-react'

import { useEffect } from 'react'
import { HexColorInput } from 'react-colorful'

import { defaultBgColor, useTicket } from '../../TicketContext'
import { extractAverageColor } from '../../functions/extractAverageColor'
import PopoverColorPicker from '../shared/PopoverColorPicker'

export default function SidebarStylingSection() {
    const { data, setData } = useTicket()

    useEffect(() => {
        if (!data.background) {
            setData({ bgColor: defaultBgColor })
            return
        }

        const img = new Image()
        img.src = data.background
        img.onload = () => {
            const color = extractAverageColor(img)
            setData({ bgColor: color })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.background])

    return (
        <div className='space-y-2'>
            <div>
                <label>Background</label>
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
                        <Trash
                            color={!data.background ? 'gray' : 'red'}
                            onClick={() => setData({ background: null })}
                        ></Trash>
                    </button>
                    <PopoverColorPicker
                        color={data.bgColor}
                        onChange={(e: string) => setData({ bgColor: e })}
                    ></PopoverColorPicker>
                    <HexColorInput
                        color={data.bgColor}
                        onChange={e => setData({ bgColor: e })}
                        className='p-1 border rounded w-[3cm]'
                    ></HexColorInput>
                </div>
            </div>
        </div>
    )
}
