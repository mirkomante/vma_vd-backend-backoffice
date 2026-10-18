/**
 * Elenco con al massimo `maxShown` elementi, poi suffisso «e altri N» (separatori da copy piatti).
 */
export function formatListedReferences(
  items: readonly string[],
  maxShown: number,
  separator: string,
  othersPrefix: string,
): string {
  if (items.length === 0) {
    return ''
  }
  const head = items.slice(0, maxShown)
  const listed = head.join(separator)
  if (items.length <= maxShown) {
    return listed
  }
  return `${listed}${separator}${othersPrefix}${items.length - maxShown}`
}
