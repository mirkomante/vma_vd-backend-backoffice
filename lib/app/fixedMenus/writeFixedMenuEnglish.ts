import { relationshipId } from '@/lib/menu/relationshipId'
import type { FixedMenu } from '@/payload-types'

import type { FixedMenuFormValues } from './types'

export type FixedMenuEnglishUpdateData = {
  name: string
  description: string
  dishes: { id?: string | null; dish: number; portion: string }[]
}

/** Payload EN: riscrive tutte le righe piatti con id, dish e porzione (anche vuota). */
export function buildFixedMenuEnglishUpdateData(
  itDoc: FixedMenu,
  values: FixedMenuFormValues,
): FixedMenuEnglishUpdateData {
  const portionEnByDishId = new Map(values.dishes.map((row) => [row.dishId, row.portionEn]))
  const dishes =
    itDoc.dishes?.map((row) => {
      const dishId = relationshipId(row.dish)
      if (dishId == null) {
        throw new Error('missing dish on row')
      }
      return {
        id: row.id,
        dish: Number(dishId),
        portion: (portionEnByDishId.get(String(dishId)) ?? '').trim(),
      }
    }) ?? []

  return {
    name: values.nameEn.trim(),
    description: values.descriptionEn.trim(),
    dishes,
  }
}
