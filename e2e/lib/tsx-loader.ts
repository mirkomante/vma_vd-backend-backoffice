import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const MARKER = '--import'

function resolveTsxFromPayload(): string {
  const payloadEntry = createRequire(import.meta.url).resolve('payload')
  const requireFromPayload = createRequire(payloadEntry)
  return requireFromPayload.resolve('tsx/esm')
}

/** Imposta NODE_OPTIONS con --import tsx (risolto dal package `payload`) per processo corrente e worker. */
export function ensureTsxLoader(): void {
  if (process.env.NODE_OPTIONS?.includes(MARKER)) {
    return
  }
  const tsxUrl = pathToFileURL(resolveTsxFromPayload()).href
  const prev = process.env.NODE_OPTIONS?.trim()
  process.env.NODE_OPTIONS = prev ? `${prev} ${MARKER} ${tsxUrl}` : `${MARKER} ${tsxUrl}`
}

ensureTsxLoader()
