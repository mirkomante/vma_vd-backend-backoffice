import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  getMenuDevSimulateLoadDelayMs,
  shouldSimulateMenuLoadError,
} from '@/lib/app/menu/devSimulate'
import type { TaxonomyOption } from '@/lib/app/dishes/loadDishesPageContext'
import { COUNTRIES_SLUG, WINE_TYPES_SLUG } from '@/lib/menu/constants'
import type { Country, WineType } from '@/payload-types'

export type WinesPageContext = {
  wineTypes: TaxonomyOption[]
  countries: TaxonomyOption[]
  loadError: boolean
  simulateLoadDelayMs: number
}

export async function loadWinesPageContext(): Promise<WinesPageContext> {
  if (shouldSimulateMenuLoadError()) {
    return { wineTypes: [], countries: [], loadError: true, simulateLoadDelayMs: 0 }
  }

  const delayMs = getMenuDevSimulateLoadDelayMs()
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  try {
    const req = await createAppPayloadRequest('/app/menu/wines')
    const [typesRes, countriesRes] = await Promise.all([
      req.payload.find({
        collection: WINE_TYPES_SLUG,
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

    const wineTypes = (typesRes.docs as WineType[]).map((t) => ({
      id: String(t.id),
      name: t.name,
    }))
    const countries = (countriesRes.docs as Country[]).map((c) => ({
      id: String(c.id),
      name: c.name,
    }))

    return { wineTypes, countries, loadError: false, simulateLoadDelayMs: delayMs }
  } catch {
    return { wineTypes: [], countries: [], loadError: true, simulateLoadDelayMs: 0 }
  }
}
