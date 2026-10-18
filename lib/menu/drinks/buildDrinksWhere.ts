import type { Where } from 'payload'

import type { DrinkListQuery } from '@/lib/app/drinks/types'
import { disabledFilterToWhere } from '@/lib/menu/catalog/disabledStatusFilter'

export function drinkQueryHasActiveFilters(query: DrinkListQuery): boolean {
  return (
    Boolean(query.search.trim()) ||
    Boolean(query.typeId) ||
    query.status !== 'all' ||
    Boolean(query.countryId)
  )
}

export function buildDrinksListWhere(
  query: DrinkListQuery,
  searchIds: Array<number | string> | null,
): Where {
  const clauses: Where[] = []

  const statusWhere = disabledFilterToWhere(query.status)
  if (statusWhere) {
    clauses.push(statusWhere)
  }
  if (query.typeId) {
    clauses.push({ type: { equals: query.typeId } })
  }
  if (query.countryId) {
    clauses.push({ country: { equals: query.countryId } })
  }
  if (searchIds) {
    if (searchIds.length === 0) {
      clauses.push({ id: { equals: -1 } })
    } else {
      clauses.push({ id: { in: searchIds } })
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
