import { test, expect } from '../fixtures'
import { projectTag } from '../lib/matrix-projects'
import {
  countDishes,
  createDishAsManager,
  deleteDishByName,
} from '../lib/dishes/payload-helpers'
import { assertGroupedNamesSorted, type NameGroup } from '../lib/list-order-assert'
import { DISHES_SLUG } from '@/lib/menu/constants'
import {
  PIATTI_LIST_PARTIAL_DESCRIPTION,
  PIATTI_LIST_PARTIAL_TITLE_PREFIX,
  PIATTI_PAGE_TITLE,
} from '@/lib/menu/dishes/copy'

const PROFILE = projectTag('notebook-1280-chiaro')
const DISHES_PATH = '/app/menu'

async function dishGroupsOnPage(page: import('@playwright/test').Page): Promise<NameGroup[]> {
  return page.locator('main .flex.flex-col.gap-6 > section').evaluateAll((sections) =>
    sections.map((section) => {
      const groupLabel =
        section.querySelector('h2 .font-semibold')?.textContent?.trim() ??
        section.querySelector('h2')?.textContent?.trim() ??
        ''
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

// control:piatti-ordine-100
test.describe('Piatti', () => {
  test.describe.configure({ mode: 'serial' })

  test(`piatti-ordine-100 ${PROFILE}`, async ({ page, payload, payloadWorker }) => {
    const managerEmail = payload.managerEmail
    const categoryId = payload.defaultDishCategoryId
    const bulkNames: string[] = []
    const initialTotal = await countDishes(payloadWorker)
    const toCreate = Math.max(0, 101 - initialTotal)
    try {
      for (let i = 1; i <= toCreate; i++) {
        const name = `verify-ui-piatti-bulk-${String(i).padStart(3, '0')}`
        bulkNames.push(name)
        const id = await createDishAsManager(payloadWorker, managerEmail, name, categoryId)
        payload.registerCreated(DISHES_SLUG, id)
      }
      const total = await countDishes(payloadWorker)
      expect(total).toBe(Math.max(101, initialTotal))

      await page.goto(DISHES_PATH, { waitUntil: 'domcontentloaded' })
      await page.getByRole('heading', { level: 1, name: PIATTI_PAGE_TITLE }).waitFor({ timeout: 20_000 })
      await expect(
        page.locator('[role=status]').filter({
          hasText: `${PIATTI_LIST_PARTIAL_TITLE_PREFIX}${total}`,
        }),
        `avviso elenco parziale: atteso «${PIATTI_LIST_PARTIAL_TITLE_PREFIX}${total}»`,
      ).toBeVisible()
      await expect(page.getByText(PIATTI_LIST_PARTIAL_DESCRIPTION)).toBeVisible()
      const rowCount = await page.locator('main table tbody tr').count()
      expect(rowCount, `righe tabella misurate ${rowCount}, atteso 100`).toBe(100)

      const groups = await dishGroupsOnPage(page)
      assertGroupedNamesSorted(groups)
    } finally {
      for (const name of bulkNames) {
        await deleteDishByName(payloadWorker, name)
      }
      for (const name of bulkNames) {
        const left = await payloadWorker.find({
          collection: DISHES_SLUG,
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
