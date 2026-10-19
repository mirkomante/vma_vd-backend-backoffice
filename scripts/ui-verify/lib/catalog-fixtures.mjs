import { catalogCopyConst } from './catalog-copy.mjs'
import { menuCountCatalog, menuCreateCatalogItems, menuDeleteVerifyPrefix } from './menu-payload.mjs'

/**
 * Fixture DB una volta per stato (prima delle celle parallele).
 * @returns {{ ok: boolean, reason?: string }}
 */
export function applyCatalogFixtures(config, statoId, ctx) {
  const { testUser } = ctx
  const sid = config.id
  menuDeleteVerifyPrefix()

  switch (statoId) {
    case 'elenco':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-elenco` }])
      return { ok: true }
    case 'disponibilita':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-disp-shot` }])
      return { ok: true }
    case 'filtri-attivi':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-filtro` }])
      return { ok: true }
    case 'filtri-origine':
      if (!config.hasOriginCascade) return { ok: false, reason: 'stato non preparato' }
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-orig` }])
      return { ok: true }
    case 'modulo':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-mod` }])
      return { ok: true }
    case 'modulo-origine':
      if (sid !== 'vini') return { ok: false, reason: 'stato non preparato' }
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: 'verify-ui-vini-mod-orig' }])
      return { ok: true }
    case 'modulo-inglese-aperto':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-en` }])
      return { ok: true }
    case 'errore-geografia':
      if (sid !== 'vini') return { ok: false, reason: 'stato non preparato' }
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: 'verify-ui-vini-geo-shot' }])
      return { ok: true }
    case 'elimina':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-del` }])
      return { ok: true }
    case 'eliminato':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-del-done` }])
      return { ok: true }
    case 'piu-di-100-vini':
    case 'piu-di-100-distillati':
    case 'piu-di-100-bevande': {
      const { count } = menuCountCatalog(config.collection)
      const need = Math.max(0, 101 - count)
      const specs = []
      for (let i = 1; i <= need; i += 1) {
        specs.push({ name: `${config.bulkPrefix}${String(i).padStart(3, '0')}` })
      }
      if (specs.length) menuCreateCatalogItems(testUser.email, config.collection, specs)
      return { ok: true }
    }
    case 'vuoto': {
      const { count } = menuCountCatalog(config.collection)
      if (count > 0) return { ok: false, reason: `stato vuoto: DB con ${count} record` }
      return { ok: true }
    }
    case 'nessun-risultato':
      menuCreateCatalogItems(testUser.email, config.collection, [{ name: `verify-ui-${sid}-find` }])
      return { ok: true }
    case 'filtri':
    case 'origine-senza-regioni':
    case 'nuovo':
    case 'modulo-anno':
    case 'nuovo-errori':
    case 'errore-anno':
    case 'caricamento':
    case 'errore-caricamento':
    case 'errore-azione':
      return { ok: true }
    default:
      return { ok: true }
  }
}

export function catalogItemNameForState(config, statoId) {
  const sid = config.id
  const copy = (name) => catalogCopyConst(sid, name)
  switch (statoId) {
    case 'disponibilita':
      return `verify-ui-${sid}-disp-shot`
    case 'filtri-attivi':
      return `verify-ui-${sid}-filtro`
    case 'modulo':
      return `verify-ui-${sid}-mod`
    case 'modulo-origine':
      return 'verify-ui-vini-mod-orig'
    case 'modulo-inglese-aperto':
      return `verify-ui-${sid}-en`
    case 'elimina':
      return `verify-ui-${sid}-del`
    case 'eliminato':
      return `verify-ui-${sid}-del-done`
    case 'errore-geografia':
      return 'verify-ui-vini-geo-shot'
    case 'nessun-risultato':
      return `verify-ui-${sid}-find`
    default:
      return null
  }
}
