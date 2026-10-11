import config from '@payload-config'
import { headers } from 'next/headers'
import { createPayloadRequest, type PayloadRequest } from 'payload'

/** Richiesta Payload con la sessione cookie dell’Area App (stesso pattern di `getAppSessionUser`). */
export async function createAppPayloadRequest(path = '/app'): Promise<PayloadRequest> {
  const headersList = await headers()
  const requestHeaders = new Headers()
  headersList.forEach((value, key) => {
    requestHeaders.append(key, value)
  })

  return createPayloadRequest({
    config,
    request: new Request(`http://localhost${path}`, {
      headers: requestHeaders,
    }),
    canSetHeaders: false,
  })
}
