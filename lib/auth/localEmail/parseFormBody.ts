import type { PayloadRequest } from 'payload'
import { addDataAndFileToRequest } from 'payload'

async function mergeUrlEncodedBody(req: PayloadRequest): Promise<void> {
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
    const merged: Record<string, string> = {
      ...(req.data && typeof req.data === 'object' ? (req.data as Record<string, string>) : {}),
    }
    for (const [key, value] of params.entries()) {
      merged[key] = value
    }
    req.data = merged
  } catch {
    // body già consumato
  }
}

export async function parseAuthFormBody(req: PayloadRequest): Promise<void> {
  await addDataAndFileToRequest(req)
  await mergeUrlEncodedBody(req)
}

function readStringField(req: PayloadRequest, name: string): string | null {
  const body = req.data
  if (!body || typeof body !== 'object' || !(name in body)) {
    return null
  }
  const raw = (body as Record<string, unknown>)[name]
  if (typeof raw !== 'string') {
    return null
  }
  const value = raw.trim()
  return value.length > 0 ? value : null
}

export function readEmailField(req: PayloadRequest): string | null {
  const email = readStringField(req, 'email')
  return email ? email.toLowerCase() : null
}

export function readTokenField(req: PayloadRequest): string | null {
  return readStringField(req, 'token')
}

export function readPasswordField(req: PayloadRequest): string | null {
  const body = req.data
  if (!body || typeof body !== 'object' || !('password' in body)) {
    return null
  }
  const raw = (body as Record<string, unknown>).password
  return typeof raw === 'string' && raw.length > 0 ? raw : null
}
