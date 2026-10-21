import { test, expect } from '../fixtures'
import { projectTag } from '../lib/matrix-projects'
import { CATALOG_SCREENS } from '../lib/catalog/config'
import {
  countWines,
  createWineAsManager,
  deleteWineByName,
} from '../lib/catalog/payload-helpers'
import { WINES_SLUG } from '@/lib/menu/constants'
import {
  VINI_LIST_PARTIAL_DESCRIPTION,
  VINI_LIST_PARTIAL_TITLE_PREFIX,
  VINI_SHOW_MORE,
} from '@/lib/menu/wines/copy'

const PROFILE = projectTag('notebook-1280-chiaro')
const viniConfig = CATALOG_SCREENS.vini

// control:vini-ordine-100
test.describe('Vini', () => {
  test(`vini-ordine-100 ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const managerEmail = payload.managerEmail
    const bulkNames: string[] = []
    const initialTotal = await countWines(payloadWorker)
    const toCreate = Math.max(0, 101 - initialTotal)
    try {
      for (let i = 1; i <= toCreate; i++) {
        const name = `verify-ui-vini-bulk-${String(i).padStart(3, '0')}`
        bulkNames.push(name)
        const id = await createWineAsManager(payloadWorker, managerEmail, name)
        payload.registerCreated(WINES_SLUG, id)
      }
      expect(await countWines(payloadWorker)).toBe(Math.max(101, initialTotal))

      await page.goto(viniConfig.path, { waitUntil: 'domcontentloaded' })
      await page.getByRole('heading', { level: 1, name: viniConfig.h1 }).waitFor({ timeout: 20_000 })
      const total = await countWines(payloadWorker)
      await expect(
        page.getByText(`${VINI_LIST_PARTIAL_TITLE_PREFIX}${total}`),
      ).toBeVisible()
      await expect(page.getByText(VINI_LIST_PARTIAL_DESCRIPTION)).toBeVisible()
      const showMore = page.getByRole('button', { name: VINI_SHOW_MORE })
      await expect(showMore).toBeVisible()
      await showMore.click()
      await expect(page.getByText(VINI_LIST_PARTIAL_DESCRIPTION)).toHaveCount(0)
    } finally {
      for (const name of bulkNames) {
        await deleteWineByName(payloadWorker, name)
      }
      expect(await countWines(payloadWorker)).toBe(initialTotal)
    }
  })
})
