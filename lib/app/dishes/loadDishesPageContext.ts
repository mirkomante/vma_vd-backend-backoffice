import { SYSTEM_SETTINGS_SLUG } from '@/globals/SystemSettings'
import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  getMenuDevSimulateLoadDelayMs,
  shouldSimulateMenuLoadError,
} from '@/lib/app/menu/devSimulate'
import type { ServiceHoursRow } from '@/lib/menu/availability/serviceBoundaries'
import { serviceRowsFromGlobal } from '@/lib/menu/availability/runSchedulerTick'
import {
  ALLERGENS_SLUG,
  DISH_CATEGORIES_SLUG,
} from '@/lib/menu/constants'
import type { Allergen, DishCategory, ImpostazioniSistema } from '@/payload-types'

export type TaxonomyOption = { id: string; name: string }

export type DishesPageContext = {
  serviceHours: ServiceHoursRow[]
  categories: TaxonomyOption[]
  allergens: TaxonomyOption[]
  loadError: boolean
  simulateLoadDelayMs: number
}

export async function loadDishesPageContext(): Promise<DishesPageContext> {
  if (shouldSimulateMenuLoadError()) {
    return {
      serviceHours: [],
      categories: [],
      allergens: [],
      loadError: true,
      simulateLoadDelayMs: 0,
    }
  }

  const delayMs = getMenuDevSimulateLoadDelayMs()
  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  try {
    const req = await createAppPayloadRequest('/app/menu')
    const settings = (await req.payload.findGlobal({
      slug: SYSTEM_SETTINGS_SLUG,
      depth: 0,
      overrideAccess: false,
      req,
    })) as ImpostazioniSistema

    const [categoriesRes, allergensRes] = await Promise.all([
      req.payload.find({
        collection: DISH_CATEGORIES_SLUG,
        depth: 0,
        limit: 200,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: 'name',
      }),
      req.payload.find({
        collection: ALLERGENS_SLUG,
        depth: 0,
        limit: 50,
        locale: 'it',
        overrideAccess: false,
        pagination: false,
        req,
        sort: 'name',
      }),
    ])

    const categories = (categoriesRes.docs as DishCategory[]).map((c) => ({
      id: String(c.id),
      name: c.name,
    }))
    const allergens = (allergensRes.docs as Allergen[]).map((a) => ({
      id: String(a.id),
      name: a.name,
    }))

    return {
      serviceHours: serviceRowsFromGlobal(settings),
      categories,
      allergens,
      loadError: false,
      simulateLoadDelayMs: delayMs,
    }
  } catch {
    return {
      serviceHours: [],
      categories: [],
      allergens: [],
      loadError: true,
      simulateLoadDelayMs: 0,
    }
  }
}
