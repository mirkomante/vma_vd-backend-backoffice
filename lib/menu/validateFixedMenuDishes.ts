import { relationshipId } from '@/lib/menu/relationshipId'

const DUPLICATE_DISH_MESSAGE =
  'Lo stesso piatto non può comparire più di una volta in questo menu fisso.'

/** Validazione sul campo array `dishes` (fase 6.2). */
export function validateFixedMenuDishesField(value: unknown): string | true {
  if (!Array.isArray(value) || value.length === 0) {
    return true
  }

  const seen = new Set<string>()
  for (const row of value) {
    if (!row || typeof row !== 'object') {
      continue
    }
    const dishId = relationshipId(Reflect.get(row, 'dish'))
    if (dishId == null) {
      continue
    }
    const key = String(dishId)
    if (seen.has(key)) {
      return DUPLICATE_DISH_MESSAGE
    }
    seen.add(key)
  }

  return true
}
