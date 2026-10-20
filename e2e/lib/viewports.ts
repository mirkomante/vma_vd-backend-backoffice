export const PROFILE_VIEWPORTS: Record<string, { width: number; height: number; hasTouch: boolean }> = {
  'telefono-390': { width: 390, height: 844, hasTouch: true },
  'notebook-1280': { width: 1280, height: 900, hasTouch: false },
  'soglia-767': { width: 767, height: 1000, hasTouch: true },
  'soglia-768': { width: 768, height: 1000, hasTouch: true },
}

export async function applyProfileViewport(
  page: import('@playwright/test').Page,
  profilo: string,
): Promise<void> {
  const v = PROFILE_VIEWPORTS[profilo]
  if (!v) throw new Error(`profilo sconosciuto: ${profilo}`)
  await page.setViewportSize({ width: v.width, height: v.height })
}
