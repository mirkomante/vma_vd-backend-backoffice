import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { APP_NAV_GROUPS } from '@/lib/app/navigation'

import { test, expect } from '../fixtures'
import { E2E_ESITI_DIR } from '../lib/paths'

const NAV_LABELS = APP_NAV_GROUPS.flatMap((g) => g.items.filter((i) => i.enabled).map((i) => i.label))

test.beforeEach(async ({ page, baseURL }) => {
  const url = baseURL ?? 'http://localhost:3100'
  await page.context().addCookies([{ name: 'app-theme', value: 'light', url }])
})

test('sessione: storageState apre /app senza login', async ({ page }) => {
  await page.goto('/app', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Oggi|Area App/)
  await expect(page.getByRole('button', { name: 'Accedi' })).toHaveCount(0)
})

test('home: titolo e voci barra laterale', async ({ page }, testInfo) => {
  await page.goto('/app', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1, name: 'Oggi' })).toBeVisible()
  if (testInfo.project.use.isMobile) {
    const trigger = page.getByRole('button', { name: 'Apri o chiudi il menu' })
    await trigger.click()
    await expect(page.locator('[data-sidebar="sidebar"][data-mobile="true"]')).toBeVisible()
  }
  for (const label of NAV_LABELS) {
    await expect(page.getByRole('link', { name: label, exact: true })).toBeVisible()
  }
})

test('tocco-minimo 390: nessun controllo sotto 44×44', async ({ page, touch }) => {
  test.skip(
    test.info().project.name !== 'telefono-390-chiaro',
    'misura tocco solo su telefono-390-chiaro',
  )
  await page.goto('/app', { waitUntil: 'domcontentloaded' })
  const bad = await touch.measure()
  expect(bad, `elementi sotto soglia: ${bad.join('; ')}`).toEqual([])
})

test('console pulita sulla home', async ({ page, consoleWatcher }) => {
  await page.goto('/app', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(consoleWatcher.errors, consoleWatcher.errors.join(' | ')).toEqual([])
  expect(consoleWatcher.warnings, consoleWatcher.warnings.join(' | ')).toEqual([])
  expect(consoleWatcher.failed, consoleWatcher.failed.join(' | ')).toEqual([])
})

test('screenshot home telefono-390 chiaro', async ({ page }) => {
  test.skip(test.info().project.name !== 'telefono-390-chiaro', 'screenshot smoke singolo')
  await page.goto('/app', { waitUntil: 'domcontentloaded' })
  mkdirSync(join(E2E_ESITI_DIR, 'img'), { recursive: true })
  await page.screenshot({
    path: join(E2E_ESITI_DIR, 'img', 'home-default-telefono-390-chiaro.png'),
    fullPage: true,
  })
})
