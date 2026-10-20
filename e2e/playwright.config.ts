import './lib/tsx-loader'

import { config as loadEnv } from 'dotenv'
import { defineConfig, devices } from '@playwright/test'
import { join } from 'node:path'

import { grepForProject } from './lib/matrix-projects'
import { E2E_STORAGE_STATE, REPO_ROOT } from './lib/paths'

loadEnv({ path: join(REPO_ROOT, '.env') })

const BASE_URL = 'http://localhost:3100'

const profiles = [
  { name: 'telefono-390', width: 390, height: 844, scale: 3, touch: true },
  { name: 'notebook-1280', width: 1280, height: 900, scale: 1, touch: false },
  { name: 'soglia-767', width: 767, height: 1000, scale: 2, touch: true },
  { name: 'soglia-768', width: 768, height: 1000, scale: 2, touch: true },
] as const

const themes = [
  { suffix: 'chiaro', colorScheme: 'light' as const },
  { suffix: 'scuro', colorScheme: 'dark' as const },
]

const isControlliSuite = process.env.E2E_SUITE === 'controlli'

const matrixProjects = profiles.flatMap((profile) =>
  themes.map((theme) => {
    const name = `${profile.name}-${theme.suffix}`
    return {
      name,
      ...(isControlliSuite ? { grep: grepForProject(name) } : {}),
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: profile.width, height: profile.height },
        deviceScaleFactor: profile.scale,
        isMobile: profile.touch,
        hasTouch: profile.touch,
        colorScheme: theme.colorScheme,
        baseURL: BASE_URL,
        storageState: E2E_STORAGE_STATE,
      },
    }
  }),
)

export default defineConfig({
  testDir: '.',
  testMatch: isControlliSuite ? ['controlli/**/*.spec.ts'] : ['smoke/**/*.spec.ts'],
  testIgnore: isControlliSuite ? [] : ['**/strumento.spec.ts'],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 4,
  timeout: 60_000,
  globalTimeout: 25 * 60_000,
  expect: { timeout: 15_000 },
  use: {
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
  },
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  reporter: [['list'], ['./reporter/e2e-reporter.ts']],
  projects: matrixProjects,
})
