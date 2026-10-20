import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { test, expect } from '../fixtures'
import {
  checkAltezzaMouse,
  checkNoLampo,
  checkScrollOrizzontale,
  checkTemaCambioSistema,
  checkTemaClasse,
  installNoLampoObserver,
} from '../lib/checks'
import { loginAppOnBase } from '../lib/login-dev'
import {
  C1_PROJECTS,
  C2_MOUSE_PROJECTS,
  C2_PROJECTS,
  C3_CAMBIO_SISTEMA_PROJECTS,
  C3_NO_LAMPO_PROJECTS,
  MATRIX_PROJECTS,
  projectTag,
  SIM_MATRIX_STATES,
} from '../lib/matrix-projects'
import { MENU_LIST_SCREENS, type MenuListScreenId } from '../lib/menu-list/config'
import { assertStateVisible, prepareMenuListState } from '../lib/menu-list/prepare-state'
import { matrixStates, nonProvatoReason, screenshotPlan } from '../lib/menu-list/states'
import { E2E_ESITI_DIR } from '../lib/paths'
import { ensureConsoleDevServer } from '../lib/sim-dev-servers'
import { parseProjectName } from '../lib/project-meta'
import { applyThemeCookie, htmlDarkForTema } from '../lib/theme'

const SCREEN_IDS: MenuListScreenId[] = ['servizi', 'menu-fissi']

function prodStates(screenId: MenuListScreenId): string[] {
  return matrixStates(screenId).filter((s) => !SIM_MATRIX_STATES.has(s))
}

for (const screenId of SCREEN_IDS) {
  const config = MENU_LIST_SCREENS[screenId]
  const stateIds = prodStates(screenId)

  for (const statoId of stateIds) {
    test.describe(`${screenId}/${statoId}`, () => {
    const np = nonProvatoReason(screenId, statoId)

    for (const project of C1_PROJECTS) {
      test(`${screenId} C1 ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
        testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
        if (np) {
          test.skip(true, np)
          return
        }
        const { tema } = parseProjectName(project)
        if (baseURL) await applyThemeCookie(page, baseURL, tema)
        const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker)
        if (!prep.ok) test.skip(true, prep.reason)
        await assertStateVisible(page, config, statoId)
        const r = await checkScrollOrizzontale(page)
        expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
      })
    }

    for (const project of C2_PROJECTS) {
      test(`${screenId} C2 ${projectTag(project)}`, async ({ page, baseURL, touch, payload, payloadWorker }, testInfo) => {
        testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
        if (np) {
          test.skip(true, np)
          return
        }
        const { tema } = parseProjectName(project)
        if (baseURL) await applyThemeCookie(page, baseURL, tema)
        const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker)
        if (!prep.ok) test.skip(true, prep.reason)
        await assertStateVisible(page, config, statoId)
        const bad = await touch.measure()
        expect(bad, `misurato: ${bad.join('; ') || 'nessun elemento'}; atteso: nessun elemento sotto 44 px`).toEqual([])
      })
    }

    for (const project of C2_MOUSE_PROJECTS) {
      test(`${screenId} C2-mouse ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
        testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
        if (np) {
          test.skip(true, np)
          return
        }
        const { tema } = parseProjectName(project)
        if (baseURL) await applyThemeCookie(page, baseURL, tema)
        const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker)
        if (!prep.ok) test.skip(true, prep.reason)
        await assertStateVisible(page, config, statoId)
        const r = await checkAltezzaMouse(page)
        if (!r.ok && r.avviso) testInfo.annotations.push({ type: 'AVVISO', description: r.misurato })
        expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
      })
    }

    for (const project of MATRIX_PROJECTS) {
      test(`${screenId} C3 ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
        testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
        if (np) {
          test.skip(true, np)
          return
        }
        const { tema } = parseProjectName(project)
        if (baseURL) await applyThemeCookie(page, baseURL, tema)
        const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker)
        if (!prep.ok) test.skip(true, prep.reason)
        await assertStateVisible(page, config, statoId)
        const r = await checkTemaClasse(page, htmlDarkForTema(tema))
        expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
      })
    }

    for (const project of C3_NO_LAMPO_PROJECTS) {
      test(`${screenId} C3-no-lampo ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
        testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
        if (np) {
          test.skip(true, np)
          return
        }
        if (baseURL) await installNoLampoObserver(page)
        const { tema } = parseProjectName(project)
        if (baseURL) await applyThemeCookie(page, baseURL, tema)
        const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker)
        if (!prep.ok) test.skip(true, prep.reason)
        await assertStateVisible(page, config, statoId)
        const r = await checkNoLampo(page)
        expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
      })
    }

    if (statoId === 'elenco') {
      for (const project of C3_CAMBIO_SISTEMA_PROJECTS) {
        test(`${screenId} C3-cambio-sistema ${projectTag(project)}`, async ({ page, baseURL }) => {
          if (np) {
            test.skip(true, np)
            return
          }
          const r = await checkTemaCambioSistema(page, baseURL!)
          expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
        })
      }
    }
    })
  }

  for (const statoId of ['vuoto', 'nuovo-senza-categorie'] as const) {
    if (statoId === 'nuovo-senza-categorie' && screenId !== 'menu-fissi') continue
    const reason = nonProvatoReason(screenId, statoId)
    if (!reason) continue
    test(`${screenId} NON PROVATO ${statoId} ${projectTag('telefono-390-chiaro')}`, async ({}, testInfo) => {
      testInfo.annotations.push({ type: 'skip', description: reason })
      test.skip(true, reason)
    })
  }

  const shots = screenshotPlan(screenId).filter((s) => !SIM_MATRIX_STATES.has(s.statoId))
  for (const shot of shots) {
    const project = `${shot.profilo}-${shot.tema}`
    test(`screenshot ${screenId}-${shot.statoId} ${projectTag(project)}`, async ({
      page,
      baseURL,
      payload,
      payloadWorker,
    }) => {
      const np = nonProvatoReason(screenId, shot.statoId)
      if (np) {
        test.skip(true, np)
        return
      }
      if (baseURL) await applyThemeCookie(page, baseURL, shot.tema)
      const prep = await prepareMenuListState(page, config, shot.statoId, payload, payloadWorker)
      if (!prep.ok) test.skip(true, prep.reason)
      await assertStateVisible(page, config, shot.statoId)
      mkdirSync(join(E2E_ESITI_DIR, 'img'), { recursive: true })
      await page.screenshot({
        path: join(E2E_ESITI_DIR, 'img', `${screenId}-${shot.statoId}-${shot.profilo}-${shot.tema}.png`),
        fullPage: true,
      })
    })
  }
}

