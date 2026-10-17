import { createAppPayloadRequest } from '@/lib/app/payloadAppRequest'
import {
  getMenuDevSimulateLoadDelayMs,
  shouldSimulateMenuLoadError,
} from '@/lib/app/menu/devSimulate'
import { formatMenuSoldOutStatusLine } from '@/lib/app/home/menuSoldOutStatus'

export type MenuHomeStatusResult =
  | { kind: 'ready'; line: string }
  | { kind: 'error' }

export async function loadMenuHomeStatus(): Promise<MenuHomeStatusResult> {
  if (shouldSimulateMenuLoadError()) {
    return { kind: 'error' }
  }

  const delayMs = getMenuDevSimulateLoadDelayMs()
  if (delayMs > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, delayMs)
    })
  }

  try {
    const req = await createAppPayloadRequest('/app')
    const result = await req.payload.count({
      collection: 'dishes',
      where: {
        and: [
          { soldOut: { equals: true } },
          { disabled: { not_equals: true } },
        ],
      },
      overrideAccess: false,
      req,
    })

    return { kind: 'ready', line: formatMenuSoldOutStatusLine(result.totalDocs) }
  } catch {
    return { kind: 'error' }
  }
}
