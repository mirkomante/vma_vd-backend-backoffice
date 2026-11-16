import { MENU_REBUILD_DEBOUNCE_MS, REBUILD_STARTED_DETAIL_PREFIX } from './constants'

export function isWithinRebuildDebounceWindow(
  startedAt: Date,
  now: Date,
  windowMs = MENU_REBUILD_DEBOUNCE_MS,
): boolean {
  const delta = now.getTime() - startedAt.getTime()
  return delta >= 0 && delta < windowMs
}

export function parseRebuildStartedBuildId(detail: string | null | undefined): string | null {
  if (!detail || !detail.startsWith(REBUILD_STARTED_DETAIL_PREFIX)) {
    return null
  }
  const id = detail.slice(REBUILD_STARTED_DETAIL_PREFIX.length).trim()
  return id || null
}