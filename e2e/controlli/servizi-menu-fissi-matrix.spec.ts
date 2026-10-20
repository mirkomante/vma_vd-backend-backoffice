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
import {
  C1_PROJECTS,
  C2_MOUSE_PROJECTS,
  C2_PROJECTS,
  C3_CAMBIO_SISTEMA_PROJECTS,
  C3_NO_LAMPO_PROJECTS,
  MATRIX_PROJECTS,
  projectTag,
} from '../lib/matrix-projects'
import { MENU_LIST_SCREENS, type MenuListScreenId } from '../lib/menu-list/config'
import { assertStateVisible, prepareMenuListState } from '../lib/menu-list/prepare-state'
import {
  matrixStates,
  nonProvatoReason,
  screenshotFileName,
  screenshotPlan,
} from '../lib/menu-list/states'
import { E2E_ESITI_DIR } from '../lib/paths'
import { assertPrepared } from '../lib/prepare-assert'
import { parseProjectName } from '../lib/project-meta'
import { frameStateForScreenshot } from '../lib/screenshot-frame'
import { applyThemeCookie, htmlDarkForTema } from '../lib/theme'

const SCREEN_IDS: MenuListScreenId[] = ['servizi', 'menu-fissi']

function matrixStateIds(screenId: MenuListScreenId): string[] {
  return matrixStates(screenId).filter((s) => !nonProvatoReason(screenId, s))
}

for (const screenId of SCREEN_IDS) {
  const config = MENU_LIST_SCREENS[screenId]
  const stateIds = matrixStateIds(screenId)

  for (const statoId of stateIds) {
    test.describe(`${screenId}/${statoId}`, () => {
      for (const project of C1_PROJECTS) {
        test(`${screenId} C1 ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
          testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
          const { tema } = parseProjectName(project)
          if (baseURL) await applyThemeCookie(page, baseURL, tema)
          const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker)
          assertPrepared(prep)
          await assertStateVisible(page, config, statoId)
          const r = await checkScrollOrizzontale(page)
          expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
        })
      }

      for (const project of C2_PROJECTS) {
        test(`${screenId} C2 ${projectTag(project)}`, async ({ page, baseURL, touch, payload, payloadWorker }, testInfo) => {
          testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
          const { tema } = parseProjectName(project)
          if (baseURL) await applyThemeCookie(page, baseURL, tema)
          const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker)
          assertPrepared(prep)
          await assertStateVisible(page, config, statoId)
          const bad = await touch.measure()
          expect(bad, `misurato: ${bad.join('; ') || 'nessun elemento'}; atteso: nessun elemento sotto 44 px`).toEqual([])
        })
      }

      for (const project of C2_MOUSE_PROJECTS) {
        test(`${screenId} C2-mouse ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
          testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
          const { tema } = parseProjectName(project)
          if (baseURL) await applyThemeCookie(page, baseURL, tema)
          const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker)
          assertPrepared(prep)
          await assertStateVisible(page, config, statoId)
          const r = await checkAltezzaMouse(page)
          if (!r.ok && r.avviso) testInfo.annotations.push({ type: 'AVVISO', description: r.misurato })
          expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
        })
      }

      for (const project of MATRIX_PROJECTS) {
        test(`${screenId} C3 ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
          testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
          const { tema } = parseProjectName(project)
          if (baseURL) await applyThemeCookie(page, baseURL, tema)
          const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker)
          assertPrepared(prep)
          await assertStateVisible(page, config, statoId)
          const r = await checkTemaClasse(page, htmlDarkForTema(tema))
          expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
        })
      }

      for (const project of C3_NO_LAMPO_PROJECTS) {
        test(`${screenId} C3-no-lampo ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
          testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
          if (baseURL) await installNoLampoObserver(page)
          const { tema } = parseProjectName(project)
          if (baseURL) await applyThemeCookie(page, baseURL, tema)
          const prep = await prepareMenuListState(page, config, statoId, payload, payloadWorker)
          assertPrepared(prep)
          await assertStateVisible(page, config, statoId)
          const r = await checkNoLampo(page)
          expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
        })
      }

      if (statoId === 'elenco') {
        for (const project of C3_CAMBIO_SISTEMA_PROJECTS) {
          test(`${screenId} C3-cambio-sistema ${projectTag(project)}`, async ({ page, baseURL }) => {
            const r = await checkTemaCambioSistema(page, baseURL!)
            expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
          })
        }
      }
    })
  }

  const npStates = new Set([
    'vuoto',
    'categorie-vuoto',
    'nuovo-senza-categorie',
    'caricamento',
    'errore-caricamento',
    'errore-azione',
  ])
  for (const statoId of npStates) {
    if (statoId === 'nuovo-senza-categorie' && screenId !== 'menu-fissi') continue
    if (statoId === 'categorie-vuoto' && screenId !== 'menu-fissi') continue
    const reason = nonProvatoReason(screenId, statoId)
    if (!reason) continue
    test(`${screenId} NON PROVATO ${statoId} ${projectTag('telefono-390-chiaro')}`, async ({}, testInfo) => {
      testInfo.annotations.push({ type: 'skip', description: reason })
      test.skip(true, reason)
    })
  }

  test(`${screenId}-console NON PROVATO ${projectTag('telefono-390-chiaro')}`, async ({}, testInfo) => {
    testInfo.annotations.push({
      type: 'skip',
      description: 'le riprova V6 con un dev server alla volta',
    })
    test.skip(true, 'le riprova V6 con un dev server alla volta')
  })

  const shots = screenshotPlan(screenId).filter((s) => !nonProvatoReason(screenId, s.statoId))
  for (const shot of shots) {
    const project = `${shot.profilo}-${shot.tema}`
    test(`screenshot ${screenId}-${shot.shotKey} ${projectTag(project)}`, async ({
      page,
      baseURL,
      payload,
      payloadWorker,
    }) => {
      if (baseURL) await applyThemeCookie(page, baseURL, shot.tema)
      const prep = await prepareMenuListState(page, config, shot.statoId, payload, payloadWorker)
      assertPrepared(prep)
      await assertStateVisible(page, config, shot.statoId)
      await frameStateForScreenshot(page, shot.shotKey)
      mkdirSync(join(E2E_ESITI_DIR, 'img'), { recursive: true })
      await page.screenshot({
        path: join(E2E_ESITI_DIR, 'img', screenshotFileName(screenId, shot)),
        fullPage: true,
      })
    })
  }
}
