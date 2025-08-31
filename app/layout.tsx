import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import 'react-datepicker/dist/react-datepicker.css'

import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '700']
})

export const metadata: Metadata = {
    title: 'Printed Event Nostalgia Information Sheets',
    description: 'Create personalized concert tickets as keepsakes'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang='en'>
            <body className={`${inter.className}`}>{children}</body>
        </html>
    )
}
