import type { Payload } from 'payload'

import {
  DISH_CATEGORIES_SLUG,
  DISHES_SLUG,
  DRINK_TYPES_SLUG,
  DRINKS_SLUG,
  MENU_SERVICES_SLUG,
  SPIRIT_TYPES_SLUG,
  SPIRITS_SLUG,
  WINE_TYPES_SLUG,
  WINES_SLUG,
} from '@/lib/menu/constants'
import type { CollectionSlug } from 'payload'

import type { MenuContentSlug } from '@/lib/menu/constants'
import { SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY } from '@/lib/menu/availability/constants'
import { syncMenuAvailabilityFile } from '@/lib/menu/availability/syncMenuAvailabilityFile'
import {
  ALLOWED_APPELLATION_NAMES,
  KNOWN_MANUAL_REVIEW_WINE_NAMES,
  SUSPICIOUS_TAXONOMY_PATTERNS,
} from './constants'
import type { LookupCache } from './lookups'
import {
  normalizeClassificationName,
  resolveAllergenSeedName,
  taxonomyId,
} from './lookups'
import type { NormalizeResult } from '@/lib/menu/formats'
import {
  normalizeSpiritAbvForImport,
  normalizeSpiritAgingForImport,
  normalizeSpiritVolumeForImport,
  normalizeWineAbvForImport,
  normalizeWineVolumeForImport,
  normalizeWineYearForImport,
} from '@/lib/menu/formats'
import {
  isInvalidOptionalGlassRaw,
  isNonPositiveNumericPrice,
  parseOptionalGlassPrice,
  parseRequiredPrice,
} from './parsePrice'
import type { SnapshotBundle } from './snapshot'
import { naturalKey } from './snapshot'

export type ReportError = { code: string; message: string; entity?: string }

export type EntityCounts = {
  snapshotTotal: number
  snapshotHidden: number
  toCreate: number
  alreadyPresent: number
  alreadyPresentWithDiff: number
  onlyInDatabase: string[]
  duplicateKeys: Array<{ key: string; ids: string[] }>
}

export type ImportReport = {
  errors: ReportError[]
  warnings: string[]
  manualReview: string[]
  entities: Record<string, EntityCounts>
  allergenTable: Array<{
    snapshotName: string
    seedName: string
    dishCount: number
  }>
  formatDistinct: Array<{
    label: string
    forms: Array<{ raw: string; count: number; treatment: string; canonical?: string }>
  }>
  drinksFormatNote: string
  glassPriceDistinct: Array<{ raw: string; count: number; treatment: string }>
  normalizations: Array<{ kind: string; example: string }>
  taxonomyReview: Array<{ name: string; hint: string }>
  diffs: Array<{ entity: string; key: string; fields: string[] }>
}

function pushDuplicateErrors(
  errors: ReportError[],
  entity: string,
  items: Array<{ key: string; id: string }>,
): Array<{ key: string; ids: string[] }> {
  const byKey = new Map<string, string[]>()
  for (const item of items) {
    if (!item.key) {
      errors.push({ code: 'empty_key', message: 'Nome vuoto dopo trim', entity })
      continue
    }
    const list = byKey.get(item.key) ?? []
    list.push(item.id)
    byKey.set(item.key, list)
  }
  const dups: Array<{ key: string; ids: string[] }> = []
  for (const [key, ids] of byKey) {
    if (ids.length > 1) {
      dups.push({ key, ids })
      errors.push({
        code: 'duplicate_snapshot_key',
        message: `Chiave naturale duplicata nello snapshot: «${key}» (${ids.length} record)`,
        entity,
      })
    }
  }
  return dups
}

function collectStringFieldStats<T>(
  rows: T[],
  getValue: (row: T) => string | null | undefined,
): Map<string, number> {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const raw = getValue(row)
    const label = raw === null || raw === undefined || String(raw).trim() === '' ? '(vuoto)' : String(raw)
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return counts
}

function treatmentForNormalizedField(
  raw: string,
  norm: NormalizeResult,
): { treatment: string; canonical?: string; error?: boolean } {
  if (raw === '(vuoto)') {
    return { treatment: 'omesso' }
  }
  if (!norm.ok) {
    return { treatment: 'rifiutata' }
  }
  if (!norm.canonical) {
    return { treatment: 'omesso' }
  }
  if (norm.raw === norm.canonical || raw === norm.canonical) {
    return { treatment: 'accettata', canonical: norm.canonical }
  }
  return { treatment: 'normalizzata', canonical: norm.canonical }
}

