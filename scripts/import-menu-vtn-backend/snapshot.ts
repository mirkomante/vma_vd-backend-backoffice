import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

export type ApiListResponse<T> = {
  success: boolean
  data: T[]
  meta?: { count?: number }
}

export type SnapshotBundle = {
  dir: string
  piatti: PiattoSnapshot[]
  vini: VinoSnapshot[]
  liquori: LiquoreSnapshot[]
  bevande: BevandaSnapshot[]
  servizi: ServizioSnapshot[]
  allergeni: AllergeneSnapshot[]
  categoriePiatti: NamedTaxonomySnapshot[]
  tipologieVino: NamedTaxonomySnapshot[]
  tipologieLiquore: NamedTaxonomySnapshot[]
  tipologieBevanda: NamedTaxonomySnapshot[]
}

export type NamedTaxonomySnapshot = {
  id: string
  nome: string
  descrizione?: string | null
}

export type AllergeneSnapshot = {
  id: string
  nome: string
  descrizione?: string | null
}

export type PiattoAllergeneJoin = {
  allergene?: { nome?: string } | null
}

export type PiattoSnapshot = {
  id: string
  nome: string
  descrizione?: string | null
  prezzo: string
  inLista: boolean
  glutenFree?: boolean
  noLatticini?: boolean
  vegan?: boolean
  noUovo?: boolean
  categoria?: { nome?: string } | null
  allergeni?: PiattoAllergeneJoin[] | null
}

export type VinoSnapshot = {
  id: string
  nome: string
  descrizione?: string | null
  cantina?: string | null
  anno?: string | null
  capacita?: string | null
  grado?: string | null
  prezzo: string
  prezzoCalice?: string | null
  certificazione?: string | null
  inLista: boolean
  nazione?: { nome?: string } | null
  regione?: { nome?: string } | null
  zona?: { nome?: string } | null
  tipologia?: { nome?: string } | null
}

export type LiquoreSnapshot = {
  id: string
  nome: string
  descrizione?: string | null
  grado?: string | null
  invecchiamento?: string | null
  capacita?: string | null
  prezzo: string
  inLista: boolean
  nazione?: { nome?: string } | null
  tipologia?: { nome?: string } | null
}

export type BevandaSnapshot = {
  id: string
  nome: string
  descrizione?: string | null
  prezzo: string
  inLista: boolean
  nazione?: { nome?: string } | null
  tipologia?: { nome?: string } | null
}

export type ServizioSnapshot = {
  id: string
  nome: string
  prezzo: string
  inLista: boolean
}

const REQUIRED_FILES = [
  'piatti.json',
  'vini.json',
  'liquori.json',
  'bevande.json',
  'servizi.json',
  'allergeni.json',
  'categorie-piatti.json',
  'tipologie-vino.json',
  'tipologie-liquore.json',
  'tipologie-bevanda.json',
] as const

function loadJson<T>(dir: string, file: string): ApiListResponse<T> {
  const path = join(dir, file)
  if (!existsSync(path)) {
    throw new Error(`File snapshot mancante: ${path}`)
  }
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as ApiListResponse<T>
  if (!parsed.success) {
    throw new Error(`Snapshot ${file}: success=false`)
  }
  if (parsed.meta?.count != null && parsed.meta.count !== parsed.data.length) {
    throw new Error(
      `Snapshot ${file}: meta.count=${parsed.meta.count} ≠ len(data)=${parsed.data.length}`,
    )
  }
  return parsed
}

export function loadSnapshot(dir: string): SnapshotBundle {
  for (const file of REQUIRED_FILES) {
    if (!existsSync(join(dir, file))) {
      throw new Error(`Cartella snapshot incompleta: manca ${file} in ${dir}`)
    }
  }
  return {
    dir,
    piatti: loadJson<PiattoSnapshot>(dir, 'piatti.json').data,
    vini: loadJson<VinoSnapshot>(dir, 'vini.json').data,
    liquori: loadJson<LiquoreSnapshot>(dir, 'liquori.json').data,
    bevande: loadJson<BevandaSnapshot>(dir, 'bevande.json').data,
    servizi: loadJson<ServizioSnapshot>(dir, 'servizi.json').data,
    allergeni: loadJson<AllergeneSnapshot>(dir, 'allergeni.json').data,
    categoriePiatti: loadJson<NamedTaxonomySnapshot>(dir, 'categorie-piatti.json').data,
    tipologieVino: loadJson<NamedTaxonomySnapshot>(dir, 'tipologie-vino.json').data,
    tipologieLiquore: loadJson<NamedTaxonomySnapshot>(dir, 'tipologie-liquore.json').data,
    tipologieBevanda: loadJson<NamedTaxonomySnapshot>(dir, 'tipologie-bevanda.json').data,
  }
}

export function naturalKey(name: string): string {
  return name.trim()
}
