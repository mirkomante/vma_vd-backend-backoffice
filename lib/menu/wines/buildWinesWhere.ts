import type { Where } from 'payload'

import { disabledFilterToWhere } from '@/lib/menu/catalog/disabledStatusFilter'
import type { WineListQuery } from '@/lib/app/wines/types'

export function wineQueryHasActiveFilters(query: WineListQuery): boolean {
  return (
    Boolean(query.search.trim()) ||
    Boolean(query.typeId) ||
    query.status !== 'all' ||
    Boolean(query.countryId) ||
    Boolean(query.regionId) ||
    Boolean(query.appellationId)
  )
}

export function buildWinesListWhere(
  query: WineListQuery,
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
  if (query.regionId) {
    clauses.push({ region: { equals: query.regionId } })
  }
  if (query.appellationId) {
    clauses.push({ appellation: { equals: query.appellationId } })
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
