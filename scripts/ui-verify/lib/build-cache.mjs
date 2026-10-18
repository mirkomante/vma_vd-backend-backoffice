import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

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

function cachePath(root) {
  return join(root, '.next/ui-verify-build.json')
}

function gitHead(root) {
  const r = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' })
  return r.status === 0 ? r.stdout.trim() : ''
}

function gitDiff(root) {
  const r = spawnSync('git', ['diff', 'HEAD', '--', ...INPUT_PATHS], { cwd: root, encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 })
  return r.stdout ?? ''
}

function untrackedPaths(root) {
  const r = spawnSync('git', ['ls-files', '--others', '--exclude-standard', '--', ...INPUT_PATHS], {
    cwd: root,
    encoding: 'utf8',
  })
  return (r.stdout ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function hashUntrackedContent(root, paths) {
  const h = createHash('sha256')
  for (const rel of paths.sort()) {
    const abs = join(root, rel)
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

/** @param {string} root */
export function computeBuildFingerprint(root) {
  const head = gitHead(root)
  const diff = gitDiff(root)
  const untracked = untrackedPaths(root)
  const untrackedHash = hashUntrackedContent(root, untracked)
  const hash = createHash('sha256')
    .update(head)
    .update('\0')
    .update(diff)
    .update('\0')
    .update(untrackedHash)
    .digest('hex')
  return { head, hash, untrackedCount: untracked.length }
}

/**
 * @param {string} root
 * @returns {{ reuse: boolean, fingerprint: ReturnType<typeof computeBuildFingerprint>, reason: string }}
 */
export function resolveBuildReuse(root) {
  const fingerprint = computeBuildFingerprint(root)
  const nextDir = join(root, '.next')
  if (!existsSync(join(nextDir, 'BUILD_ID'))) {
    return { reuse: false, fingerprint, reason: 'manca .next (build assente)' }
  }
  const cacheFile = cachePath(root)
  if (!existsSync(cacheFile)) {
    return { reuse: false, fingerprint, reason: 'nessuna build ui-verify precedente' }
  }
  try {
    const prev = JSON.parse(readFileSync(cacheFile, 'utf8'))
    if (prev.hash === fingerprint.hash && prev.success === true) {
      return { reuse: true, fingerprint, reason: 'hash coincidente' }
    }
    return { reuse: false, fingerprint, reason: 'hash diverso o ultima build fallita' }
  } catch {
    return { reuse: false, fingerprint, reason: 'cache build illeggibile' }
  }
}

/** @param {string} root @param {{ head: string, hash: string }} fingerprint */
export function markBuildSuccess(root, fingerprint) {
  mkdirSync(join(root, '.next'), { recursive: true })
  writeFileSync(
    cachePath(root),
    JSON.stringify({
      head: fingerprint.head,
      hash: fingerprint.hash,
      success: true,
      at: new Date().toISOString(),
    }),
    'utf8',
  )
}