test(`servizi-console ${projectTag('telefono-390-chiaro')}`, async ({ page }) => {
  const devUrl = await ensureConsoleDevServer()
  await loginAppOnBase(page, devUrl)
  const bag = { errors: [] as string[], warnings: [] as string[], failed: [] as string[] }
  page.on('console', (msg) => {
    if (msg.type() === 'error') bag.errors.push(msg.text())
    if (msg.type() === 'warning') bag.warnings.push(msg.text())
  })
  page.on('pageerror', (e) => bag.errors.push(String(e)))
  await page.goto(`${devUrl}/app/menu/services`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Nuovo servizio' }).click()
  await page.keyboard.press('Escape')
  const misurato = `err:${bag.errors.length} warn:${bag.warnings.length} http:${bag.failed.length}`
  expect(bag.errors, `misurato: ${misurato}; atteso: err:0 warn:0 http:0`).toEqual([])
  expect(bag.warnings, `misurato: ${misurato}; atteso: err:0 warn:0 http:0`).toEqual([])
})

test(`menu-fissi-console ${projectTag('telefono-390-chiaro')}`, async ({ page }) => {
  const devUrl = await ensureConsoleDevServer()
  await loginAppOnBase(page, devUrl)
  const bag = { errors: [] as string[], warnings: [] as string[] }
  page.on('console', (msg) => {
    if (msg.type() === 'error') bag.errors.push(msg.text())
    if (msg.type() === 'warning') bag.warnings.push(msg.text())
  })
  await page.goto(`${devUrl}/app/menu/fixed`, { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: 'Nuovo menù fisso' }).click()
  await page.keyboard.press('Escape')
  const misurato = `err:${bag.errors.length} warn:${bag.warnings.length}`
  expect(bag.errors, `misurato: ${misurato}; atteso: err:0 warn:0`).toEqual([])
  expect(bag.warnings, `misurato: ${misurato}; atteso: err:0 warn:0`).toEqual([])
})
