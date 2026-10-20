import { readFileSync } from 'node:fs'

import { CONTROLLI_66_PATH } from '../paths'
import type { MenuListScreenId } from './config'

type ScreenJson = {
  id: string
  stati?: { id: string }[]
  stati_c1_c2?: string[]
  immagini?: { stati_con_riferimento?: Record<string, string[]> }
}

type Controlli66 = { schermate?: ScreenJson[] }

function screenJson(id: MenuListScreenId): ScreenJson {
  const data = JSON.parse(readFileSync(CONTROLLI_66_PATH, 'utf8')) as Controlli66
  const s = data.schermate?.find((x) => x.id === id)
  if (!s) throw new Error(`schermata ${id} non trovata nel JSON`)
  return s
}

/** Stati della matrice C1–C3 (come il lanciatore ui:verify). */
export function matrixStates(screenId: MenuListScreenId): string[] {
  const s = screenJson(screenId)
  return [...(s.stati_c1_c2 ?? [])]
}

export function nonProvatoReason(screenId: MenuListScreenId, statoId: string): string | null {
  if (statoId === 'vuoto') {
    return 'NON PROVABILE con dati presenti: il database di sviluppo non viene svuotato'
  }
  if (screenId === 'menu-fissi' && statoId === 'categorie-vuoto') {
    return 'stato non preparabile senza svuotare le categorie di prova nel database'
  }
  if (screenId === 'menu-fissi' && statoId === 'nuovo-senza-categorie') {
    return 'stato non preparabile senza svuotare le categorie di prova nel database'
  }
  return null
}

export type ShotPlan = { statoId: string; profilo: string; tema: 'chiaro' | 'scuro'; refFile: string }

export function screenshotPlan(screenId: MenuListScreenId): ShotPlan[] {
  const s = screenJson(screenId)
  const refs = s.immagini?.stati_con_riferimento ?? {}
  const out: ShotPlan[] = []
  for (const [statoId, files] of Object.entries(refs)) {
    for (const refFile of files) {
      const parsed = parseRefFilename(refFile)
      if (!parsed) continue
      out.push({ statoId, profilo: parsed.profilo, tema: parsed.tema, refFile })
    }
  }
  return out
}

function parseRefFilename(name: string): { profilo: string; tema: 'chiaro' | 'scuro' } | null {
  const m = name.match(/^(\d+)-(.+)\.(png)$/)
  if (!m) return null
  const width = m[1]
  const rest = m[2]
  const profilo = width === '390' ? 'telefono-390' : width === '1280' ? 'notebook-1280' : null
  if (!profilo) return null
  const temaMatch = rest.match(/(chiaro|scuro)$/)
  if (!temaMatch) return null
  return { profilo, tema: temaMatch[1] as 'chiaro' | 'scuro' }
}

export function expectedScreenshotCount(screenId: MenuListScreenId): number {
  return screenshotPlan(screenId).length
}
