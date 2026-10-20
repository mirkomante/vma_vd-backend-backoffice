'use client'

import { Spinner } from '@/components/ui/spinner'
import { effectiveSavedGlobalMessageText } from '@/lib/menu/globalMessage/effectiveSavedGlobalMessageText'
import { formatAvailabilityUpdatedAtRome } from '@/lib/menu/globalMessage/formatAvailabilityUpdatedAtRome'
import {
  GLOBAL_MESSAGE_PANEL_NONE,
  GLOBAL_MESSAGE_PANEL_PUBLISHING,
  GLOBAL_MESSAGE_PANEL_TITLE,
  globalMessagePanelSavedFallback,
  globalMessagePanelUpdatedAt,
} from '@/lib/menu/globalMessage/copy'
import type { PublishedGlobalMessageSummary } from '@/lib/menu/globalMessage/summarizePublishedGlobalMessage'

type GlobalMessagePublishedPanelProps = {
  savedMessageIt: string
  savedMessageEn: string
  publishedReadable: boolean
  published: PublishedGlobalMessageSummary | null
  publishing: boolean
}

export function GlobalMessagePublishedPanel({
  savedMessageIt,
  savedMessageEn,
  publishedReadable,
  published,
  publishing,
}: GlobalMessagePublishedPanelProps) {
  const savedEffective = effectiveSavedGlobalMessageText(savedMessageIt, savedMessageEn)

  if (!publishedReadable) {
    const text =
      savedEffective.length > 0
        ? globalMessagePanelSavedFallback(savedEffective)
        : GLOBAL_MESSAGE_PANEL_NONE
    return (
      <section className="rounded-lg border border-border p-4" data-block="stato-pubblicato">
        <h2 className="text-sm font-medium">{GLOBAL_MESSAGE_PANEL_TITLE}</h2>
        <p className="mt-2 text-sm">{text}</p>
      </section>
    )
  }

  const publishedEffective = published?.effectiveIt ?? ''
  const displayText = publishing
    ? publishedEffective || GLOBAL_MESSAGE_PANEL_NONE
    : savedEffective || GLOBAL_MESSAGE_PANEL_NONE

  const showNone = !publishing && savedEffective.length === 0
  const timeLabel =
    !publishing && published?.updatedAtIso
      ? globalMessagePanelUpdatedAt(formatAvailabilityUpdatedAtRome(published.updatedAtIso))
      : null

  return (
    <section className="rounded-lg border border-border p-4" data-block="stato-pubblicato">
      <h2 className="text-sm font-medium">{GLOBAL_MESSAGE_PANEL_TITLE}</h2>
      <p className="mt-2 text-sm">{showNone ? GLOBAL_MESSAGE_PANEL_NONE : displayText}</p>
      {publishing ? (
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" aria-hidden />
          {GLOBAL_MESSAGE_PANEL_PUBLISHING}
        </p>
      ) : timeLabel ? (
        <p className="mt-2 text-sm text-muted-foreground">{timeLabel}</p>
      ) : null}
    </section>
  )
}
