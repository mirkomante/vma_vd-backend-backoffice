import { compareItalianNames } from '@/lib/menu/display/sortByItalianName'
import { pluralizeIt } from '@/lib/menu/display/pluralizeIt'

export type CatalogTypeGroup<TRow> = {
  typeId: string
  typeName: string
  heading: string
  rows: TRow[]
}

export function formatTypeGroupHeading(
  typeName: string,
  count: number,
  singular: string,
  plural: string,
): string {
  return `${typeName} ${pluralizeIt(count, singular, plural)}`
}

export function groupRowsByType<TRow extends { typeId: string; typeName: string; name: string }>(
  rows: readonly TRow[],
  singular: string,
  plural: string,
  typeOrder?: ReadonlyArray<{ id: string; name: string }>,
): CatalogTypeGroup<TRow>[] {
  const byType = new Map<string, CatalogTypeGroup<TRow>>()

  for (const row of rows) {
    const key = row.typeId
    let group = byType.get(key)
    if (!group) {
      group = {
        typeId: row.typeId,
        typeName: row.typeName,
        heading: '',
        rows: [],
      }
      byType.set(key, group)
    }
    group.rows.push(row)
  }

  const groups = [...byType.values()]
  for (const group of groups) {
    group.rows.sort((a, b) => compareItalianNames(a.name, b.name))
    group.heading = formatTypeGroupHeading(group.typeName, group.rows.length, singular, plural)
  }

  if (typeOrder?.length) {
    const orderIndex = new Map(typeOrder.map((t, i) => [t.id, i]))
    groups.sort((a, b) => {
      const ia = orderIndex.get(a.typeId) ?? 9999
      const ib = orderIndex.get(b.typeId) ?? 9999
      if (ia !== ib) {
        return ia - ib
      }
      return compareItalianNames(a.typeName, b.typeName)
    })
  } else {
    groups.sort((a, b) => compareItalianNames(a.typeName, b.typeName))
  }

  return groups
}
