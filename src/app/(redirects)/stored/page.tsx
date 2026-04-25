import { redirectToLocalizedPath } from '../redirects'

export default async function RedirectPage() {
    await redirectToLocalizedPath('/stored')
}
