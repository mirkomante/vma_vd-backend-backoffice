export type SelectItemMap = Record<string, string>

/** Mappa valore → etichetta per Select.Root `items`, con valore salvato fuori elenco. */
export function buildSelectItems(
  options: ReadonlyArray<{ id: string; label: string }>,
  savedValue: string | null | undefined,
  savedLabel?: string | null,
): SelectItemMap {
  const items: SelectItemMap = {}
  for (const opt of options) {
    items[opt.id] = opt.label
  }
  const saved = savedValue?.trim()
  if (saved && !(saved in items)) {
    items[saved] = savedLabel?.trim() || saved
  }
  return items
}

export function optionsFromTaxonomy(
  list: ReadonlyArray<{ id: string; name: string }>,
): Array<{ id: string; label: string }> {
  return list.map((t) => ({ id: t.id, label: t.name }))
}
