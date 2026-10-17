import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = join(import.meta.dirname, '../../..')

function parsePayloadStdout(stdout) {
  const line = stdout.trim().split('\n').find((l) => l.startsWith('{'))
  if (!line) throw new Error(`Output JSON mancante: ${stdout.slice(0, 160)}`)
  return JSON.parse(line)
}

/** Attesi navigazione e home da lib/ (menu-nav-expectations.ts). */
export function loadNavExpectations() {
  const r = spawnSync('pnpm', ['payload', 'run', 'scripts/ui-verify/menu-nav-expectations.ts'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env },
  })
  if (r.status !== 0) {
    throw new Error(`menu-nav-expectations: ${(r.stderr || r.stdout).slice(0, 400)}`)
  }
  return parsePayloadStdout(r.stdout)
}

export function shellHomeTestiAttesoFromControlli(controlli) {
  const shell = controlli.schermate?.find((s) => s.id === 'shell')
  const ctrl = shell?.controlli?.find((c) => c.id === 'home-testi')
  return ctrl?.atteso ?? null
}

/** Cerca export stringa in un file TS (costanti di lib/). */
export function readTsStringExport(relPath, exportName) {
  const path = join(ROOT, relPath)
  if (!existsSync(path)) return null
  const src = readFileSync(path, 'utf8')
  const re = new RegExp(`export const ${exportName}\\s*=\\s*['\`]([^'\`]+)['\`]`)
  return src.match(re)?.[1] ?? null
}

/** Messaggi UI piatti da lib/ quando il modulo esiste (chat I2). */
export function loadPiattiCopyFromLib() {
  const candidates = [
    'lib/menu/ui/dishes/copy.ts',
    'lib/menu/ui/copy.ts',
    'lib/menu/dishes/copy.ts',
  ]
  for (const rel of candidates) {
    const path = join(ROOT, rel)
    if (!existsSync(path)) continue
    const src = readFileSync(path, 'utf8')
    const exports = {}
    for (const m of src.matchAll(/export const (\w+)\s*=\s*['`]([^'`]+)['`]/g)) {
      exports[m[1]] = m[2]
    }
    if (Object.keys(exports).length) return { path: rel, exports }
  }
  return null
}
