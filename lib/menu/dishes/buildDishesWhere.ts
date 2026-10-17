import type { Where } from 'payload'

export type DishListStatusFilter = 'all' | 'available' | 'soldOut' | 'disabled'

export type DishListFilterInput = {
  categoryId?: number | string | null
  status?: DishListStatusFilter
  noAllergens?: boolean
  searchDishIds?: Array<number | string> | null
}

export function buildDishStatusWhere(status: DishListStatusFilter): Where | null {
  switch (status) {
    case 'available':
      return {
        and: [
          { disabled: { not_equals: true } },
          { soldOut: { not_equals: true } },
        ],
      }
    case 'soldOut':
      return {
        and: [{ soldOut: { equals: true } }, { disabled: { not_equals: true } }],
      }
    case 'disabled':
      return { disabled: { equals: true } }
    default:
      return null
  }
}

export function buildDishesListWhere(input: DishListFilterInput): Where {
  const clauses: Where[] = []

  if (input.categoryId != null && input.categoryId !== '') {
    clauses.push({ category: { equals: input.categoryId } })
  }

  const statusWhere = buildDishStatusWhere(input.status ?? 'all')
  if (statusWhere) {
    clauses.push(statusWhere)
  }

  if (input.noAllergens) {
    clauses.push({
      or: [{ allergens: { exists: false } }, { 'allergens.0': { exists: false } }],
    })
  }

  if (input.searchDishIds) {
    if (input.searchDishIds.length === 0) {
      clauses.push({ id: { equals: -1 } })
    } else {
      clauses.push({ id: { in: input.searchDishIds } })
    }
  }

  if (clauses.length === 0) {
    return {}
  }
  if (clauses.length === 1) {
    return clauses[0]
  }
  return { and: clauses }
}
