import { eventimStrategy } from '@/lib/server/import/providers/eventim-strategy'
import { reservixStrategy } from '@/lib/server/import/providers/reservix-strategy'
import { ticketmasterStrategy } from '@/lib/server/import/providers/ticketmaster-strategy'

const PROVIDER_STRATEGIES = [ticketmasterStrategy, eventimStrategy, reservixStrategy] as const

export function findProviderStrategy(hostname: string) {
    return PROVIDER_STRATEGIES.find(strategy => strategy.matchesHost(hostname)) ?? null
}
