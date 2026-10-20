/** Testo effettivo salvato per confronto con `disponibilita.json` (italiano, altrimenti inglese). */
export function effectiveSavedGlobalMessageText(it: string, en: string): string {
  const itTrim = it.trim()
  const enTrim = en.trim()
  if (itTrim) {
    return itTrim
  }
  if (enTrim) {
    return enTrim
  }
  return ''
}
