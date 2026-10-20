import './lib/tsx-loader'

import { randomBytes } from 'node:crypto'
import { type ChildProcess, spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

import { chromium } from '@playwright/test'

import { markBuildSuccess, resolveBuildReuse } from './lib/build-fingerprint'
import { acquireE2eLock, updateLockRunId } from './lib/lock'
import { runProcess } from './lib/exec'
import {
  E2E_ESITI_DIR,
  E2E_PROGRESS_LOG,
  E2E_RUN_META,
  E2E_STORAGE_STATE,
  NEXT_DIR,
  REPO_ROOT,
} from './lib/paths'
import { generateTestPassword, provisionTestUser, withPayloadForSetup } from './lib/provision-test-user'
import { waitForUrl } from './lib/wait-url'

const PROD_PORT = '3100'
const BASE_URL = `http://localhost:${PROD_PORT}`

function startProdServer(): ChildProcess {
  return spawn('pnpm', ['start'], {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      PORT: PROD_PORT,
      PAYLOAD_DISABLE_PUSH: '1',
      NODE_ENV: 'production',
    },
    stdio: 'ignore',
  })
}

export default async function globalSetup(): Promise<void> {
  process.env.PAYLOAD_DISABLE_PUSH = '1'
  acquireE2eLock()

  const runId = randomBytes(4).toString('hex')
  updateLockRunId(runId)

  mkdirSync(NEXT_DIR, { recursive: true })
  mkdirSync(E2E_ESITI_DIR, { recursive: true })
  writeFileSync(E2E_PROGRESS_LOG, '', 'utf8')

  const build = await resolveBuildReuse()
  if (!build.reuse) {
    const r = await runProcess('pnpm', ['build'], {
      cwd: REPO_ROOT,
      timeoutMs: 25 * 60_000,
      env: { ...process.env, PAYLOAD_DISABLE_PUSH: '1' },
    })
    if (r.code !== 0) {
      throw new Error(`pnpm build fallito: ${r.stderr.slice(0, 400)}`)
    }
    markBuildSuccess(build.fingerprint)
  }

  const password = generateTestPassword()
  const created = await withPayloadForSetup((payload) => provisionTestUser(payload, password))

  const setupServer = startProdServer()
  await waitForUrl(BASE_URL)

  const browser = await chromium.launch()
  const context = await browser.newContext({ baseURL: BASE_URL })
  const page = await context.newPage()
  await page.goto('/app/login', { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.fill('input[name=email]', created.email)
  await page.fill('input[name=password]', password)
  await page.getByRole('button', { name: 'Accedi' }).click()
  await page.waitForURL(/\/app\/?$/, { timeout: 30_000 })
  await context.storageState({ path: E2E_STORAGE_STATE })
  await browser.close()

  writeFileSync(
    E2E_RUN_META,
    JSON.stringify({
      runId,
      userEmail: created.email,
      userId: created.id,
      probePassword: password,
      startedAt: new Date().toISOString(),
      buildReuse: build.reuse,
      buildReason: build.reason,
      setupServerPid: setupServer.pid ?? null,
    }),
    'utf8',
  )

}
