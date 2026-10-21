import { withMenuGeneralBackup } from '../lib/global-message/backup'
import {
  assertGlobalMessageStateVisible,
  prepareGlobalMessageState,
} from '../lib/global-message/prepare-state'
import {
  matrixStates as globalMatrixStates,
  nonProvatoReason as globalNonProvato,
} from '../lib/global-message/states'
import { registerC1C2C3Matrix } from '../lib/matrix-suite'
import {
  assertSpecialDayStateVisible,
  prepareSpecialDayState,
} from '../lib/special-days/prepare-state'
import {
  matrixStates as specialMatrixStates,
  nonProvatoReason as specialNonProvato,
} from '../lib/special-days/states'

registerC1C2C3Matrix({
  screenId: 'giorni-speciali',
  stateIds: specialMatrixStates().filter((s) => !specialNonProvato(s)),
  nonProvato: specialNonProvato,
  prepare: async ({ page, payload, payloadWorker }, statoId) =>
    prepareSpecialDayState(page, statoId, payload, payloadWorker),
  assertVisible: assertSpecialDayStateVisible,
})

registerC1C2C3Matrix({
  screenId: 'messaggio-globale',
  stateIds: globalMatrixStates().filter((s) => !globalNonProvato(s)),
  nonProvato: globalNonProvato,
  withIsolation: async ({ payloadWorker, payload }, run) => {
    await withMenuGeneralBackup(payloadWorker, payload.managerEmail, run)
  },
  prepare: async ({ page, payload, payloadWorker }, statoId) =>
    prepareGlobalMessageState(page, statoId, payload, payloadWorker),
  assertVisible: assertGlobalMessageStateVisible,
})
