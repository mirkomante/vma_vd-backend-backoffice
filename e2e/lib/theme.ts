import type { Page } from '@playwright/test'

export async function applyThemeCookie(page: Page, baseURL: string, tema: 'chiaro' | 'scuro'): Promise<void> {
  const cookie = tema === 'scuro' ? 'dark' : 'light'
  await page.context().addCookies([{ name: 'app-theme', value: cookie, url: baseURL }])
}

export function htmlDarkForTema(tema: 'chiaro' | 'scuro'): boolean {
  return tema === 'scuro'
}
