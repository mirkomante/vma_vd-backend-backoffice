'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

type CatalogPartialAlertProps = {
  title: string
  description: string
  showMoreLabel?: string
  onShowMore?: () => void
  showMorePending?: boolean
}

export function CatalogPartialAlert({
  title,
  description,
  showMoreLabel,
  onShowMore,
  showMorePending,
}: CatalogPartialAlertProps) {
  return (
    <Alert role="status">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <span>{description}</span>
        {showMoreLabel && onShowMore ? (
          <Button type="button" variant="outline" size="sm" disabled={showMorePending} onClick={onShowMore}>
            {showMoreLabel}
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  )
}
