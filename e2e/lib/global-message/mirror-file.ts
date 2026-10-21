import { readFile } from 'node:fs/promises'

import { expect } from '@playwright/test'

import type { AvailabilityDocumentV1 } from '@/lib/menu/availability/types'

export async function readAvailabilityMirror(path: string): Promise<AvailabilityDocumentV1 | null> {
  try {
    const raw = await readFile(path, 'utf8')
    return JSON.parse(raw) as AvailabilityDocumentV1
  } catch {
    return null
  }
}

export async function expectMirrorGlobalMessage(
  path: string,
  expected: { it: string; en: string } | null,
): Promise<void> {
  await expect
    .poll(async () => {
      const doc = await readAvailabilityMirror(path)
      if (expected === null) {
        return doc?.globalMessage === undefined ? 'ok' : 'pending'
      }
      const gm = doc?.globalMessage
      if (!gm || typeof gm !== 'object') return 'pending'
      if (gm.it !== expected.it || gm.en !== expected.en) return 'pending'
      return 'ok'
    })
    .toBe('ok')
}
