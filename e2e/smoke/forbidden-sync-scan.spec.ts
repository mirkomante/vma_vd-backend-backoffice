import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { test, expect } from '../fixtures'
import { REPO_ROOT } from '../lib/paths'

const PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /\bspawnSync\s*\(/, label: 'spawnSync' },
  { re: /\bexecSync\s*\(/, label: 'execSync' },
  { re: /\bexecFileSync\s*\(/, label: 'execFileSync' },
  { re: /\bAtomics\.wait\s*\(/, label: 'Atomics.wait' },
  { re: /\breadSync\s*\(/, label: 'readSync' },
]

const SELF = 'e2e/smoke/forbidden-sync-scan.spec.ts'

async function listTsFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const abs = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listTsFiles(abs)))
    } else if (entry.name.endsWith('.ts')) {
      files.push(abs)
    }
  }
  return files
}

test('R1: nessuna chiamata sincrona vietata in e2e/', async () => {
  const e2eRoot = join(REPO_ROOT, 'e2e')
  const files = await listTsFiles(e2eRoot)
  const hits: string[] = []
  for (const file of files) {
    const rel = file.replace(`${REPO_ROOT}/`, '')
    if (rel === SELF) continue
    const src = await readFile(file, 'utf8')
    for (const { re, label } of PATTERNS) {
      if (re.test(src)) {
        hits.push(`${rel}: ${label}`)
      }
    }
  }
  expect(hits, hits.join('\n')).toEqual([])
})
