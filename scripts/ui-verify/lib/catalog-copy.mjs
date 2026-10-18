import { readTsStringExport } from './lib-readers.mjs'

const COPY_FILES = {
  vini: 'lib/menu/wines/copy.ts',
  distillati: 'lib/menu/spirits/copy.ts',
  bevande: 'lib/menu/drinks/copy.ts',
}

const PREFIX = {
  vini: 'VINI',
  distillati: 'DISTILLATI',
  bevande: 'BEVANDE',
}

/** @param {'vini'|'distillati'|'bevande'} screenId @param {string} exportName short (NEW_BUTTON) or full (VINI_NEW_BUTTON) */
export function catalogCopyConst(screenId, exportName) {
  const file = COPY_FILES[screenId]
  if (!file) return null
  const prefix = PREFIX[screenId]
  const full =
    exportName.startsWith(`${prefix}_`) || exportName.startsWith('VINI_') || exportName.startsWith('DISTILLATI_') || exportName.startsWith('BEVANDE_')
      ? exportName
      : `${prefix}_${exportName}`
  return readTsStringExport(file, full)
}
