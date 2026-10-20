/** Rimuove i ritorni a capo (anche incollando) sostituendoli con uno spazio. */
export function collapseGlobalMessageNewlines(text: string): string {
  return text.replace(/\r\n|\r|\n/g, ' ')
}

/** Pulizia al salvataggio: a capo come spazi e trim ai bordi. */
export function normalizeGlobalMessageForSave(text: string): string {
  return collapseGlobalMessageNewlines(text).trim()
}
