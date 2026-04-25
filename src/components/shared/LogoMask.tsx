'use client'

import { useEffect, useState } from 'react'

import { useDesign } from '@/components/studio/providers/DesignContext'

export default function LogoMask() {
    const { design, setDesign } = useDesign()

    const [normalizedLogo, setNormalizedLogo] = useState<string | null>(null)

    useEffect(() => {
        let isActive = true

        if (!design.bandLogo) {
            setNormalizedLogo(null)
            return
        }

        createMask(design.bandLogo)
            .then(mask => {
                if (!isActive) return
                setNormalizedLogo(mask.url)
                setDesign({ logoDimensions: { width: mask.width, height: mask.height } })
            })
            .catch(() => {
                if (!isActive) return
                setNormalizedLogo(null)
                setDesign({ logoDimensions: { width: 0, height: 0 } })
            })

        return () => {
            isActive = false
        }
    }, [design.bandLogo, setDesign])

    return (
        <>
            {normalizedLogo && (
                <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
                    <svg viewBox={`0 0 ${design.logoDimensions.width} ${design.logoDimensions.height}`}>
                        <defs>
                            <mask id='logoMask' maskUnits='userSpaceOnUse'>
                                <image
                                    href={normalizedLogo}
                                    width={design.logoDimensions.width}
                                    height={design.logoDimensions.height}
                                />
                            </mask>
                        </defs>
                    </svg>
                </div>
            )}
        </>
    )
}

async function createMask(srcImage: string) {
    // Load image
    const img = await fetch(srcImage)
        .then(response => {
            if (!response.ok) throw new Error(`Could not load logo image: ${response.status}`)
            return response.blob()
        })
        .then(blob => {
            if (!blob.type.startsWith('image/')) throw new Error('Logo source is not an image')
            return blob
        })
        .then(createImageBitmap)

    const width = img.width
    const height = img.height

    // Create canvas
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    // 1️⃣ Find max luminance and bounding box
    let maxLum = 0
    let minX = width,
        minY = height,
        maxX = 0,
        maxY = 0

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            // Simple luminance
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

            maxLum = Math.max(maxLum, lum)

            const threshold = 0.05
            if (lum > threshold) {
                if (x < minX) minX = x
                if (x > maxX) maxX = x
                if (y < minY) minY = y
                if (y > maxY) maxY = y
            }
        }
    }

    normalizeLuminance(data, maxLum, height, width)
    ctx.putImageData(imageData, 0, 0)

    // 3️⃣ Crop to bounding box
    const cropWidth = maxX - minX + 1
    const cropHeight = maxY - minY + 1

    const croppedCanvas = new OffscreenCanvas(cropWidth, cropHeight)

    const croppedCtx = croppedCanvas.getContext('2d')!
    croppedCtx.drawImage(canvas, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

    const blob = await croppedCanvas.convertToBlob()
    const url = await blobToDataUrl(blob)

    return { url, width: cropWidth, height: cropHeight }
}

function blobToDataUrl(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result)
                return
            }
            reject(new Error('Could not read logo mask data URL'))
        })
        reader.addEventListener('error', () => reject(reader.error ?? new Error('Could not read logo mask data URL')))
        reader.readAsDataURL(blob)
    })
}

function normalizeLuminance(data: ImageDataArray, maxLuminance: number, height: number, width: number) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]

            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            const alpha = Math.min(255, (lum / maxLuminance) * 255)

            data[i] = 255
            data[i + 1] = 255
            data[i + 2] = 255
            data[i + 3] = alpha
        }
    }
}
