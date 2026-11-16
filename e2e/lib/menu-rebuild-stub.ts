import type { Page } from '@playwright/test'

export type MenuRebuildStubMode = 'started' | 'already-started' | 'error' | 'slow-started'

type StubOptions = {
  mode?: MenuRebuildStubMode
  delayMs?: number
}

const REBUILD_PATH = '**/api/menu/rebuild'

export async function installMenuRebuildRouteStub(
  page: Page,
  options: StubOptions = {},
): Promise<void> {
  const mode = options.mode ?? 'started'
  const delayMs = options.delayMs ?? 0

  await page.route(REBUILD_PATH, async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue()
      return
    }
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
    switch (mode) {
      case 'started':
        await route.fulfill({
          status: 202,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'started', buildId: 'verify-ui-fake-build' }),
        })
        break
      case 'already-started':
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'already-started' }),
        })
        break
      case 'error':
        await route.fulfill({
          status: 502,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'error' }),
        })
        break
      case 'slow-started':
        await new Promise((resolve) => setTimeout(resolve, 1200))
        await route.fulfill({
          status: 202,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'started', buildId: 'verify-ui-slow-build' }),
        })
        break
      default:
        await route.fulfill({
          status: 502,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'error' }),
        })
    }
  })
}

export async function removeMenuRebuildRouteStub(page: Page): Promise<void> {
  await page.unroute(REBUILD_PATH)
}