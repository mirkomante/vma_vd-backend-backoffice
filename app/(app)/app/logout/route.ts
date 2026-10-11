import config from '@payload-config'
import { createPayloadRequest, generateExpiredPayloadCookie, logoutOperation } from 'payload'

export async function POST(request: Request) {
  const req = await createPayloadRequest({
    config,
    request,
    canSetHeaders: true,
  })

  const collection = req.payload.collections.users

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

  const headers = new Headers()
  headers.set('Location', '/app/login')
  const expiredCookie = generateExpiredPayloadCookie({
    collectionAuthConfig: collection.config.auth,
    config: req.payload.config,
    cookiePrefix: req.payload.config.cookiePrefix,
  })
  headers.append('Set-Cookie', expiredCookie)

  return new Response(null, { status: 303, headers })
}
