'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PUBLIC_MENU_REBUILD_UI_ENABLED } from '@/lib/menu/publicMenuRebuild'

type MenuOutcomeAlertProps = {
  title: string
  rebuildHint?: string
  variant?: 'default' | 'destructive'
}

export function MenuOutcomeAlert({
  title,
  rebuildHint,
  variant = 'default',
}: MenuOutcomeAlertProps) {
  const showRebuildHint = PUBLIC_MENU_REBUILD_UI_ENABLED && rebuildHint

  return (
    <Alert variant={variant} role="status">
      <AlertTitle>{title}</AlertTitle>
      {showRebuildHint ? <AlertDescription>{rebuildHint}</AlertDescription> : null}
    </Alert>
  )
}
