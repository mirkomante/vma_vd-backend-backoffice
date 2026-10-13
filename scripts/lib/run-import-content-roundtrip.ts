import type { Payload } from 'payload'

import type { MemoryAvailabilityStorage } from '@/lib/menu/availability/testMemoryStorage'

import { buildLookupCache } from '../import-menu-vtn-backend/lookups'
import { runApply } from '../import-menu-vtn-backend/engine'
import { loadSnapshot } from '../import-menu-vtn-backend/snapshot'
import { wipeMenuImportCollections } from './wipe-menu-import-collections'
import { defaultSnapshotPath } from '../verify-menu-6_4-lib'

import {
  combinedImportContentFingerprintHash,
  fingerprintImportContentCollections,
} from './import-menu-content-fingerprint'

export type ImportContentRoundtripResult = {
  beforeCombined: string
  afterCombined: string
  writeCount: number
}

export async function runImportContentRoundtrip(
  payload: Payload,
  memory: MemoryAvailabilityStorage,
  options?: { snapshotPath?: string },
): Promise<ImportContentRoundtripResult> {
  const snapshotPath = options?.snapshotPath ?? defaultSnapshotPath()

  memory.resetWriteCount()

  const beforeRows = await fingerprintImportContentCollections(payload)
  const beforeCombined = combinedImportContentFingerprintHash(beforeRows)

  await wipeMenuImportCollections(payload)

  const snapshot = loadSnapshot(snapshotPath)
  const cache = await buildLookupCache(payload)
  await runApply(payload, snapshot, cache)

  const writeCount = memory.getWriteCount()
  const afterRows = await fingerprintImportContentCollections(payload)
  const afterCombined = combinedImportContentFingerprintHash(afterRows)

  return { beforeCombined, afterCombined, writeCount }
}
