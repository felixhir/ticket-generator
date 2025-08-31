import rgbHex from 'rgb-hex'

export function extractAverageColor(img: HTMLImageElement) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    canvas.width = 10
    canvas.height = 10
    ctx.drawImage(img, 0, 0, 10, 10)

    const data = ctx.getImageData(0, 0, 10, 10).data
    let r = 0,
        g = 0,
        b = 0

    for (let i = 0; i < data.length; i += 4) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
    }

    const pixelCount = data.length / 4
    r = Math.floor(r / pixelCount)
    g = Math.floor(g / pixelCount)
    b = Math.floor(b / pixelCount)

    return `#${rgbHex(r, g, b)}`
}
