import {
  type NormalizeResult,
  normalizeSpiritVolumeForImport,
  normalizeWineVolumeForImport,
} from '@/lib/menu/formats'

export type VolumeResult = NormalizeResult

/** @deprecated Usare `normalizeWineVolumeForImport` o `normalizeSpiritVolumeForImport`. */
export function normalizeVolume(raw: unknown): VolumeResult {
  return normalizeWineVolumeForImport(raw)
}

export { normalizeSpiritVolumeForImport, normalizeWineVolumeForImport }
