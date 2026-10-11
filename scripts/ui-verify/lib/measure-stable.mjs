/** Attende layout stabile (due letture bounding box a 100 ms con stesse dimensioni). */

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function waitForStableBoundingBox(page, locator, { attempts = 40, intervalMs = 100 } = {}) {
  let prev = null
  for (let i = 0; i < attempts; i++) {
    const box = await locator.boundingBox()
    if (!box) {
      await sleep(intervalMs)
      continue
    }
    const key = `${box.x.toFixed(1)}:${box.y.toFixed(1)}:${box.width.toFixed(1)}:${box.height.toFixed(1)}`
    if (prev === key) return box
    prev = key
    await sleep(intervalMs)
  }
  return await locator.boundingBox()
}

/** Tutti i button visibili con stesse dimensioni tra due campioni a 100 ms. */
export async function waitForPageLayoutStable(page, { rounds = 25, intervalMs = 100 } = {}) {
  let stableRounds = 0
  for (let i = 0; i < rounds; i++) {
    const snap1 = await page.evaluate(() =>
      [...document.querySelectorAll('button')]
        .filter((b) => {
          const r = b.getBoundingClientRect()
          return r.width >= 2 && r.height >= 2 && getComputedStyle(b).visibility !== 'hidden'
        })
        .map((b) => {
          const r = b.getBoundingClientRect()
          return `${Math.round(r.width)}x${Math.round(r.height)}`
        })
        .sort()
        .join('|'),
    )
    await sleep(intervalMs)
    const snap2 = await page.evaluate(() =>
      [...document.querySelectorAll('button')]
        .filter((b) => {
          const r = b.getBoundingClientRect()
          return r.width >= 2 && r.height >= 2 && getComputedStyle(b).visibility !== 'hidden'
        })
        .map((b) => {
          const r = b.getBoundingClientRect()
          return `${Math.round(r.width)}x${Math.round(r.height)}`
        })
        .sort()
        .join('|'),
    )
    if (snap1 === snap2 && snap1.length > 0) {
      stableRounds += 1
      if (stableRounds >= 2) return
    } else {
      stableRounds = 0
    }
  }
}

export async function waitFieldCenteredAndFocused(page, fieldId, { timeoutMs = 6000 } = {}) {
  const start = Date.now()
  let lastTop = null
  while (Date.now() - start < timeoutMs) {
    const state = await page.evaluate((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const mid = (r.top + r.bottom) / 2
      const centered = Math.abs(mid - vh / 2) <= 120
      return {
        top: r.top,
        centered,
        focused: document.activeElement?.id === id,
      }
    }, fieldId)
    if (state?.centered && state?.focused) {
      if (lastTop !== null && Math.abs(state.top - lastTop) < 2) return true
      lastTop = state.top
    } else {
      lastTop = null
    }
    await sleep(100)
  }
  return false
}
