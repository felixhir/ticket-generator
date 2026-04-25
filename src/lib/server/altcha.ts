import { deriveKey } from 'altcha-lib/algorithms/pbkdf2'
import { CappedMap, create, deriveHmacKeySecret, randomInt } from 'altcha-lib/frameworks/nextjs'

const challengeExpiresMs = 10 * 60 * 1000
const challengeCost = 5_000
const replayStoreSize = 1_000

type Altcha = ReturnType<typeof create>

type AltchaVerificationResponse = {
    error: string | null
    verification: { verified: boolean } | null
}

let altchaPromise: Promise<Altcha> | null = null

function getAltchaSecret() {
    const secret = process.env.ALTCHA_HMAC_SECRET
    if (!secret) {
        throw new Error('ALTCHA_HMAC_SECRET is not configured')
    }
    return secret
}

async function createAltcha() {
    const hmacSignatureSecret = getAltchaSecret()
    const hmacKeySignatureSecret = await deriveHmacKeySecret(hmacSignatureSecret)

    return create({
        hmacSignatureSecret,
        hmacKeySignatureSecret,
        createChallengeParameters: () => ({
            algorithm: 'PBKDF2/SHA-256',
            cost: challengeCost,
            counter: randomInt(5_000, 10_000),
            expiresAt: new Date(Date.now() + challengeExpiresMs)
        }),
        deriveKey,
        store: new CappedMap<string, boolean>({
            maxSize: replayStoreSize
        })
    })
}

export async function getAltcha() {
    altchaPromise ??= createAltcha().catch(err => {
        altchaPromise = null
        throw err
    })
    return altchaPromise
}

export async function verifyAltchaPayload(payload: string) {
    const altcha = await getAltcha()
    const request = new Request('https://ticket-generator.local/api/altcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ altcha: payload })
    })
    const response = await altcha.verifyHandler(request)
    const result = (await response.json()) as AltchaVerificationResponse

    return result.error === null && result.verification?.verified === true
}
