export type FixedMenuDishSelectionRow = {
  dishId: string
  rowId?: string
  portionIt: string
  portionEn: string
}

/** Applica la scelta del picker: tolti escono; aggiunti in fondo; ordine e porzioni degli altri invariati. */
export function applyDishPickerSelection<T extends FixedMenuDishSelectionRow>(
  current: readonly T[],
  selectedDishIds: readonly string[],
  createRow: (dishId: string) => T,
): T[] {
  const selected = new Set(selectedDishIds)
  const kept = current.filter((row) => selected.has(row.dishId))
  const keptIds = new Set(kept.map((row) => row.dishId))
  const added = selectedDishIds.filter((id) => !keptIds.has(id)).map((id) => createRow(id))
  return [...kept, ...added]
}
