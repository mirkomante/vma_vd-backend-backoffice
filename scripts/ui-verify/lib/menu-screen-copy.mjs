import { readTsStringExport } from './lib-readers.mjs'

const COPY_FILES = {
  servizi: [
    'lib/menu/services/copy.ts',
    'lib/menu/menu-services/copy.ts',
    'lib/menu/ui/services/copy.ts',
  ],
  'menu-fissi': [
    'lib/menu/fixed-menus/copy.ts',
    'lib/menu/fixed/copy.ts',
    'lib/menu/ui/fixed-menus/copy.ts',
  ],
}

const PREFIX = {
  servizi: 'SERVIZI',
  'menu-fissi': 'MENU_FISSI',
}

function resolveCopyFile(screenId) {
  for (const rel of COPY_FILES[screenId] ?? []) {
    const v = readTsStringExport(rel, `${PREFIX[screenId]}_PAGE_TITLE`)
    if (v != null) return rel
    const any = readTsStringExport(rel, `${PREFIX[screenId]}_FORM_SAVE`)
    if (any != null) return rel
  }
  return COPY_FILES[screenId]?.[0] ?? null
}

/** @param {'servizi'|'menu-fissi'} screenId @param {string} exportName */
export function menuScreenCopyConst(screenId, exportName) {
  const rel = resolveCopyFile(screenId)
  if (!rel) return null
  const prefix = PREFIX[screenId]
  const full =
    exportName.startsWith(`${prefix}_`) || exportName.startsWith('SERVIZI_') || exportName.startsWith('MENU_FISSI_')
      ? exportName
      : `${prefix}_${exportName}`
  return readTsStringExport(rel, full)
}