function buildFormatDistinctSection(
  label: string,
  stats: Map<string, number>,
  normalizer: (raw: unknown) => NormalizeResult,
  errors: ReportError[],
  errorCode: string,
  normalizations: ImportReport['normalizations'],
  kind: string,
): ImportReport['formatDistinct'][number] {
  const forms: ImportReport['formatDistinct'][number]['forms'] = []
  for (const [raw, count] of [...stats.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const norm = raw === '(vuoto)' ? { ok: true as const, raw: null } : normalizer(raw)
    const { treatment, canonical } = treatmentForNormalizedField(raw, norm)
    forms.push({ raw, count, treatment, ...(canonical ? { canonical } : {}) })
    if (raw !== '(vuoto)' && !norm.ok) {
      errors.push({
        code: errorCode,
        message: `${label}: forma non riconosciuta «${raw}» (${count} occorrenze)`,
      })
    } else if (norm.ok && norm.canonical && norm.raw && norm.raw !== norm.canonical) {
      normalizations.push({ kind, example: `${norm.raw} → ${norm.canonical}` })
    }
  }
  return { label, forms }
}

function collectGlassPriceStats(snapshot: SnapshotBundle): Map<string, number> {
  const counts = new Map<string, number>()
  for (const w of snapshot.vini) {
    const raw = w.prezzoCalice
    const label =
      raw === null || raw === undefined ? '(null)' : String(raw).trim() === '' ? '(vuoto)' : String(raw)
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return counts
}

function glassPriceTreatment(rawLabel: string): string {
  if (rawLabel === '(null)' || rawLabel === '(vuoto)') {
    return 'campo glassPrice omesso in creazione'
  }
  if (!/^\d+([.,]\d+)?$/.test(rawLabel)) {
    return 'errore di formato (blocca --apply)'
  }
  const value = Number.parseFloat(rawLabel.replace(',', '.'))
  if (isNonPositiveNumericPrice(value)) {
    return 'AVVISO: prezzo ≤0 — glassPrice non importato'
  }
  return 'glassPrice numerico importato'
}

function flagSuspiciousTaxonomy(name: string, manualReview: string[], taxonomyReview: ImportReport['taxonomyReview']) {
  for (const { pattern, hint } of SUSPICIOUS_TAXONOMY_PATTERNS) {
    if (pattern.test(name)) {
      const msg = `Tassonomia «${name}»: ${hint}`
      manualReview.push(msg)
      taxonomyReview.push({ name, hint })
    }
  }
}

async function listDbNamesLocalized(
  payload: Payload,
  collection: MenuContentSlug,
): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  const result = await payload.find({
    collection,
    locale: 'it',
    depth: 0,
    limit: 500,
    overrideAccess: true,
    fallbackLocale: false,
  })
  for (const doc of result.docs) {
    const docName = (doc as { name?: unknown }).name
    if (typeof docName === 'string') {
      map.set(naturalKey(docName), doc.id as number)
    }
  }
  return map
}

type PlainNameContentSlug = typeof WINES_SLUG | typeof SPIRITS_SLUG

async function listDbNamesPlain(
  payload: Payload,
  collection: PlainNameContentSlug,
): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  const result = await payload.find({
    collection,
    depth: 0,
    limit: 500,
    overrideAccess: true,
  })
  for (const doc of result.docs) {
    const docName = (doc as { name?: unknown }).name
    if (typeof docName === 'string') {
      map.set(naturalKey(docName), doc.id as number)
    }
  }
  return map
}

