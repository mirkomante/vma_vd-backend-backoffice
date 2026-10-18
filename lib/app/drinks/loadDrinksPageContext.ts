import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import type { TaxonomyOption } from '@/lib/app/dishes/loadDishesPageContext'
import {
  getMenuDevSimulateLoadDelayMs,
  shouldSimulateMenuLoadError,
} from '@/lib/app/menu/devSimulate'
import { COUNTRIES_SLUG, DRINK_TYPES_SLUG } from '@/lib/menu/constants'
import type { Country, DrinkType } from '@/payload-types'

export type DrinksPageContext = {
  drinkTypes: TaxonomyOption[]
  countries: TaxonomyOption[]
  loadError: boolean
  simulateLoadDelayMs: number
}

export async function loadDrinksPageContext(): Promise<DrinksPageContext> {
  if (shouldSimulateMenuLoadError()) {
    return { drinkTypes: [], countries: [], loadError: true, simulateLoadDelayMs: 0 }
  }

  const delayMs = getMenuDevSimulateLoadDelayMs()
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  try {
    const req = await createAppPayloadRequest('/app/menu/drinks')
    const [typesRes, countriesRes] = await Promise.all([
      req.payload.find({
        collection: DRINK_TYPES_SLUG,
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

    const drinkTypes = (typesRes.docs as DrinkType[]).map((t) => ({
      id: String(t.id),
      name: t.name,
    }))
    const countries = (countriesRes.docs as Country[]).map((c) => ({
      id: String(c.id),
      name: c.name,
    }))

    return { drinkTypes, countries, loadError: false, simulateLoadDelayMs: delayMs }
  } catch {
    return { drinkTypes: [], countries: [], loadError: true, simulateLoadDelayMs: 0 }
  }
}
