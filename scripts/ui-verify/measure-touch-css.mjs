#!/usr/bin/env node
/**
 * Misura altezza «Nuovo piatto» su /app/menu (profilo telefono-390) e matchMedia pointer/hover.
 * Uso: node scripts/ui-verify/measure-touch-css.mjs [--no-matchmedia-override]
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { chromium } from '@playwright/test'

import { loadControlli } from './lib/cli.mjs'
import { prodBaseUrl } from './lib/ports.mjs'
async function installPointerCoarseMatchMediaOverride(context) {
  await context.addInitScript(() => {
    const orig = window.matchMedia.bind(window)
    window.matchMedia = (query) => {
      const result = orig(query)
      const q = String(query)
      if (/\(\s*pointer\s*:\s*coarse\s*\)/.test(q)) {
        return Object.assign({}, result, { matches: true, media: q })
      }
      if (/\(\s*pointer\s*:\s*fine\s*\)/.test(q)) {
        return Object.assign({}, result, { matches: false, media: q })
      }
      return result
    }
  })
}

const ROOT = join(import.meta.dirname, '../..')
const OUT_DIR = join(ROOT, 'docs/design/verifica/esiti/2026-10-18-controlli')
const noOverride = process.argv.includes('--no-matchmedia-override')
const desktopContext = process.argv.includes('--desktop-context')
const desktopWithOverride = process.argv.includes('--desktop-with-override')

const { controlli: CONTROLLI } = loadControlli('controlli-6.6.json')
const profiloKey = 'telefono-390'
const baseUrl = prodBaseUrl()

function parsePayloadStdout(stdout) {
  const line = stdout.trim().split('\n').find((l) => l.startsWith('{'))
  if (!line) throw new Error(`Output JSON mancante: ${stdout.slice(0, 120)}`)
  return JSON.parse(line)
}

function profileContextOptions(key) {
  const p = CONTROLLI.profili[key]
  return {
    viewport: { width: p.larghezza, height: p.altezza },
    deviceScaleFactor: p.scala,
    isMobile: p.tocco,
    hasTouch: p.tocco,
  }
}

async function loginApp(page, email, password) {
  await page.goto('/app/login', { waitUntil: 'networkidle' })
  await page.fill('input[name=email]', email)
  await page.fill('input[name=password]', password)
  await page.getByRole('button', { name: 'Accedi' }).click()
  await page.waitForURL(/\/app\/?$/, { timeout: 20000 })
}

async function measure(label) {
  const password = `Aa1${randomBytes(16).toString('base64url')}`
  const pr = spawnSync('pnpm', ['payload', 'run', 'scripts/ui-verify/provision-user.ts', '--', 'create'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, UI_VERIFY_USER_PASSWORD: password },
  })
  if (pr.status !== 0) throw new Error(`provision: ${pr.stderr || pr.stdout}`)
  const email = parsePayloadStdout(pr.stdout).email

  const browser = await chromium.launch()
  const touchOpts =
    desktopContext || desktopWithOverride
      ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: false, hasTouch: false }
      : profileContextOptions(profiloKey)
  const ctx = await browser.newContext({
    ...touchOpts,
    colorScheme: 'light',
    baseURL: baseUrl,
  })
  await ctx.addCookies([{ name: 'app-theme', value: 'light', url: baseUrl }])
  if (!noOverride && (desktopWithOverride || (!desktopContext && CONTROLLI.profili[profiloKey]?.tocco))) {
    await installPointerCoarseMatchMediaOverride(ctx)
  }
  const page = await ctx.newPage()
  await loginApp(page, email, password)
  await page.goto('/app/menu', { waitUntil: 'networkidle' })
  await page.locator('h1', { hasText: 'Piatti' }).waitFor({ timeout: 30000 })

  const data = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('main button')].find((b) => b.textContent?.includes('Nuovo piatto'))
    const r = btn?.getBoundingClientRect()
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const hover = window.matchMedia('(hover: hover)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    return {
      cssHeightPx: r ? Math.round(r.height) : null,
      cssWidthPx: r ? Math.round(r.width) : null,
      matchMedia: { coarse, hover, fine },
    }
  })

  mkdirSync(OUT_DIR, { recursive: true })
  const shotName = `misura-touch-${label}-piatti-elenco-telefono-390-chiaro.png`
  await page.screenshot({ path: join(OUT_DIR, shotName), fullPage: false })
  await ctx.close()
  await browser.close()

  spawnSync('pnpm', ['payload', 'run', 'scripts/ui-verify/provision-user.ts', '--', 'delete', email], {
    cwd: ROOT,
    encoding: 'utf8',
  })

  return { ...data, screenshot: shotName }
}

async function waitForUrl(url, ms = 180000) {
  const start = Date.now()
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url, { redirect: 'manual' })
      if (res.status < 500) return
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 800))
  }
  throw new Error(`Server non raggiungibile: ${url}`)
}

async function main() {
  await waitForUrl(baseUrl)
  const label = desktopContext
    ? 'solo-matchmedia-override-senza-tocco'
    : noOverride
      ? 'dopo-senza-override'
      : 'prima-con-override'
  const result = await measure(label)
  const jsonName = desktopContext
    ? 'misura-touch-solo-override.json'
    : noOverride
      ? 'misura-touch-dopo.json'
      : 'misura-touch-prima.json'
  writeFileSync(join(OUT_DIR, jsonName), JSON.stringify(result, null, 2))
  console.log(JSON.stringify(result, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
