export const APP_THEME_COOKIE = 'app-theme'

export type AppThemePreference = 'light' | 'dark' | 'system'

export const APP_THEME_PREFERENCES: readonly AppThemePreference[] = ['light', 'dark', 'system']

export const DEFAULT_APP_THEME: AppThemePreference = 'system'

export function parseAppThemePreference(value: string | undefined): AppThemePreference {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value
  }
  return DEFAULT_APP_THEME
}

export function resolveAppThemeIsDark(
  preference: AppThemePreference,
  prefersDark: boolean,
): boolean {
  if (preference === 'dark') {
    return true
  }
  if (preference === 'light') {
    return false
  }
  return prefersDark
}
