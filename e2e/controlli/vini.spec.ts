import { test, expect } from '../fixtures'
import { projectTag } from '../lib/matrix-projects'
import { CATALOG_SCREENS } from '../lib/catalog/config'
import {
  countWines,
  createWineAsManager,
  deleteWineByName,
} from '../lib/catalog/payload-helpers'
import { assertGroupedNamesSorted, type NameGroup } from '../lib/list-order-assert'
import { WINES_SLUG } from '@/lib/menu/constants'
import {
  VINI_LIST_PARTIAL_DESCRIPTION,
  VINI_LIST_PARTIAL_TITLE_PREFIX,
  VINI_SHOW_MORE,
} from '@/lib/menu/wines/copy'

const PROFILE = projectTag('notebook-1280-chiaro')
const viniConfig = CATALOG_SCREENS.vini

async function wineGroupsOnPage(page: import('@playwright/test').Page): Promise<NameGroup[]> {
  return page.locator('main section[data-block^="gruppo-"]').evaluateAll((sections) =>
    sections.map((section) => {
      const groupLabel = section.querySelector('h2')?.textContent?.trim() ?? ''
      const names = Array.from(section.querySelectorAll('tbody tr'))
        .map((row) => {
          const edit = row.querySelector('[aria-label^="Modifica "]')?.getAttribute('aria-label')
          if (edit?.startsWith('Modifica ')) return edit.slice('Modifica '.length)
          const cellLabel = row.querySelector('td [aria-label]')?.getAttribute('aria-label') ?? ''
          return cellLabel.split(',')[0]?.trim() ?? ''
        })
        .filter(Boolean)
      return { groupLabel, names }
    }),
  )
}

// control:vini-ordine-100
test.describe('Vini', () => {
  test.describe.configure({ mode: 'serial' })

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
      const total = await countWines(payloadWorker)
      expect(total).toBe(Math.max(101, initialTotal))

      await page.goto(viniConfig.path, { waitUntil: 'domcontentloaded' })
      await page.getByRole('heading', { level: 1, name: viniConfig.h1 }).waitFor({ timeout: 20_000 })
      await expect(
        page.getByText(`${VINI_LIST_PARTIAL_TITLE_PREFIX}${total}`),
      ).toBeVisible()
      await expect(page.getByText(VINI_LIST_PARTIAL_DESCRIPTION)).toBeVisible()
      const rowCount = await page.locator('main table tbody tr').count()
      expect(rowCount, `righe tabella misurate ${rowCount}, atteso 100`).toBe(100)
      const showMore = page.getByRole('button', { name: VINI_SHOW_MORE })
      await expect(showMore).toBeVisible()

      const groupsBefore = await wineGroupsOnPage(page)
      assertGroupedNamesSorted(groupsBefore)

      await showMore.click()
      await expect(page.getByText(VINI_LIST_PARTIAL_DESCRIPTION)).toHaveCount(0)
      const rowCountAfter = await page.locator('main table tbody tr').count()
      expect(rowCountAfter).toBe(total)
    } finally {
      for (const name of bulkNames) {
        await deleteWineByName(payloadWorker, name)
      }
      for (const name of bulkNames) {
        const left = await payloadWorker.find({
          collection: WINES_SLUG,
          where: { name: { equals: name } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        expect(left.docs.length, `fixture bulk «${name}» ancora presente dopo cleanup`).toBe(0)
      }
    }
  })
})
