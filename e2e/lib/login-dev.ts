import { readFileSync } from 'node:fs'

import type { Page } from '@playwright/test'

import { E2E_RUN_META } from './paths'

function credentials(): { email: string; password: string } {
  const raw = JSON.parse(readFileSync(E2E_RUN_META, 'utf8')) as {
    userEmail?: string
    probePassword?: string
  }
  if (!raw.userEmail || !raw.probePassword) {
    throw new Error('credenziali di prova mancanti in e2e-run.json (rilanciare global-setup)')
  }
  return { email: raw.userEmail, password: raw.probePassword }
}

export async function loginAppOnBase(page: Page, baseUrl: string): Promise<void> {
  const { email, password } = credentials()
  await page.goto(`${baseUrl}/app/login`, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await page.fill('input[name=email]', email)
  await page.fill('input[name=password]', password)
  await page.getByRole('button', { name: 'Accedi' }).click()
  await page.waitForURL(/\/app\/?$/, { timeout: 30_000 })
}
