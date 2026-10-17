import type { ReactNode } from 'react'

import { PublicMenuRebuildActions } from './public-menu-rebuild-actions'

type MenuPageHeaderProps = {
  title: string
  description: string
  primaryAction?: ReactNode
  showRebuild?: boolean
}

export function MenuPageHeader({
  title,
  description,
  primaryAction,
  showRebuild = true,
}: MenuPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex w-full flex-col gap-2 md:w-auto md:min-w-0 md:flex-row md:items-center md:justify-end">
        {showRebuild ? <PublicMenuRebuildActions /> : null}
        {primaryAction}
      </div>
    </header>
  )
}
