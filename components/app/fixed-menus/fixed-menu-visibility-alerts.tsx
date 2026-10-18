'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { fixedMenuVisibilityAlert } from '@/lib/menu/fixedMenus/effectiveVisibility'
import { formatFixedMenuVisibilityAlertText } from '@/lib/menu/fixedMenus/visibilityAlertText'
import type { MenuVisibilityValue } from '@/lib/menu/visibilityField'

type FixedMenuVisibilityAlertsProps = {
  menuVisibility: MenuVisibilityValue
  categoryVisibility: MenuVisibilityValue
  categoryName: string
}

export function FixedMenuVisibilityAlerts({
  menuVisibility,
  categoryVisibility,
  categoryName,
}: FixedMenuVisibilityAlertsProps) {
  const alert = fixedMenuVisibilityAlert(menuVisibility, categoryVisibility, categoryName)
  if (!alert) {
    return null
  }
  return (
    <Alert variant={alert.kind === 'error' ? 'destructive' : 'default'}>
      <AlertDescription>{formatFixedMenuVisibilityAlertText(alert)}</AlertDescription>
    </Alert>
  )
}
