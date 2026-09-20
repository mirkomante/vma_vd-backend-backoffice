import type { PayloadRequest } from 'payload'
import { addDataAndFileToRequest } from 'payload'

/** JSON (fetch) o `application/x-www-form-urlencoded` (form HTML nativo). */
export async function parseLoginRequestBody(req: PayloadRequest): Promise<void> {
  await addDataAndFileToRequest(req)
  if (readEmailAndPassword(req)) {
    return
  }

  const contentType = (req.headers.get('Content-Type') || '').split(';', 1)[0]?.trim()
  if (contentType !== 'application/x-www-form-urlencoded') {
    return
  }

  try {
    const text = typeof req.text === 'function' ? await req.text() : ''
    if (!text) {
      return
    }
    const params = new URLSearchParams(text)
    const email = params.get('email')
    const password = params.get('password')
    if (typeof email === 'string' && typeof password === 'string') {
      req.data = { email, password }
    }
  } catch {
    // body già consumato
  }
}

export function readEmailAndPassword(
  req: PayloadRequest,
): { email: string; password: string } | null {
  const body = req.data
  if (!body || typeof body !== 'object') {
    return null
  }

  const emailRaw = 'email' in body ? body.email : undefined
  const passwordRaw = 'password' in body ? body.password : undefined

  if (typeof emailRaw !== 'string' || typeof passwordRaw !== 'string') {
    return null
  }

  const email = emailRaw.trim().toLowerCase()
  const password = passwordRaw

  if (!email || !password) {
    return null
  }

  return { email, password }
}
