/** Sposta un elemento di una posizione su o giù; restituisce una nuova lista. */
export function moveListItem<T>(items: readonly T[], index: number, direction: 'up' | 'down'): T[] {
  const target = direction === 'up' ? index - 1 : index + 1
  if (target < 0 || target >= items.length) {
    return [...items]
  }
  const next = [...items]
  const tmp = next[index]
  next[index] = next[target]!
  next[target] = tmp!
  return next
}
