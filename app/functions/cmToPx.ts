const INCH = 2.54 // cm
const DPI = 96 // pixels per inch

export const cmToPx = (cm: number) => (cm * DPI) / INCH
