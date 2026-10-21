import { readFileSync } from 'node:fs'

import { CONTROLLI_66_PATH } from '../paths'

type ScreenJson = {
  id: string
  stati_c1_c2?: string[]
  immagini?: { stati_con_riferimento?: Record<string, string[]> }
}

type Controlli66 = { schermate?: ScreenJson[] }

const SCREEN_ID = 'giorni-speciali'

const SIM_STATES = new Set(['caricamento', 'errore-caricamento', 'errore-azione'])

function screenJson(): ScreenJson {
  const data = JSON.parse(readFileSync(CONTROLLI_66_PATH, 'utf8')) as Controlli66
  const s = data.schermate?.find((x) => x.id === SCREEN_ID)
  if (!s) throw new Error(`schermata ${SCREEN_ID} non trovata nel JSON`)
  return s
}

export function matrixStates(): string[] {
  return [...(screenJson().stati_c1_c2 ?? [])]
}

export function nonProvatoReason(statoId: string): string | null {
  if (SIM_STATES.has(statoId)) return 'le riprova V6 con un dev server alla volta'
  if (statoId === 'vuoto') return 'database popolato'
  return null
}

export type ShotPlan = {
  statoId: string
  shotKey: string
  profilo: string
  tema: 'chiaro' | 'scuro'
  refFile: string
}

export function screenshotPlan(): ShotPlan[] {
  const s = screenJson()
  const refs = s.immagini?.stati_con_riferimento ?? {}
  const out: ShotPlan[] = []
  for (const [statoId, files] of Object.entries(refs)) {
    if (nonProvatoReason(statoId)) continue
    for (const refFile of files) {
      const parsed = parseRefFilename(refFile, statoId)
      if (!parsed) continue
      out.push({
        statoId,
        shotKey: parsed.shotKey,
        profilo: parsed.profilo,
        tema: parsed.tema,
        refFile,
      })
    }
  }
  return out
}

function parseRefFilename(
  name: string,
  statoId: string,
): { profilo: string; tema: 'chiaro' | 'scuro'; shotKey: string } | null {
  const m = name.match(/^(\d+)-(.+)\.(png)$/)
  if (!m) return null
  const width = m[1]
  const rest = m[2]
  const profilo = width === '390' ? 'telefono-390' : width === '1280' ? 'notebook-1280' : null
  if (!profilo) return null
  let tema: 'chiaro' | 'scuro'
  let withoutTema: string
  if (rest === 'chiaro' || rest === 'scuro') {
    tema = rest
    withoutTema = ''
  } else {
    const temaMatch = rest.match(/-(chiaro|scuro)$/)
    if (!temaMatch) return null
    tema = temaMatch[1] as 'chiaro' | 'scuro'
    withoutTema = rest.slice(0, -(tema.length + 1))
  }
  const shotKey = withoutTema.length > 0 ? withoutTema : statoId
  return { profilo, tema, shotKey }
}

export function screenshotFileName(shot: ShotPlan): string {
  return `giorni-speciali-${shot.shotKey}-${shot.profilo}-${shot.tema}.png`
}
