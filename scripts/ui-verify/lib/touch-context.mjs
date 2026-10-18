/**
 * Allinea gli screenshot C10 e gli stili pointer-coarse: altrimenti i pulsanti restano compatti (≈35 px)
 * mentre C2 misura aree di tocco reali. Vale solo per i profili con tocco del JSON.
 */
export async function installPointerCoarseForTouchProfiles(context) {
  await context.addInitScript(() => {
    const orig = window.matchMedia.bind(window)
    window.matchMedia = (query) => {
      const result = orig(query)
      const q = String(query)
      if (/\(\s*pointer\s*:\s*coarse\s*\)/.test(q)) {
        return Object.assign({}, result, { matches: true, media: q })
      }
      if (/\(\s*pointer\s*:\s*fine\s*\)/.test(q)) {
        return Object.assign({}, result, { matches: false, media: q })
      }
      return result
    }
  })
}
