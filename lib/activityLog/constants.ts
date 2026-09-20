export const ACTIVITY_LOG_SLUG = 'activity-log' as const

export const ACTIVITY_LOG_EVENT_TYPES = [
  'login',
  'logout',
  'accessDenied',
  'create',
  'update',
  'delete',
] as const

export type ActivityLogEventType = (typeof ACTIVITY_LOG_EVENT_TYPES)[number]

export const ACTIVITY_LOG_AREAS = ['admin', 'app'] as const
export type ActivityLogArea = (typeof ACTIVITY_LOG_AREAS)[number]

export const ACTIVITY_LOG_METHODS = ['sso', 'local'] as const
export type ActivityLogMethod = (typeof ACTIVITY_LOG_METHODS)[number]
