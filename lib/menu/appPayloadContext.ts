import { ACTIVITY_AREA_CONTEXT_KEY } from './menuContentDeleteLog'

/** Context Local API per scritture e cancellazioni dall'Area App (registro attività `area: app`). */
export function appLocalApiContext(extraContext?: Record<string, unknown>): {
  context: Record<string, unknown>
} {
  return {
    context: {
      [ACTIVITY_AREA_CONTEXT_KEY]: 'app',
      ...extraContext,
    },
  }
}
