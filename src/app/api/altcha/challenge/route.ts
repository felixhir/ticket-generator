import { getAltcha } from '@/lib/server/altcha'

export async function GET(request: Request) {
    const altcha = await getAltcha()
    return altcha.challengeHandler(request)
}
