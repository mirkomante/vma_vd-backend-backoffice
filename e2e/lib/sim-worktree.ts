import { access, cp, mkdir, rm, symlink } from 'node:fs/promises'
import { join } from 'node:path'

import { runProcess } from './exec'
import { REPO_ROOT } from './paths'

const ISOLATES_DIR = join(REPO_ROOT, 'e2e', '.sim-isolates')

/** Root per `next dev` (un processo per directory). */
export async function devRootForPort(port: number): Promise<string> {
  if (port === 3200) return REPO_ROOT

  const dir = join(ISOLATES_DIR, String(port))
  await mkdir(ISOLATES_DIR, { recursive: true })

  try {
    await access(join(dir, 'package.json'))
    return dir
  } catch {
    const r = await runProcess('git', ['worktree', 'add', '--detach', dir, 'HEAD'], {
      cwd: REPO_ROOT,
      timeoutMs: 120_000,
    })
    if (r.code !== 0) {
      throw new Error(`git worktree add (${port}): ${r.stderr.slice(0, 300)}`)
    }
    await cp(join(REPO_ROOT, 'node_modules'), join(dir, 'node_modules'), {
      recursive: true,
      force: true,
      dereference: false,
    })
    await rm(join(dir, 'node_modules', '@playwright'), { recursive: true, force: true })
    await rm(join(dir, 'node_modules', 'playwright'), { recursive: true, force: true })
    for (const envFile of ['.env', '.env.development.local', '.env.local']) {
      try {
        await symlink(join(REPO_ROOT, envFile), join(dir, envFile))
      } catch {
        /* opzionale */
      }
    }
    return dir
  }
}
