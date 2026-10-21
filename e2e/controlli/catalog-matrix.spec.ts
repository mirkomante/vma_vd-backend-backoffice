import { CATALOG_SCREENS, type CatalogScreenId } from '../lib/catalog/config'
import { assertCatalogStateVisible, prepareCatalogState } from '../lib/catalog/prepare-state'
import { matrixStates, nonProvatoReason } from '../lib/catalog/states'
import { registerC1C2C3Matrix } from '../lib/matrix-suite'

const SCREEN_IDS: CatalogScreenId[] = ['vini', 'distillati', 'bevande']

for (const screenId of SCREEN_IDS) {
  const config = CATALOG_SCREENS[screenId]
  const stateIds = matrixStates(screenId).filter((s) => !nonProvatoReason(screenId, s))

  registerC1C2C3Matrix({
    screenId,
    stateIds,
    nonProvato: (statoId) => nonProvatoReason(screenId, statoId),
    prepare: async ({ page, payload }, statoId) =>
      prepareCatalogState(page, config, statoId, payload),
    assertVisible: (page, statoId) => assertCatalogStateVisible(page, config, statoId),
  })
}
