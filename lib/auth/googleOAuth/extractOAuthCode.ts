import type { PayloadRequest } from 'payload'

import { OAuthLoginRejectedError } from './errors'

/** Estrazione code OAuth (GET query o POST form), allineata al default del plugin. */
export async function extractOAuthCallbackCode(req: PayloadRequest): Promise<string> {
  if (req.method === 'POST') {
    const contentType = req.headers.get('content-type')
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      if (typeof req.text !== 'function') {
        throw new OAuthLoginRejectedError()
      }
      const text = await req.text()
      const formData = new URLSearchParams(text)
      const code = formData.get('code')
      if (typeof code === 'string') {
        return code
      }
      throw new OAuthLoginRejectedError()
    }
    if (contentType?.includes('application/json') && typeof req.json === 'function') {
      const body = (await req.json()) as { code?: string }
      if (typeof body.code === 'string') {
        return body.code
      }
      throw new OAuthLoginRejectedError()
    }
    throw new OAuthLoginRejectedError()
  }

  if (req.method === 'GET') {
    const query = req.query as { code?: string }
    if (typeof query.code === 'string') {
      return query.code
    }
    throw new OAuthLoginRejectedError()
  }

  throw new OAuthLoginRejectedError()
}
