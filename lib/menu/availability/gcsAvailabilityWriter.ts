import { appendFile, writeFile } from 'node:fs/promises'

import {
  MENU_AVAILABILITY_GCS_BUCKET_ENV,
  MENU_AVAILABILITY_GCS_UPLOAD_TIMEOUT_MS,
  MENU_AVAILABILITY_OBJECT_PATH,
} from './constants'
import { assertMenuAvailabilityDevOnlyEnvAllowed } from './devOnlyEnvGuard'
import { createMemoryAvailabilityStorage, type MemoryAvailabilityStorage } from './testMemoryStorage'
import type { AvailabilityDocumentV1 } from './types'

const MENU_AVAILABILITY_IN_MEMORY_ENV = 'MENU_AVAILABILITY_IN_MEMORY'
const MENU_AVAILABILITY_WRITE_TRACE_FILE_ENV = 'MENU_AVAILABILITY_WRITE_TRACE_FILE'
const MENU_AVAILABILITY_MIRROR_FILE_ENV = 'MENU_AVAILABILITY_MIRROR_FILE'

export type AvailabilityObjectReader = {
  readCurrentObject(): Promise<string | null>
}

export type AvailabilityObjectWriter = {
  writeObject(json: string, contentType: string): Promise<void>
}

export type AvailabilityStorage = AvailabilityObjectReader & AvailabilityObjectWriter

let testAvailabilityStorage: AvailabilityStorage | null = null
let devMemoryAvailabilityStorage: MemoryAvailabilityStorage | null = null

function wrapWithWriteTrace(storage: AvailabilityStorage, tracePath: string): AvailabilityStorage {
  return {
    async readCurrentObject(): Promise<string | null> {
      return storage.readCurrentObject()
    },
    async writeObject(json: string, contentType: string): Promise<void> {
      await appendFile(tracePath, `write ${Date.now()}\n`, 'utf8')
      await storage.writeObject(json, contentType)
    },
  }
}

function wrapWithMirror(storage: AvailabilityStorage, mirrorPath: string): AvailabilityStorage {
  return {
    async readCurrentObject(): Promise<string | null> {
      return storage.readCurrentObject()
    },
    async writeObject(json: string, contentType: string): Promise<void> {
      await writeFile(mirrorPath, json, 'utf8')
      await storage.writeObject(json, contentType)
    },
  }
}

function applyDevStorageWrappers(storage: AvailabilityStorage): AvailabilityStorage {
  const mirrorPath = process.env[MENU_AVAILABILITY_MIRROR_FILE_ENV]?.trim()
  const tracePath = process.env[MENU_AVAILABILITY_WRITE_TRACE_FILE_ENV]?.trim()
  let wrapped = storage
  if (mirrorPath) {
    wrapped = wrapWithMirror(wrapped, mirrorPath)
  }
  if (tracePath) {
    wrapped = wrapWithWriteTrace(wrapped, tracePath)
  }
  return wrapped
}

/** Solo per script di verifica (6.4): storage in memoria al posto di GCS. */
export function setAvailabilityStorageForTests(storage: AvailabilityStorage | null): void {
  testAvailabilityStorage = storage
}

export function getMenuAvailabilityBucketName(): string | null {
  const name = process.env[MENU_AVAILABILITY_GCS_BUCKET_ENV]?.trim()
  return name || null
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout ${label} dopo ${ms} ms`))
    }, ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

let gcsClientPromise: Promise<import('@google-cloud/storage').Storage> | null = null

async function getGcsClient(): Promise<import('@google-cloud/storage').Storage> {
  if (!gcsClientPromise) {
    gcsClientPromise = import('@google-cloud/storage').then(({ Storage }) => new Storage())
  }
  return gcsClientPromise
}

export function getDevMemoryAvailabilityStorage(): MemoryAvailabilityStorage | null {
  return devMemoryAvailabilityStorage
}

export function resolveAvailabilityStorage(): AvailabilityStorage | null {
  assertMenuAvailabilityDevOnlyEnvAllowed()
  if (testAvailabilityStorage) {
    return testAvailabilityStorage
  }
  if (process.env[MENU_AVAILABILITY_IN_MEMORY_ENV] === '1') {
    if (!devMemoryAvailabilityStorage) {
      devMemoryAvailabilityStorage = createMemoryAvailabilityStorage()
    }
    return applyDevStorageWrappers(devMemoryAvailabilityStorage)
  }
  const bucketName = getMenuAvailabilityBucketName()
  if (!bucketName) {
    return null
  }
  return createGcsAvailabilityStorage()
}

export function createGcsAvailabilityStorage(): AvailabilityStorage {
  const bucketName = getMenuAvailabilityBucketName()
  if (!bucketName) {
    throw new Error('Bucket disponibilità menù non configurato.')
  }

  return {
    async readCurrentObject(): Promise<string | null> {
      const storage = await getGcsClient()
      const file = storage.bucket(bucketName).file(MENU_AVAILABILITY_OBJECT_PATH)
      const [exists] = await withTimeout(
        file.exists(),
        MENU_AVAILABILITY_GCS_UPLOAD_TIMEOUT_MS,
        'lettura GCS exists',
      )
      if (!exists) {
        return null
      }
      const [contents] = await withTimeout(
        file.download(),
        MENU_AVAILABILITY_GCS_UPLOAD_TIMEOUT_MS,
        'lettura GCS download',
      )
      return contents.toString('utf8')
    },

    async writeObject(json: string, contentType: string): Promise<void> {
      const storage = await getGcsClient()
      const file = storage.bucket(bucketName).file(MENU_AVAILABILITY_OBJECT_PATH)
      await withTimeout(
        file.save(json, {
          contentType,
          metadata: {
            cacheControl: 'public, max-age=60',
          },
          resumable: false,
        }),
        MENU_AVAILABILITY_GCS_UPLOAD_TIMEOUT_MS,
        'scrittura GCS',
      )
    },
  }
}

export function serializeAvailabilityDocument(doc: AvailabilityDocumentV1): string {
  return `${JSON.stringify(doc)}\n`
}
