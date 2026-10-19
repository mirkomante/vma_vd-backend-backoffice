import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { logProgressParts } from './progress.mjs'

const ROOT = join(import.meta.dirname, '../../..')
const CONTROLLI_DIR = join(ROOT, 'docs/design/verifica')

const DEFAULT_TIMEOUT_MS = {
  'locale-prod': 25 * 60 * 1000,
  'locale-dev': 10 * 60 * 1000,
  online: 3 * 60 * 1000,
}

/** @param {string[]} argv process.argv */
export function parseCli(argv) {
  const positional = []
  const flags = {}
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const next = argv[i + 1]
      if (next && !next.startsWith('--')) {
        flags[key] = next
        i++
      } else {
        flags[key] = true
      }
    } else {
      positional.push(a)
    }
  }
  const mode = positional[0] ?? 'all'
  const livelloRaw = flags.livello
  let livello = null
  if (livelloRaw != null && livelloRaw !== true) {
    const n = Number(livelloRaw)
    if (n !== 1 && n !== 2) {
      throw new Error('--livello deve essere 1 o 2')
    }
    livello = n
  }
  const schermata = flags.schermata && flags.schermata !== true ? String(flags.schermata) : null
  const schermate = schermata
    ? new Set(
        schermata
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      )
    : null
  const profili =
    flags.profili && flags.profili !== true
      ? flags.profili.split(',').map((s) => s.trim()).filter(Boolean)
      : null
  const temi =
    flags.temi && flags.temi !== true ? flags.temi.split(',').map((s) => s.trim()).filter(Boolean) : null
  const controlliFile =
    flags.controlli && flags.controlli !== true ? String(flags.controlli) : null

  const soloRaw = flags.solo && flags.solo !== true ? String(flags.solo) : null
  const solo = soloRaw
    ? new Set(
        soloRaw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      )
    : null

  if (livello === 2 && schermate && schermate.size > 1 && !solo?.size) {
    console.error('a livello 2 lancia una schermata per volta, oppure usa --solo')
    process.exit(1)
  }

  if (livello === 1 && !schermate?.size && !solo?.size) {
    throw new Error('Con --livello 1 serve --schermata <id>[,<id>] oppure --solo <id,...>')
  }

  const statiRaw = flags.stati && flags.stati !== true ? String(flags.stati) : null
  const stati = statiRaw
    ? new Set(
        statiRaw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      )
    : null
  if (stati?.size && !solo?.size) {
    throw new Error('--stati richiede --solo (limita la matrice C1/C2/C3 agli stati indicati)')
  }

  return { mode, livello, schermate, profili, temi, controlliFile, solo, stati }
}

export function loadControlli(controlliFileArg) {
  const basename = controlliFileArg ?? pickLatestControlliBasename()
  const path = join(CONTROLLI_DIR, basename)
  const controlli = JSON.parse(readFileSync(path, 'utf8'))
  return { controlli, controlliBasename: basename, controlliPath: path }
}

function pickLatestControlliBasename() {
  const files = readdirSync(CONTROLLI_DIR)
    .filter((f) => /^controlli-.+\.json$/.test(f))
    .sort()
  if (!files.length) throw new Error('Nessun file controlli-*.json in docs/design/verifica/')
  return files.at(-1)
}

export function timeoutMsForAmbiente(ambiente) {
  const envKey = `UI_VERIFY_TIMEOUT_${ambiente.replace(/-/g, '_').toUpperCase()}_MS`
  const fromEnv = process.env[envKey] ?? process.env.UI_VERIFY_TIMEOUT_MS
  if (fromEnv != null && fromEnv !== '') {
    const n = Number(fromEnv)
    if (!Number.isFinite(n) || n <= 0) throw new Error(`Timeout non valido: ${fromEnv}`)
    return n
  }
  return DEFAULT_TIMEOUT_MS[ambiente] ?? 12 * 60 * 1000
}

export class RunTimeoutError extends Error {
  constructor(message = 'Tempo massimo ambiente scaduto') {
    super(message)
    this.name = 'RunTimeoutError'
  }
}

export class RunBudget {
  /** @param {number} ms @param {{ anomalie: string[] }} report */
  constructor(ms, report) {
    this.deadline = Date.now() + ms
    this.report = report
    this.aborted = false
    this.limitMs = ms
  }

  check() {
    if (this.aborted) throw new RunTimeoutError()
    if (Date.now() > this.deadline) {
      this.aborted = true
      const min = Math.round(this.limitMs / 60000)
      this.report.anomalie.push(
        `Tempo massimo ambiente scaduto (${min} min, configurabile con UI_VERIFY_TIMEOUT_MS o UI_VERIFY_TIMEOUT_<AMBIENTE>_MS): esecuzione interrotta.`,
      )
      throw new RunTimeoutError()
    }
  }
}

export function logProgress(parts) {
  logProgressParts(parts)
}
