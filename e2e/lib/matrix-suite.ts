import type { Page } from '@playwright/test'
import { test, expect } from '../fixtures'
import {
  checkAltezzaMouse,
  checkNoLampo,
  checkScrollOrizzontale,
  checkTemaCambioSistema,
  checkTemaClasse,
  installNoLampoObserver,
} from './checks'
import {
  C1_PROJECTS,
  C2_MOUSE_PROJECTS,
  C2_PROJECTS,
  C3_CAMBIO_SISTEMA_PROJECTS,
  C3_NO_LAMPO_PROJECTS,
  MATRIX_PROJECTS,
  projectTag,
} from './matrix-projects'
import { assertPrepared } from './prepare-assert'
import { parseProjectName } from './project-meta'
import { applyThemeCookie, htmlDarkForTema } from './theme'
import type { PrepareOutcome } from './catalog/prepare-state'

export type MatrixPrepareArgs = {
  page: Page
  baseURL: string | undefined
  payload: import('../fixtures').PayloadFixture
  payloadWorker: import('payload').Payload
}

export type MatrixScreenConfig = {
  screenId: string
  stateIds: string[]
  nonProvato: (statoId: string) => string | null
  prepare: (args: MatrixPrepareArgs, statoId: string) => Promise<PrepareOutcome>
  assertVisible: (page: Page, statoId: string) => Promise<void>
  /** Ripristino opzionale (es. Global menu-general) attorno a ogni test. */
  withIsolation?: (args: MatrixPrepareArgs, run: () => Promise<void>) => Promise<void>
}

export function registerC1C2C3Matrix(config: MatrixScreenConfig): void {
  const { screenId, stateIds, nonProvato, prepare, assertVisible, withIsolation } = config

  for (const statoId of stateIds) {
    test.describe(`${screenId}/${statoId}`, () => {
      const runBody = async (
        args: MatrixPrepareArgs,
        body: () => Promise<void>,
      ): Promise<void> => {
        if (withIsolation) {
          await withIsolation(args, body)
        } else {
          await body()
        }
      }

      for (const project of C1_PROJECTS) {
        test(`${screenId} C1 ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
          testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
          const { tema } = parseProjectName(project)
          await runBody({ page, baseURL, payload, payloadWorker }, async () => {
            if (baseURL) await applyThemeCookie(page, baseURL, tema)
            const prep = await prepare({ page, baseURL, payload, payloadWorker }, statoId)
            assertPrepared(prep)
            await assertVisible(page, statoId)
            const r = await checkScrollOrizzontale(page)
            expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
          })
        })
      }

      for (const project of C2_PROJECTS) {
        test(`${screenId} C2 ${projectTag(project)}`, async ({ page, baseURL, touch, payload, payloadWorker }, testInfo) => {
          testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
          const { tema } = parseProjectName(project)
          await runBody({ page, baseURL, payload, payloadWorker }, async () => {
            if (baseURL) await applyThemeCookie(page, baseURL, tema)
            const prep = await prepare({ page, baseURL, payload, payloadWorker }, statoId)
            assertPrepared(prep)
            await assertVisible(page, statoId)
            const bad = await touch.measure()
            expect(bad, `misurato: ${bad.join('; ') || 'nessun elemento'}; atteso: nessun elemento sotto 44 px`).toEqual([])
          })
        })
      }

      for (const project of C2_MOUSE_PROJECTS) {
        test(`${screenId} C2-mouse ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
          testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
          const { tema } = parseProjectName(project)
          await runBody({ page, baseURL, payload, payloadWorker }, async () => {
            if (baseURL) await applyThemeCookie(page, baseURL, tema)
            const prep = await prepare({ page, baseURL, payload, payloadWorker }, statoId)
            assertPrepared(prep)
            await assertVisible(page, statoId)
            const r = await checkAltezzaMouse(page)
            if (!r.ok && r.avviso) testInfo.annotations.push({ type: 'AVVISO', description: r.misurato })
            expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
          })
        })
      }

      for (const project of MATRIX_PROJECTS) {
        test(`${screenId} C3 ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
          testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
          const { tema } = parseProjectName(project)
          await runBody({ page, baseURL, payload, payloadWorker }, async () => {
            if (baseURL) await applyThemeCookie(page, baseURL, tema)
            const prep = await prepare({ page, baseURL, payload, payloadWorker }, statoId)
            assertPrepared(prep)
            await assertVisible(page, statoId)
            const r = await checkTemaClasse(page, htmlDarkForTema(tema))
            expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
          })
        })
      }

      for (const project of C3_NO_LAMPO_PROJECTS) {
        test(`${screenId} C3-no-lampo ${projectTag(project)}`, async ({ page, baseURL, payload, payloadWorker }, testInfo) => {
          testInfo.annotations.push({ type: 'schermata', description: `${screenId}/${statoId}` })
          await runBody({ page, baseURL, payload, payloadWorker }, async () => {
            if (baseURL) await installNoLampoObserver(page)
            const { tema } = parseProjectName(project)
            if (baseURL) await applyThemeCookie(page, baseURL, tema)
            const prep = await prepare({ page, baseURL, payload, payloadWorker }, statoId)
            assertPrepared(prep)
            await assertVisible(page, statoId)
            const r = await checkNoLampo(page)
            expect(r.ok, `misurato: ${r.misurato}; atteso: ${r.atteso}`).toBe(true)
          })
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

  const sim = new Set(['caricamento', 'errore-caricamento', 'errore-azione', 'vuoto'])
  for (const statoId of sim) {
    const reason = nonProvato(statoId)
    if (!reason) continue
    test(`${screenId} NON PROVATO ${statoId} ${projectTag('telefono-390-chiaro')}`, async ({}, testInfo) => {
      testInfo.annotations.push({ type: 'skip', description: reason })
      test.skip(true, reason)
    })
  }
}
