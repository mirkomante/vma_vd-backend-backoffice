import { test, expect } from '../fixtures'
import { installMenuRebuildRouteStub, removeMenuRebuildRouteStub } from '../lib/menu-rebuild-stub'
import { projectTag } from '../lib/matrix-projects'
import { deleteDishByName } from '../lib/dishes/payload-helpers'
import { DISHES_SLUG } from '@/lib/menu/constants'
import { BEVANDE_NEW_BUTTON } from '@/lib/menu/drinks/copy'
import {
  PIATTI_DELETE_CONFIRM,
  PIATTI_FORM_CATEGORY,
  PIATTI_FORM_SAVE,
  PIATTI_NEW_BUTTON,
  PIATTI_PAGE_TITLE,
  PIATTI_REBUILD_HINT_DELETED,
  PIATTI_REBUILD_HINT_SAVED,
  PIATTI_TOAST_DELETED,
  PIATTI_TOAST_SAVED_NEW,
} from '@/lib/menu/dishes/copy'
import { DISTILLATI_NEW_BUTTON } from '@/lib/menu/spirits/copy'
import { MENU_FISSI_NEW_BUTTON, MENU_FISSI_PAGE_TITLE, MENU_FISSI_TAB_CATEGORIES } from '@/lib/menu/fixed-menus/copy'
import { SERVIZI_NEW_BUTTON } from '@/lib/menu/services/copy'
import { SPECIAL_DAYS_NEW_BUTTON } from '@/lib/menu/specialDays/copy'
import { VINI_NEW_BUTTON } from '@/lib/menu/wines/copy'
import {
  MENU_REBUILD_CONFIRM_LOADING_LABEL,
  MENU_REBUILD_OUTCOME_ALREADY_STARTED,
  MENU_REBUILD_OUTCOME_ERROR,
  MENU_REBUILD_OUTCOME_STARTED,
} from '@/lib/menu/rebuild/copy'

const NOTEBOOK = projectTag('notebook-1280-chiaro')

const REBUILD_BUTTON = 'Ricompila il menù pubblico'
const DIALOG_TITLE = 'Ricompilare il menù pubblico?'
const DIALOG_BODY =
  'La pubblicazione richiede alcuni minuti. Serve per vedere piatti nuovi e modifiche ai contenuti, ai servizi, agli orari, alle chiusure e ai giorni speciali. «Terminato» e «disabilitato» valgono già.'

type ScreenPresence = {
  path: string
  h1: string
  newButton: string
  ricompilaControl: string
  azioniControl: string
}

const SCREENS: ScreenPresence[] = [
  {
    path: '/app/menu',
    h1: PIATTI_PAGE_TITLE,
    newButton: PIATTI_NEW_BUTTON,
    ricompilaControl: 'piatti-ricompila',
    azioniControl: 'piatti-azioni-pagina',
  },
  {
    path: '/app/menu/wines',
    h1: 'Vini',
    newButton: VINI_NEW_BUTTON,
    ricompilaControl: 'vini-ricompila',
    azioniControl: 'vini-azioni-pagina',
  },
  {
    path: '/app/menu/spirits',
    h1: 'Distillati',
    newButton: DISTILLATI_NEW_BUTTON,
    ricompilaControl: 'distillati-ricompila',
    azioniControl: 'distillati-azioni-pagina',
  },
  {
    path: '/app/menu/drinks',
    h1: 'Bevande',
    newButton: BEVANDE_NEW_BUTTON,
    ricompilaControl: 'bevande-ricompila',
    azioniControl: 'bevande-azioni-pagina',
  },
  {
    path: '/app/menu/fixed',
    h1: MENU_FISSI_PAGE_TITLE,
    newButton: MENU_FISSI_NEW_BUTTON,
    ricompilaControl: 'menu-fissi-ricompila',
    azioniControl: 'menu-fissi-azioni-pagina',
  },
  {
    path: '/app/menu/services',
    h1: 'Servizi',
    newButton: SERVIZI_NEW_BUTTON,
    ricompilaControl: 'servizi-ricompila',
    azioniControl: 'servizi-azioni-pagina',
  },
  {
    path: '/app/menu/special-days',
    h1: 'Giorni speciali',
    newButton: SPECIAL_DAYS_NEW_BUTTON,
    ricompilaControl: 'giorni-speciali-ricompila',
    azioniControl: 'giorni-speciali-azioni-pagina',
  },
]

