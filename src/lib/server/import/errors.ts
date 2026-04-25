export abstract class ImportError extends Error {
    readonly status: number = 400
    abstract readonly code: string
}

export class ImportLinkNotFoundError extends ImportError {
    readonly code = 'link_not_found' as const

    constructor(message = 'This link is invalid or may have expired.') {
        super(message)
        this.name = 'ImportLinkNotFoundError'
    }
}

export class ImportProviderUnsupportedError extends ImportError {
    readonly code = 'provider_unsupported' as const

    constructor(message = 'This ticket provider is not supported yet.') {
        super(message)
        this.name = 'ImportProviderUnsupportedError'
    }
}

export class ImportPageFetchError extends ImportError {
    readonly code = 'page_fetch_failed' as const

    constructor(message = 'Could not load this page. Please try again later.') {
        super(message)
        this.name = 'ImportPageFetchError'
    }
}

export class ImportNoEventDataError extends ImportError {
    readonly code = 'no_event_data' as const

    constructor(message = 'No event data could be read from this page.') {
        super(message)
        this.name = 'ImportNoEventDataError'
    }
}

export class ImportVerificationError extends ImportError {
    override readonly status = 403
    readonly code = 'verification_failed' as const

    constructor(message = 'Could not verify this import request.') {
        super(message)
        this.name = 'ImportVerificationError'
    }
}
