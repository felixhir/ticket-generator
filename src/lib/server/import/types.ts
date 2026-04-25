import type { currency } from '@/lib/domain/currency'

/** Serializable ticket fields returned by every import strategy. */
export type ImportedTicketData = {
    title: string
    subtitle: string
    venue: string
    address: string
    datetime: Date | null
    price: number
    currency: currency
    seatType: string
}

export type ImportContext = {
    importId: string
    url: URL
}

export type PageTextImportContext = ImportContext & {
    pageText: string
}

export type ImportProviderStrategy = {
    id: string
    preferUrlImport?: boolean
    matchesHost(hostname: string): boolean
    importFromUrl?(ctx: ImportContext): Promise<ImportedTicketData | null>
    importFromPageText?(ctx: PageTextImportContext): ImportedTicketData | null
    fallbackFromUrl?(url: URL): ImportedTicketData | null
}