test.describe.configure({ mode: 'serial' })

test.describe('Ricompila 6.5 I2', () => {
  test.beforeEach(async ({ page }) => {
    await installMenuRebuildRouteStub(page)
  })

  test.afterEach(async ({ page }) => {
    await removeMenuRebuildRouteStub(page)
  })

  // control:RICOMPILA-PRESENTE
  test(`ricompila-presenza-sette-intestazioni ${NOTEBOOK}`, async ({ page }) => {
    for (const screen of SCREENS) {
      await page.goto(screen.path, { waitUntil: 'domcontentloaded' })
      await page.getByRole('heading', { level: 1, name: screen.h1 }).waitFor({ timeout: 20_000 })
      await expect(
        page.getByRole('button', { name: REBUILD_BUTTON, exact: true }),
        `${screen.ricompilaControl}: pulsante mancante su ${screen.path}`,
      ).toBeVisible()
    }

    await page.goto('/app/menu/fixed/categories', { waitUntil: 'domcontentloaded' })
    await page.getByRole('heading', { level: 1, name: MENU_FISSI_PAGE_TITLE }).waitFor({ timeout: 20_000 })
    await expect(page.getByRole('tab', { name: MENU_FISSI_TAB_CATEGORIES })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('button', { name: REBUILD_BUTTON, exact: true })).toBeVisible()
  })

  // control:RICOMPILA-PRESENTE
  test(`ricompila-assente-home-e-messaggio ${NOTEBOOK}`, async ({ page }) => {
    await page.goto('/app', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('button', { name: REBUILD_BUTTON })).toHaveCount(0)

    await page.goto('/app/menu/message', { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('button', { name: REBUILD_BUTTON })).toHaveCount(0)
    await expect(page.getByText('serve «Ricompila il menù pubblico»')).toHaveCount(0)
  })

  // control:piatti-ricompila
  test(`ricompila-finestra-testi-e-esiti ${NOTEBOOK}`, async ({ page }) => {
    await removeMenuRebuildRouteStub(page)
    await installMenuRebuildRouteStub(page, { mode: 'started', delayMs: 400 })
    await page.goto('/app/menu', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: REBUILD_BUTTON, exact: true }).click()
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await expect(page.getByRole('heading', { name: DIALOG_TITLE })).toBeVisible()
    await expect(page.getByText(DIALOG_BODY)).toBeVisible()

    const confirm = page.getByRole('button', { name: 'Ricompila', exact: true })
    await confirm.click()
    const loading = page.getByRole('button', { name: MENU_REBUILD_CONFIRM_LOADING_LABEL })
    await expect(loading).toBeVisible()
    await expect(loading).toBeDisabled()
    await expect(page.getByText(MENU_REBUILD_OUTCOME_STARTED)).toBeVisible({ timeout: 15_000 })

    await page.getByRole('button', { name: 'Chiudi' }).click()
    await expect(page.getByRole('alertdialog')).toHaveCount(0)

    await removeMenuRebuildRouteStub(page)
    await installMenuRebuildRouteStub(page, { mode: 'already-started' })
    await page.getByRole('button', { name: REBUILD_BUTTON, exact: true }).click()
    await page.getByRole('button', { name: 'Ricompila', exact: true }).click()
    await expect(page.getByText(MENU_REBUILD_OUTCOME_ALREADY_STARTED)).toBeVisible()

    await page.getByRole('button', { name: 'Chiudi' }).click()

    await removeMenuRebuildRouteStub(page)
    await installMenuRebuildRouteStub(page, { mode: 'error' })
    await page.getByRole('button', { name: REBUILD_BUTTON, exact: true }).click()
    await page.getByRole('button', { name: 'Ricompila', exact: true }).click()
    await expect(page.getByText(MENU_REBUILD_OUTCOME_ERROR)).toBeVisible()
  })

  // control:piatti-ricompila
  test(`ricompila-loading-ignora-chiusura ${NOTEBOOK}`, async ({ page }) => {
    await removeMenuRebuildRouteStub(page)
    await installMenuRebuildRouteStub(page, { mode: 'slow-started' })
    await page.goto('/app/menu', { waitUntil: 'domcontentloaded' })
    await page.getByRole('button', { name: REBUILD_BUTTON, exact: true }).click()
    await page.getByRole('button', { name: 'Ricompila', exact: true }).click()
    await expect(page.getByRole('button', { name: MENU_REBUILD_CONFIRM_LOADING_LABEL })).toBeDisabled()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('alertdialog')).toBeVisible()

    const dialog = page.getByRole('alertdialog')
    const box = await dialog.boundingBox()
    if (box) {
      await page.mouse.click(box.x - 12, box.y - 12)
    }
    await expect(page.getByRole('alertdialog')).toBeVisible()
    await expect(page.getByText(MENU_REBUILD_OUTCOME_STARTED)).toBeVisible({ timeout: 15_000 })
  })

  // control:piatti-azioni-pagina (solo presenza coppia; misura L2 non ripetuta)
  test(`ricompila-coppia-intestazione-notebook ${NOTEBOOK}`, async ({ page }) => {
    for (const screen of SCREENS) {
      await page.goto(screen.path, { waitUntil: 'domcontentloaded' })
      await page.getByRole('heading', { level: 1, name: screen.h1 }).waitFor({ timeout: 20_000 })
      await expect(page.getByRole('button', { name: REBUILD_BUTTON, exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: screen.newButton, exact: true })).toBeVisible()
    }
  })

  // control:piatti-ricompila
  test(`ricompila-avvisi-piatti-salvataggio-eliminazione ${NOTEBOOK}`, async ({
    page,
    payload,
    payloadWorker,
  }) => {
    const dishName = `verify-ui-rebuild-${payload.runId}`
    const managerEmail = payload.managerEmail
    const categoryId = payload.defaultDishCategoryId
    try {
      await page.goto('/app/menu', { waitUntil: 'domcontentloaded' })
      await page.getByRole('button', { name: PIATTI_NEW_BUTTON, exact: true }).click()
      await page.locator('#dish-field-name').fill(dishName)
      await page.locator('#dish-field-price').fill('12')
      await page.getByRole('combobox', { name: PIATTI_FORM_CATEGORY }).click()
      await page.getByRole('option').first().click()
      await page.getByRole('button', { name: PIATTI_FORM_SAVE, exact: true }).click()
      await expect(page.getByRole('status').filter({ hasText: PIATTI_TOAST_SAVED_NEW })).toBeVisible({
        timeout: 20_000,
      })
      await expect(page.getByText(PIATTI_REBUILD_HINT_SAVED)).toBeVisible()

      await page.locator('main').getByRole('button', { name: `Elimina ${dishName}`, exact: true }).click()
      const dlg = page.getByRole('alertdialog')
      await expect(dlg).toBeVisible()
      await dlg.getByRole('button', { name: PIATTI_DELETE_CONFIRM, exact: true }).click()
      await expect(page.getByRole('status').filter({ hasText: PIATTI_TOAST_DELETED })).toBeVisible({
        timeout: 20_000,
      })
      await expect(page.getByText(PIATTI_REBUILD_HINT_DELETED)).toBeVisible()
    } finally {
      await deleteDishByName(payloadWorker, dishName)
      const left = await payloadWorker.find({
        collection: DISHES_SLUG,
        where: { name: { equals: dishName } },
        limit: 1,
        overrideAccess: true,
      })
      if (left.docs[0]?.id != null) {
        await payloadWorker.delete({
          collection: DISHES_SLUG,
          id: left.docs[0].id,
          overrideAccess: true,
          depth: 0,
        })
      }
    }
  })
})