import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import type { TaxonomyOption } from '@/lib/app/dishes/loadDishesPageContext'
import {
  getMenuDevSimulateLoadDelayMs,
  shouldSimulateMenuLoadError,
} from '@/lib/app/menu/devSimulate'
import { COUNTRIES_SLUG, SPIRIT_TYPES_SLUG } from '@/lib/menu/constants'
import type { Country, SpiritType } from '@/payload-types'

export type SpiritsPageContext = {
  spiritTypes: TaxonomyOption[]
  countries: TaxonomyOption[]
  loadError: boolean
  simulateLoadDelayMs: number
}

export async function loadSpiritsPageContext(): Promise<SpiritsPageContext> {
  if (shouldSimulateMenuLoadError()) {
    return { spiritTypes: [], countries: [], loadError: true, simulateLoadDelayMs: 0 }
  }

  const delayMs = getMenuDevSimulateLoadDelayMs()
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  try {
    const req = await createAppPayloadRequest('/app/menu/spirits')
    const [typesRes, countriesRes] = await Promise.all([
      req.payload.find({
        collection: SPIRIT_TYPES_SLUG,
        depth: 0,
        limit: 50,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: 'name',
      }),
      req.payload.find({
        collection: COUNTRIES_SLUG,
        depth: 0,
        limit: 100,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        where: { enabled: { equals: true } },
        sort: 'name',
      }),
    ])

    const spiritTypes = (typesRes.docs as SpiritType[]).map((t) => ({
      id: String(t.id),
      name: t.name,
    }))
    const countries = (countriesRes.docs as Country[]).map((c) => ({
      id: String(c.id),
      name: c.name,
    }))

    return { spiritTypes, countries, loadError: false, simulateLoadDelayMs: delayMs }
  } catch {
    return { spiritTypes: [], countries: [], loadError: true, simulateLoadDelayMs: 0 }
  }
}
