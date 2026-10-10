import config from '@payload-config'
import { NextResponse } from 'next/server'
import { createPayloadRequest, generateExpiredPayloadCookie, logoutOperation } from 'payload'

export async function POST(request: Request) {
  const req = await createPayloadRequest({
    config,
    request,
    canSetHeaders: true,
  })

  const collection = req.payload.collections.users
  const loginUrl = new URL('/app/login', request.url)

  if (req.user) {
    try {
      await logoutOperation({
        allSessions: false,
        collection,
        req,
      })
    } catch {
      // Sessione già assente o non valida: si reindirizza comunque al login.
    }
  }

  const response = NextResponse.redirect(loginUrl, 303)
  const expiredCookie = generateExpiredPayloadCookie({
    collectionAuthConfig: collection.config.auth,
    config: req.payload.config,
    cookiePrefix: req.payload.config.cookiePrefix,
  })
  response.headers.append('Set-Cookie', expiredCookie)

  return response
}
