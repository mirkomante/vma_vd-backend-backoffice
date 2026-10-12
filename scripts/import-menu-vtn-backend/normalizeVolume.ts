import { VOLUME_CANONICAL } from './constants'

export type VolumeResult =
  | { ok: true; canonical?: string; raw: string | null }
  | { ok: false; raw: string; reason: string }

/** `capacita` null/vuota → omessa; forme note → canonica; altro → errore. */
export function normalizeVolume(raw: unknown): VolumeResult {
  if (raw === null || raw === undefined) {
    return { ok: true, raw: null }
  }
  const s = String(raw).trim()
  if (s.length === 0) {
    return { ok: true, raw: null }
  }
  const canonical = VOLUME_CANONICAL[s]
  if (!canonical) {
    return { ok: false, raw: s, reason: 'forma capacità non riconosciuta' }
  }
  return { ok: true, canonical, raw: s }
}
