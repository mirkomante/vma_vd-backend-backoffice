export async function waitForUrl(url: string, timeoutMs = 180_000): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { redirect: 'manual' })
      if (res.status < 500) return
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 800))
  }
  throw new Error(`Server non raggiungibile: ${url}`)
}