export async function buildImportReport(
  payload: Payload,
  snapshot: SnapshotBundle,
  cache: LookupCache,
): Promise<ImportReport> {
  const errors: ReportError[] = []
  const warnings: string[] = []
  const manualReview: string[] = []
  const normalizations: ImportReport['normalizations'] = []
  const diffs: ImportReport['diffs'] = []
  const taxonomyReview: ImportReport['taxonomyReview'] = []

  const dishAllergenCounts = new Map<string, number>()
  for (const p of snapshot.piatti) {
    for (const join of p.allergeni ?? []) {
      const n = join.allergene?.nome
      if (n) {
        dishAllergenCounts.set(n, (dishAllergenCounts.get(n) ?? 0) + 1)
      }
    }
  }

  const allergenTable = snapshot.allergeni.map((a) => {
    const seedName = resolveAllergenSeedName(a.nome)
    if (!cache.allergenBySeedNameIt.has(seedName)) {
      errors.push({
        code: 'allergen_unmapped',
        message: `Allergene snapshot «${a.nome}» → seed «${seedName}» non trovato nel database`,
        entity: 'allergens',
      })
    }
    return {
      snapshotName: a.nome,
      seedName,
      dishCount: dishAllergenCounts.get(a.nome) ?? 0,
    }
  })

  for (const p of snapshot.piatti) {
    for (const join of p.allergeni ?? []) {
      const snapName = join.allergene?.nome
      if (!snapName) {
        continue
      }
      const seedName = resolveAllergenSeedName(snapName)
      if (!cache.allergenBySeedNameIt.has(seedName)) {
        errors.push({
          code: 'allergen_unmapped',
          message: `Piatto «${p.nome}»: allergene «${snapName}» (seed «${seedName}») non nel database`,
          entity: DISHES_SLUG,
        })
      }
    }
  }

  const formatDistinct: ImportReport['formatDistinct'] = [
    buildFormatDistinctSection(
      'vini.year',
      collectStringFieldStats(snapshot.vini, (w) => w.anno ?? null),
      (raw) => normalizeWineYearForImport(raw),
      errors,
      'wine_year_unknown',
      normalizations,
      'anno',
    ),
    buildFormatDistinctSection(
      'vini.abv',
      collectStringFieldStats(snapshot.vini, (w) => w.grado ?? null),
      (raw) => normalizeWineAbvForImport(raw),
      errors,
      'wine_abv_unknown',
      normalizations,
      'grado_vino',
    ),
    buildFormatDistinctSection(
      'vini.volume',
      collectStringFieldStats(snapshot.vini, (w) => w.capacita ?? null),
      (raw) => normalizeWineVolumeForImport(raw),
      errors,
      'wine_volume_unknown',
      normalizations,
      'capacita_vino',
    ),
    buildFormatDistinctSection(
      'distillati.abv',
      collectStringFieldStats(snapshot.liquori, (l) => l.grado ?? null),
      (raw) => normalizeSpiritAbvForImport(raw),
      errors,
      'spirit_abv_unknown',
      normalizations,
      'grado_distillato',
    ),
    buildFormatDistinctSection(
      'distillati.aging',
      collectStringFieldStats(snapshot.liquori, (l) => l.invecchiamento ?? null),
      (raw) => normalizeSpiritAgingForImport(raw),
      errors,
      'spirit_aging_unknown',
      normalizations,
      'invecchiamento',
    ),
    buildFormatDistinctSection(
      'distillati.volume',
      collectStringFieldStats(snapshot.liquori, (l) => l.capacita ?? null),
      (raw) => normalizeSpiritVolumeForImport(raw),
      errors,
      'spirit_volume_unknown',
      normalizations,
      'capacita_distillato',
    ),
  ]
  const drinksFormatNote = 'bevande: grado e capacità non presenti nello snapshot'

  const glassStats = collectGlassPriceStats(snapshot)
  const glassPriceDistinct: ImportReport['glassPriceDistinct'] = []
  for (const [raw, count] of [...glassStats.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const treatment = glassPriceTreatment(raw)
    glassPriceDistinct.push({ raw, count, treatment })
    if (raw !== '(null)' && raw !== '(vuoto)' && treatment.startsWith('errore')) {
      errors.push({
        code: 'glass_price_invalid',
        message: `prezzoCalice non numerico: «${raw}» (${count} occorrenze)`,
        entity: WINES_SLUG,
      })
    }
  }

  for (const w of snapshot.vini) {
    if (isInvalidOptionalGlassRaw(w.prezzoCalice)) {
      errors.push({
        code: 'glass_price_invalid',
        message: `Vino «${w.nome}»: prezzoCalice non valido «${w.prezzoCalice}»`,
        entity: WINES_SLUG,
      })
    }
    const cert = w.certificazione?.trim()
    if (cert) {
      const normalized = normalizeClassificationName(cert)
      if (normalized !== cert) {
        normalizations.push({ kind: 'certificazione', example: `${cert} → ${normalized}` })
      }
    }
    const zonaName = w.zona?.nome?.trim()
    if (zonaName && !ALLOWED_APPELLATION_NAMES.has(zonaName)) {
      errors.push({
        code: 'zona_not_allowed',
        message: `Vino «${w.nome}»: zona «${zonaName}» non consentita (solo Carso, Collio, Franciacorta)`,
        entity: WINES_SLUG,
      })
    }
    if (KNOWN_MANUAL_REVIEW_WINE_NAMES.some((n) => naturalKey(w.nome) === naturalKey(n))) {
      manualReview.push(`Vino «${w.nome}»: descrizione da revisione manuale (difetto noto)`)
    }
  }

  for (const priceCheck of [
    ...snapshot.piatti.map((p) => ({ entity: DISHES_SLUG, name: p.nome, raw: p.prezzo, label: 'prezzo' })),
    ...snapshot.vini.map((v) => ({ entity: WINES_SLUG, name: v.nome, raw: v.prezzo, label: 'prezzo' })),
    ...snapshot.liquori.map((l) => ({ entity: SPIRITS_SLUG, name: l.nome, raw: l.prezzo, label: 'prezzo' })),
    ...snapshot.bevande.map((b) => ({ entity: DRINKS_SLUG, name: b.nome, raw: b.prezzo, label: 'prezzo' })),
    ...snapshot.servizi.map((s) => ({ entity: MENU_SERVICES_SLUG, name: s.nome, raw: s.prezzo, label: 'prezzo' })),
  ]) {
    const parsed = parseRequiredPrice(priceCheck.raw, priceCheck.label)
    if (!parsed.ok) {
      errors.push({
        code: 'price_invalid',
        message: `${priceCheck.entity} «${priceCheck.name}»: ${parsed.reason} («${parsed.raw}»)`,
        entity: priceCheck.entity,
      })
    } else if (isNonPositiveNumericPrice(parsed.value)) {
      warnings.push(
        `AVVISO: ${priceCheck.entity} «${priceCheck.name}»: ${priceCheck.label} ≤0 («${priceCheck.raw}») — non importato; correggere lo snapshot o il record a mano`,
      )
    }
  }

  for (const w of snapshot.vini) {
    const glass = parseOptionalGlassPrice(w.prezzoCalice)
    if (glass.kind === 'value' && isNonPositiveNumericPrice(glass.value)) {
      warnings.push(
        `AVVISO: vino «${w.nome}»: prezzoCalice ≤0 («${glass.raw}») — glassPrice non importato`,
      )
    }
  }

  const taxonomyDefs = [
    { key: 'dish-categories', snapshot: snapshot.categoriePiatti },
    { key: 'wine-types', snapshot: snapshot.tipologieVino },
    { key: 'spirit-types', snapshot: snapshot.tipologieLiquore },
    { key: 'drink-types', snapshot: snapshot.tipologieBevanda },
  ] as const

  const entities: Record<string, EntityCounts> = {}

  for (const def of taxonomyDefs) {
    const dbMap = cache.taxonomyLocalizedByNameIt.get(def.key) ?? new Map()
    const snapshotKeys = new Set<string>()
    const dupItems: Array<{ key: string; id: string }> = []
    for (const row of def.snapshot) {
      const key = naturalKey(row.nome)
      snapshotKeys.add(key)
      dupItems.push({ key, id: row.id })
      flagSuspiciousTaxonomy(row.nome, manualReview, taxonomyReview)
    }
    const duplicateKeys = pushDuplicateErrors(errors, def.key, dupItems)
    const onlyInDatabase = [...dbMap.keys()].filter((k) => !snapshotKeys.has(k)).sort()
    let toCreate = 0
    let alreadyPresent = 0
    for (const key of snapshotKeys) {
      if (dbMap.has(key)) {
        alreadyPresent += 1
      } else {
        toCreate += 1
      }
    }
    entities[def.key] = {
      snapshotTotal: def.snapshot.length,
      snapshotHidden: 0,
      toCreate,
      alreadyPresent,
      alreadyPresentWithDiff: 0,
      onlyInDatabase,
      duplicateKeys,
    }
  }

  const contentDefs = [
    {
      key: MENU_SERVICES_SLUG,
      rows: snapshot.servizi,
      hidden: (s: { inLista: boolean }) => !s.inLista,
      db: () => listDbNamesLocalized(payload, MENU_SERVICES_SLUG),
    },
    {
      key: DISHES_SLUG,
      rows: snapshot.piatti,
      hidden: (p: { inLista: boolean }) => !p.inLista,
      db: () => listDbNamesLocalized(payload, DISHES_SLUG),
    },
    {
      key: WINES_SLUG,
      rows: snapshot.vini,
      hidden: (v: { inLista: boolean }) => !v.inLista,
      db: () => listDbNamesPlain(payload, WINES_SLUG),
    },
    {
      key: SPIRITS_SLUG,
      rows: snapshot.liquori,
      hidden: (l: { inLista: boolean }) => !l.inLista,
      db: () => listDbNamesPlain(payload, SPIRITS_SLUG),
    },
    {
      key: DRINKS_SLUG,
      rows: snapshot.bevande,
      hidden: (b: { inLista: boolean }) => !b.inLista,
      db: () => listDbNamesLocalized(payload, DRINKS_SLUG),
    },
  ] as const

  for (const def of contentDefs) {
    const dbMap = await def.db()
    const snapshotKeys = new Set<string>()
    const dupItems: Array<{ key: string; id: string }> = []
    let hiddenCount = 0
    for (const row of def.rows) {
      const key = naturalKey(row.nome)
      snapshotKeys.add(key)
      dupItems.push({ key, id: row.id })
      if (def.hidden(row)) {
        hiddenCount += 1
      }
    }
    const duplicateKeys = pushDuplicateErrors(errors, def.key, dupItems)
    const onlyInDatabase = [...dbMap.keys()].filter((k) => !snapshotKeys.has(k)).sort()
    let toCreate = 0
    let alreadyPresent = 0
    for (const key of snapshotKeys) {
      if (dbMap.has(key)) {
        alreadyPresent += 1
      } else {
        toCreate += 1
      }
    }
    entities[def.key] = {
      snapshotTotal: def.rows.length,
      snapshotHidden: hiddenCount,
      toCreate,
      alreadyPresent,
      alreadyPresentWithDiff: 0,
      onlyInDatabase,
      duplicateKeys,
    }
  }

  for (const w of snapshot.vini) {
    const countryName = w.nazione?.nome?.trim()
    if (!countryName || !cache.countryByNameIt.has(countryName)) {
      errors.push({
        code: 'country_unmapped',
        message: `Vino «${w.nome}»: paese «${countryName ?? '(mancante)'}» non nel seed`,
        entity: WINES_SLUG,
      })
    }
    const regionName = w.regione?.nome?.trim()
    if (regionName && !cache.regionByNameIt.has(regionName)) {
      errors.push({
        code: 'region_unmapped',
        message: `Vino «${w.nome}»: regione «${regionName}» non nel seed`,
        entity: WINES_SLUG,
      })
    }
    const typeName = w.tipologia?.nome?.trim()
    if (!typeName) {
      errors.push({ code: 'type_missing', message: `Vino «${w.nome}»: tipologia mancante`, entity: WINES_SLUG })
    } else if (
      !taxonomyId(cache, 'wine-types', typeName) &&
      !snapshot.tipologieVino.some((t) => naturalKey(t.nome) === naturalKey(typeName))
    ) {
      errors.push({
        code: 'wine_type_unmapped',
        message: `Vino «${w.nome}»: tipologia «${typeName}» assente`,
        entity: WINES_SLUG,
      })
    }
    const cert = w.certificazione?.trim()
    if (cert && countryName) {
      const normalized = normalizeClassificationName(cert)
      const countryId = cache.countryByNameIt.get(countryName)
      if (countryId && !cache.classificationByKey.has(`${normalized}\0${countryId}`)) {
        errors.push({
          code: 'classification_unmapped',
          message: `Vino «${w.nome}»: classificazione «${normalized}» non trovata per paese «${countryName}»`,
          entity: WINES_SLUG,
        })
      }
    }
    const zonaName = w.zona?.nome?.trim()
    if (zonaName && ALLOWED_APPELLATION_NAMES.has(zonaName)) {
      const app = cache.appellationByName.get(zonaName)
      if (!app) {
        errors.push({
          code: 'appellation_unmapped',
          message: `Vino «${w.nome}»: denominazione «${zonaName}» non nel seed`,
          entity: WINES_SLUG,
        })
      } else if (regionName) {
        const reg = cache.regionByNameIt.get(regionName)
        if (reg && reg.id !== app.regionId) {
          errors.push({
            code: 'appellation_region_mismatch',
            message: `Vino «${w.nome}»: denominazione «${zonaName}» non coerente con regione «${regionName}»`,
            entity: WINES_SLUG,
          })
        }
      }
    }
    if (zonaName && regionName) {
      const countryName2 = w.nazione?.nome?.trim()
      const reg = regionName ? cache.regionByNameIt.get(regionName) : undefined
      const countryId = countryName2 ? cache.countryByNameIt.get(countryName2) : undefined
      if (reg && countryId && reg.countryId !== countryId) {
        errors.push({
          code: 'region_country_mismatch',
          message: `Vino «${w.nome}»: regione «${regionName}» non appartiene al paese «${countryName2}»`,
          entity: WINES_SLUG,
        })
      }
    }
  }

  for (const l of snapshot.liquori) {
    const countryName = l.nazione?.nome?.trim()
    if (!countryName || !cache.countryByNameIt.has(countryName)) {
      errors.push({
        code: 'country_unmapped',
        message: `Distillato «${l.nome}»: paese «${countryName ?? '(mancante)'}» non nel seed`,
        entity: SPIRITS_SLUG,
      })
    }
    const typeName = l.tipologia?.nome?.trim()
    if (!typeName) {
      errors.push({
        code: 'type_missing',
        message: `Distillato «${l.nome}»: tipologia mancante`,
        entity: SPIRITS_SLUG,
      })
    }
  }

  for (const b of snapshot.bevande) {
    const countryName = b.nazione?.nome?.trim()
    if (countryName && !cache.countryByNameIt.has(countryName)) {
      errors.push({
        code: 'country_unmapped',
        message: `Bevanda «${b.nome}»: paese «${countryName}» non nel seed`,
        entity: DRINKS_SLUG,
      })
    }
    const typeName = b.tipologia?.nome?.trim()
    if (!typeName) {
      errors.push({
        code: 'type_missing',
        message: `Bevanda «${b.nome}»: tipologia mancante`,
        entity: DRINKS_SLUG,
      })
    }
  }

  for (const p of snapshot.piatti) {
    const catName = p.categoria?.nome?.trim()
    if (!catName) {
      errors.push({ code: 'category_missing', message: `Piatto «${p.nome}»: categoria mancante`, entity: DISHES_SLUG })
    }
  }

  const piattiSenzaAllergeni = snapshot.piatti.filter((p) => !(p.allergeni?.length ?? 0)).length
  if (piattiSenzaAllergeni > 0) {
    warnings.push(
      `${piattiSenzaAllergeni} piatti senza allergeni dichiarati nello snapshot (revisione ristorante, non errore import)`,
    )
  }

  return {
    errors,
    warnings,
    manualReview,
    entities,
    allergenTable,
    formatDistinct,
    drinksFormatNote,
    glassPriceDistinct,
    normalizations,
    taxonomyReview,
    diffs,
  }
}

export function printReport(report: ImportReport, apply: boolean): void {
  console.log(`=== Import menù VTN — report ${apply ? '(pre-apply)' : '(a secco)'} ===\n`)

  console.log('--- Allergeni (snapshot → seed 6.1, uso nei piatti) ---')
  console.log('| Nome snapshot | Nome seed | Piatti |')
  console.log('|---|---|---:|')
  for (const row of report.allergenTable) {
    console.log(`| ${row.snapshotName} | ${row.seedName} | ${row.dishCount} |`)
  }
  console.log('')

  console.log('--- Formati (anno, grado, capacità, invecchiamento) ---')
  for (const section of report.formatDistinct) {
    console.log(`[${section.label}]`)
    for (const row of section.forms) {
      const tail = row.canonical ? ` → ${row.canonical}` : ''
      console.log(`  «${row.raw}»: ${row.count} — ${row.treatment}${tail}`)
    }
    console.log('')
  }
  console.log(report.drinksFormatNote)
  console.log('')

  console.log('--- prezzoCalice (vini) ---')
  for (const row of report.glassPriceDistinct) {
    console.log(`  «${row.raw}»: ${row.count} — ${row.treatment}`)
  }
  console.log('')

  if (report.normalizations.length > 0) {
    console.log('--- Normalizzazioni (esempi) ---')
    for (const n of report.normalizations.slice(0, 20)) {
      console.log(`  [${n.kind}] ${n.example}`)
    }
    console.log('')
  }

  if (report.taxonomyReview.length > 0) {
    console.log('--- Revisione manuale tassonomie ---')
    for (const t of report.taxonomyReview) {
      console.log(`  «${t.name}»: ${t.hint}`)
    }
    console.log('')
  }

  if (report.manualReview.length > 0) {
    console.log('--- Revisione manuale contenuti ---')
    for (const line of report.manualReview) {
      console.log(`  ${line}`)
    }
    console.log('')
  }

  for (const [entity, counts] of Object.entries(report.entities)) {
    console.log(`--- ${entity} ---`)
    console.log(
      `  snapshot: ${counts.snapshotTotal} (nascosti/inLista false: ${counts.snapshotHidden}); ` +
        `da creare: ${counts.toCreate}; già presenti: ${counts.alreadyPresent}; ` +
        `con differenze: ${counts.alreadyPresentWithDiff}`,
    )
    if (counts.duplicateKeys.length > 0) {
      console.log('  duplicati snapshot:', counts.duplicateKeys)
    }
    if (counts.onlyInDatabase.length > 0) {
      console.log(`  solo nel database (${counts.onlyInDatabase.length}):`, counts.onlyInDatabase.join(', '))
    } else {
      console.log('  solo nel database: (nessuno)')
    }
    console.log('')
  }

  if (report.warnings.length > 0) {
    console.log('--- Avvisi ---')
    for (const w of report.warnings) {
      console.log(`  ${w}`)
    }
    console.log('')
  }

  if (report.errors.length > 0) {
    console.log(`--- Errori (${report.errors.length}) — --apply BLOCCATO ---`)
    for (const e of report.errors) {
      console.log(`  [${e.code}] ${e.message}`)
    }
    console.log('')
  } else {
    console.log('--- Errori: 0 ---\n')
  }
}

export type ApplyStats = Record<string, { created: number }>

export async function runApply(
  payload: Payload,
  snapshot: SnapshotBundle,
  cache: LookupCache,
): Promise<ApplyStats> {
  const stats: ApplyStats = {}
  const importBulkContext = { [SUPPRESS_MENU_AVAILABILITY_SYNC_CONTEXT_KEY]: true }

  async function ensureLocalizedTaxonomy(collection: CollectionSlug, names: string[]): Promise<void> {
    let created = 0
    const map = cache.taxonomyLocalizedByNameIt.get(collection) ?? new Map()
    for (const rawName of names) {
      const name = naturalKey(rawName)
      if (map.has(name)) {
        continue
      }
      const doc = await payload.create({
        collection,
        locale: 'it',
        depth: 0,
        overrideAccess: true,
        context: importBulkContext,
        data: { name },
      })
      map.set(name, doc.id as number)
      created += 1
    }
    cache.taxonomyLocalizedByNameIt.set(collection, map)
    stats[collection] = { created }
  }

  await ensureLocalizedTaxonomy(
    DISH_CATEGORIES_SLUG,
    snapshot.categoriePiatti.map((c) => c.nome),
  )
  await ensureLocalizedTaxonomy(
    WINE_TYPES_SLUG,
    snapshot.tipologieVino.map((t) => t.nome),
  )
  await ensureLocalizedTaxonomy(
    SPIRIT_TYPES_SLUG,
    snapshot.tipologieLiquore.map((t) => t.nome),
  )
  await ensureLocalizedTaxonomy(
    DRINK_TYPES_SLUG,
    snapshot.tipologieBevanda.map((t) => t.nome),
  )

  async function existsLocalized(collection: MenuContentSlug, nameIt: string): Promise<boolean> {
    const found = await payload.find({
      collection,
      locale: 'it',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      fallbackLocale: false,
      where: { name: { equals: nameIt } },
    })
    return Boolean(found.docs[0])
  }

  async function existsPlain(collection: PlainNameContentSlug, name: string): Promise<boolean> {
    const found = await payload.find({
      collection,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { name: { equals: name } },
    })
    return Boolean(found.docs[0])
  }

  let servicesCreated = 0
  for (const s of snapshot.servizi) {
    const name = naturalKey(s.nome)
    if (await existsLocalized(MENU_SERVICES_SLUG, name)) {
      continue
    }
    const price = parseRequiredPrice(s.prezzo, 'prezzo')
    if (!price.ok) {
      throw new Error(`Servizio «${name}»: prezzo non valido`)
    }
    if (isNonPositiveNumericPrice(price.value)) {
      throw new Error(`Servizio «${name}»: prezzo ≤0 non importato`)
    }
    await payload.create({
      collection: MENU_SERVICES_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      context: importBulkContext,
      data: {
        name,
        price: price.value,
        disabled: !s.inLista,
      },
    })
    servicesCreated += 1
  }
  stats[MENU_SERVICES_SLUG] = { created: servicesCreated }

  let dishesCreated = 0
  for (const p of snapshot.piatti) {
    const name = naturalKey(p.nome)
    if (await existsLocalized(DISHES_SLUG, name)) {
      continue
    }
    const price = parseRequiredPrice(p.prezzo, 'prezzo')
    if (!price.ok) {
      throw new Error(`Piatto «${name}»: prezzo non valido`)
    }
    if (isNonPositiveNumericPrice(price.value)) {
      throw new Error(`Piatto «${name}»: prezzo ≤0 non importato`)
    }
    const catName = p.categoria?.nome?.trim()
    const categoryId = catName ? taxonomyId(cache, 'dish-categories', catName) : undefined
    if (!categoryId) {
      throw new Error(`Piatto «${name}»: categoria non risolta`)
    }
    const allergenIds: number[] = []
    for (const join of p.allergeni ?? []) {
      const snapName = join.allergene?.nome
      if (!snapName) {
        continue
      }
      const seedName = resolveAllergenSeedName(snapName)
      const id = cache.allergenBySeedNameIt.get(seedName)
      if (!id) {
        throw new Error(`Piatto «${name}»: allergene «${snapName}» non risolto`)
      }
      if (!allergenIds.includes(id)) {
        allergenIds.push(id)
      }
    }
    await payload.create({
      collection: DISHES_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      context: importBulkContext,
      data: {
        name,
        ...(p.descrizione?.trim() ? { description: p.descrizione.trim() } : {}),
        price: price.value,
        category: categoryId,
        ...(allergenIds.length > 0 ? { allergens: allergenIds } : {}),
        glutenFree: Boolean(p.glutenFree),
        dairyFree: Boolean(p.noLatticini),
        vegan: Boolean(p.vegan),
        eggFree: Boolean(p.noUovo),
        disabled: !p.inLista,
        soldOut: false,
      },
    })
    dishesCreated += 1
  }
  stats[DISHES_SLUG] = { created: dishesCreated }

  let winesCreated = 0
  for (const w of snapshot.vini) {
    const name = naturalKey(w.nome)
    if (await existsPlain(WINES_SLUG, name)) {
      continue
    }
    const price = parseRequiredPrice(w.prezzo, 'prezzo')
    if (!price.ok) {
      throw new Error(`Vino «${name}»: prezzo non valido`)
    }
    if (isNonPositiveNumericPrice(price.value)) {
      throw new Error(`Vino «${name}»: prezzo ≤0 non importato`)
    }
    const countryName = w.nazione?.nome?.trim()
    const countryId = countryName ? cache.countryByNameIt.get(countryName) : undefined
    if (!countryId) {
      throw new Error(`Vino «${name}»: paese non risolto`)
    }
    const typeName = w.tipologia?.nome?.trim()
    const typeId = typeName ? taxonomyId(cache, 'wine-types', typeName) : undefined
    if (!typeId) {
      throw new Error(`Vino «${name}»: tipologia non risolta`)
    }
    const vol = normalizeWineVolumeForImport(w.capacita)
    if (!vol.ok) {
      throw new Error(`Vino «${name}»: capacità non valida`)
    }
    const yearNorm = normalizeWineYearForImport(w.anno)
    if (!yearNorm.ok) {
      throw new Error(`Vino «${name}»: anno non valido`)
    }
    const abvNorm = normalizeWineAbvForImport(w.grado)
    if (!abvNorm.ok) {
      throw new Error(`Vino «${name}»: grado non valido`)
    }
    const glass = parseOptionalGlassPrice(w.prezzoCalice)
    const regionName = w.regione?.nome?.trim()
    const reg = regionName ? cache.regionByNameIt.get(regionName) : undefined
    if (regionName && !reg) {
      throw new Error(`Vino «${name}»: regione non risolta`)
    }
    const zonaName = w.zona?.nome?.trim()
    const app =
      zonaName && ALLOWED_APPELLATION_NAMES.has(zonaName)
        ? cache.appellationByName.get(zonaName)
        : undefined
    if (zonaName && ALLOWED_APPELLATION_NAMES.has(zonaName) && !app) {
      throw new Error(`Vino «${name}»: denominazione non risolta`)
    }
    const cert = w.certificazione?.trim()
    const normalizedCert = cert ? normalizeClassificationName(cert) : undefined
    const classId =
      normalizedCert && countryId
        ? cache.classificationByKey.get(`${normalizedCert}\0${countryId}`)
        : undefined
    if (cert && !classId) {
      throw new Error(`Vino «${name}»: classificazione non risolta`)
    }
    await payload.create({
      collection: WINES_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      context: importBulkContext,
      data: {
        name,
        ...(w.descrizione?.trim() ? { description: w.descrizione.trim() } : {}),
        ...(w.cantina?.trim() ? { winery: w.cantina.trim() } : {}),
        ...(yearNorm.canonical ? { year: yearNorm.canonical } : {}),
        ...(abvNorm.canonical ? { abv: abvNorm.canonical } : {}),
        ...(vol.canonical ? { volume: vol.canonical } : {}),
        price: price.value,
        ...(glass.kind === 'value' && glass.value > 0 ? { glassPrice: glass.value } : {}),
        country: countryId,
        ...(reg ? { region: reg.id } : {}),
        ...(app ? { appellation: app.id } : {}),
        ...(classId ? { classification: classId } : {}),
        type: typeId,
        disabled: !w.inLista,
      },
    })
    winesCreated += 1
  }
  stats[WINES_SLUG] = { created: winesCreated }

  let spiritsCreated = 0
  for (const l of snapshot.liquori) {
    const name = naturalKey(l.nome)
    if (await existsPlain(SPIRITS_SLUG, name)) {
      continue
    }
    const price = parseRequiredPrice(l.prezzo, 'prezzo')
    if (!price.ok) {
      throw new Error(`Distillato «${name}»: prezzo non valido`)
    }
    if (isNonPositiveNumericPrice(price.value)) {
      throw new Error(`Distillato «${name}»: prezzo ≤0 non importato`)
    }
    const countryName = l.nazione?.nome?.trim()
    const countryId = countryName ? cache.countryByNameIt.get(countryName) : undefined
    if (!countryId) {
      throw new Error(`Distillato «${name}»: paese non risolto`)
    }
    const typeName = l.tipologia?.nome?.trim()
    const typeId = typeName ? taxonomyId(cache, 'spirit-types', typeName) : undefined
    if (!typeId) {
      throw new Error(`Distillato «${name}»: tipologia non risolta`)
    }
    const vol = normalizeSpiritVolumeForImport(l.capacita)
    if (!vol.ok) {
      throw new Error(`Distillato «${name}»: capacità non valida`)
    }
    const abvNorm = normalizeSpiritAbvForImport(l.grado)
    if (!abvNorm.ok) {
      throw new Error(`Distillato «${name}»: grado non valido`)
    }
    const agingNorm = normalizeSpiritAgingForImport(l.invecchiamento)
    if (!agingNorm.ok) {
      throw new Error(`Distillato «${name}»: invecchiamento non valido`)
    }
    await payload.create({
      collection: SPIRITS_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      context: importBulkContext,
      data: {
        name,
        ...(l.descrizione?.trim() ? { description: l.descrizione.trim() } : {}),
        ...(abvNorm.canonical ? { abv: abvNorm.canonical } : {}),
        ...(agingNorm.canonical ? { aging: agingNorm.canonical } : {}),
        ...(vol.canonical ? { volume: vol.canonical } : {}),
        price: price.value,
        country: countryId,
        type: typeId,
        disabled: !l.inLista,
      },
    })
    spiritsCreated += 1
  }
  stats[SPIRITS_SLUG] = { created: spiritsCreated }

  let drinksCreated = 0
  for (const b of snapshot.bevande) {
    const name = naturalKey(b.nome)
    if (await existsLocalized(DRINKS_SLUG, name)) {
      continue
    }
    const price = parseRequiredPrice(b.prezzo, 'prezzo')
    if (!price.ok) {
      throw new Error(`Bevanda «${name}»: prezzo non valido`)
    }
    if (isNonPositiveNumericPrice(price.value)) {
      throw new Error(`Bevanda «${name}»: prezzo ≤0 non importato`)
    }
    const typeName = b.tipologia?.nome?.trim()
    const typeId = typeName ? taxonomyId(cache, 'drink-types', typeName) : undefined
    if (!typeId) {
      throw new Error(`Bevanda «${name}»: tipologia non risolta`)
    }
    const countryName = b.nazione?.nome?.trim()
    const drinkCountryId = countryName ? cache.countryByNameIt.get(countryName) : undefined
    if (countryName && !drinkCountryId) {
      throw new Error(`Bevanda «${name}»: paese non risolto`)
    }
    await payload.create({
      collection: DRINKS_SLUG,
      locale: 'it',
      depth: 0,
      overrideAccess: true,
      context: importBulkContext,
      data: {
        name,
        ...(b.descrizione?.trim() ? { description: b.descrizione.trim() } : {}),
        price: price.value,
        type: typeId,
        ...(drinkCountryId ? { country: drinkCountryId } : {}),
        disabled: !b.inLista,
      },
    })
    drinksCreated += 1
  }
  stats[DRINKS_SLUG] = { created: drinksCreated }

  const syncResult = await syncMenuAvailabilityFile(payload)
  if (syncResult.skippedNoBucket) {
    payload.logger.warn(
      'Import: sincronizzazione disponibilita.json saltata (bucket o credenziali GCS non disponibili); in produzione il job Scheduler riallinea entro circa 5 minuti.',
    )
  }

  return stats
}

export async function fingerprintImportedCollections(
  payload: Payload,
): Promise<Record<string, string>> {
  const slugs = [DISHES_SLUG, WINES_SLUG, SPIRITS_SLUG, DRINKS_SLUG, MENU_SERVICES_SLUG] as const
  const out: Record<string, string> = {}
  for (const slug of slugs) {
    const result = await payload.find({
      collection: slug,
      depth: 0,
      limit: 500,
      overrideAccess: true,
      sort: 'id',
    })
    const parts = result.docs.map((doc) => {
      const updatedAt = doc.updatedAt ?? ''
      return `${doc.id}:${updatedAt}`
    })
    out[slug] = parts.join('|')
  }
  return out
}
