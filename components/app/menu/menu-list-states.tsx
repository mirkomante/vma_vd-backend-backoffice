'use client'

import type { ReactNode } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

type MenuListLoadingStateProps = {
  skeletonCount?: number
}

export function MenuListLoadingState({ skeletonCount = 4 }: MenuListLoadingStateProps) {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: skeletonCount }, (_, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  )
}

type MenuListErrorStateProps = {
  title: string
  description: string
  onRetry?: () => void
  retryLabel?: string
}

export function MenuListErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Riprova',
}: MenuListErrorStateProps) {
  return (
    <Alert variant="destructive" role="alert">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{description}</span>
        {onRetry ? (
          <Button type="button" variant="outline" size="default" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  )
}

type MenuListEmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export function MenuListEmptyState({ title, description, action }: MenuListEmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border p-6 text-center">
      <p className="text-sm font-medium">{title}</p>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
