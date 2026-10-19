import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { runProcess } from './exec'
import { E2E_BUILD_CACHE, NEXT_DIR, REPO_ROOT } from './paths'

const INPUT_PATHS = [
  'app/',
  'components/',
  'lib/',
  'collections/',
  'globals/',
  'payload.config.ts',
  'package.json',
  'pnpm-lock.yaml',
]

export type BuildFingerprint = {
  head: string
  hash: string
  untrackedCount: number
}

async function gitHead(): Promise<string> {
  const r = await runProcess('git', ['rev-parse', 'HEAD'], { cwd: REPO_ROOT, timeoutMs: 30_000 })
  return r.code === 0 ? r.stdout.trim() : ''
}

async function gitDiff(): Promise<string> {
  const r = await runProcess('git', ['diff', 'HEAD', '--', ...INPUT_PATHS], {
    cwd: REPO_ROOT,
    timeoutMs: 120_000,
  })
  return r.stdout ?? ''
}

async function untrackedPaths(): Promise<string[]> {
  const r = await runProcess(
    'git',
    ['ls-files', '--others', '--exclude-standard', '--', ...INPUT_PATHS],
    { cwd: REPO_ROOT, timeoutMs: 60_000 },
  )
  return (r.stdout ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function hashUntrackedContent(paths: string[]): string {
  const h = createHash('sha256')
  for (const rel of paths.sort()) {
    const abs = join(REPO_ROOT, rel)
    try {
      h.update(rel)
      h.update('\0')
      h.update(readFileSync(abs))
      h.update('\0')
    } catch {
      h.update(rel)
      h.update('\0missing\n')
    }
  }
  return h.digest('hex')
}

export async function computeBuildFingerprint(): Promise<BuildFingerprint> {
  const head = await gitHead()
  const diff = await gitDiff()
  const untracked = await untrackedPaths()
  const untrackedHash = hashUntrackedContent(untracked)
  const hash = createHash('sha256')
    .update(head)
    .update('\0')
    .update(diff)
    .update('\0')
    .update(untrackedHash)
    .digest('hex')
  return { head, hash, untrackedCount: untracked.length }
}

export type BuildReuseDecision = {
  reuse: boolean
  fingerprint: BuildFingerprint
  reason: string
}

export async function resolveBuildReuse(): Promise<BuildReuseDecision> {
  const fingerprint = await computeBuildFingerprint()
  if (!existsSync(join(NEXT_DIR, 'BUILD_ID'))) {
    return { reuse: false, fingerprint, reason: 'manca .next (build assente)' }
  }
  if (!existsSync(E2E_BUILD_CACHE)) {
    return { reuse: false, fingerprint, reason: 'nessuna build e2e precedente' }
  }
  try {
    const prev = JSON.parse(readFileSync(E2E_BUILD_CACHE, 'utf8')) as {
      hash?: string
      success?: boolean
    }
    if (prev.hash === fingerprint.hash && prev.success === true) {
      return { reuse: true, fingerprint, reason: 'hash coincidente' }
    }
    return { reuse: false, fingerprint, reason: 'hash diverso o ultima build fallita' }
  } catch {
    return { reuse: false, fingerprint, reason: 'cache build illeggibile' }
  }
}

export function markBuildSuccess(fingerprint: BuildFingerprint): void {
  mkdirSync(NEXT_DIR, { recursive: true })
  writeFileSync(
    E2E_BUILD_CACHE,
    JSON.stringify({
      head: fingerprint.head,
      hash: fingerprint.hash,
      success: true,
      at: new Date().toISOString(),
    }),
    'utf8',
  )
}
