#!/usr/bin/env node
/**
 * Avvia Playwright con --import tsx risolto dal package `payload` (nessun percorso pnpm store).
 */
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { config as loadEnv } from 'dotenv'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
loadEnv({ path: join(ROOT, '.env') })
const payloadEntry = createRequire(join(ROOT, 'package.json')).resolve('payload')
const requireFromPayload = createRequire(payloadEntry)
const tsxUrl = pathToFileURL(requireFromPayload.resolve('tsx/esm')).href

const playwrightCli = join(ROOT, 'node_modules/@playwright/test/cli.js')
const args = ['--import', tsxUrl, playwrightCli, 'test', '-c', 'e2e/playwright.config.ts', ...process.argv.slice(2)]

const child = spawn(process.execPath, args, {
  cwd: ROOT,
  stdio: 'inherit',
  env: {
    ...process.env,
    PAYLOAD_DISABLE_PUSH: '1',
  },
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 1)
})
