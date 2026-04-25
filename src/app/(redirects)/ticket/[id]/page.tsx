import { redirectToLocalizedPath } from '../../redirects'

export default async function RedirectTicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    await redirectToLocalizedPath(`/ticket/${id}`)
}
