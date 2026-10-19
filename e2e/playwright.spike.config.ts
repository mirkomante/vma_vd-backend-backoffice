import { config as loadEnv } from 'dotenv'
import { defineConfig } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
loadEnv({ path: path.join(root, '..', '.env') })

export default defineConfig({
  testDir: path.join(root, 'spike'),
  timeout: 60_000,
  workers: 1,
  fullyParallel: false,
  reporter: 'line',
})
