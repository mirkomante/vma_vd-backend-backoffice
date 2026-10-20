'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  clearGlobalMessageAction,
  loadGlobalMessageSettingsAction,
  readPublishedGlobalMessageAction,
  saveGlobalMessageAction,
} from '@/app/(app)/app/(shell)/menu/message-actions'
import { useAppSaveBar } from '@/components/app/shell/save-bar-slot'
import { LocalizedTranslationCollapsible } from '@/components/app/menu/localized-translation-collapsible'
import { MenuDeleteDialog } from '@/components/app/menu/menu-delete-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import {
  globalMessageFormValuesEqual,
  hasEnglishGlobalMessage,
  hasSavedGlobalMessage,
  normalizeGlobalMessageFormForSave,
} from '@/lib/app/globalMessage/formModel'
import type { GlobalMessagePageData } from '@/lib/app/globalMessage/types'
import { collapseGlobalMessageNewlines } from '@/lib/menu/globalMessage/normalizeGlobalMessageText'
import { effectiveSavedGlobalMessageText } from '@/lib/menu/globalMessage/effectiveSavedGlobalMessageText'
import {
  GLOBAL_MESSAGE_ACTION_ERROR_DESCRIPTION,
  GLOBAL_MESSAGE_ACTION_ERROR_TITLE,
  GLOBAL_MESSAGE_DISCARD,
  GLOBAL_MESSAGE_FIELD_EN,
  GLOBAL_MESSAGE_FIELD_HINT,
  GLOBAL_MESSAGE_FIELD_LABEL,
  GLOBAL_MESSAGE_LOAD_ERROR_DESCRIPTION,
  GLOBAL_MESSAGE_LOAD_ERROR_TITLE,
  GLOBAL_MESSAGE_LOAD_RETRY,
  GLOBAL_MESSAGE_PAGE_DESCRIPTION,
  GLOBAL_MESSAGE_PAGE_TITLE,
  GLOBAL_MESSAGE_REMOVE,
  GLOBAL_MESSAGE_REMOVE_CONFIRM,
  GLOBAL_MESSAGE_REMOVE_DESCRIPTION,
  GLOBAL_MESSAGE_REMOVE_TITLE,
  GLOBAL_MESSAGE_SAVE,
  GLOBAL_MESSAGE_SAVE_PENDING,
  GLOBAL_MESSAGE_TOAST_REMOVED,
  GLOBAL_MESSAGE_TOAST_REMOVED_HINT,
  GLOBAL_MESSAGE_TOAST_SAVED,
  GLOBAL_MESSAGE_TOAST_SAVED_HINT,
  GLOBAL_MESSAGE_TRANSLATION_HINT,
} from '@/lib/menu/globalMessage/copy'
import type { PublishedGlobalMessageSummary } from '@/lib/menu/globalMessage/summarizePublishedGlobalMessage'

import { GlobalMessagePublishedPanel } from './global-message-published-panel'

type PageNotice = { kind: 'saved' } | { kind: 'removed' } | { kind: 'server' }

type GlobalMessagePageProps = {
  initialData: GlobalMessagePageData
}

function pollIntervalMs(elapsedMs: number): number {
  return elapsedMs < 60_000 ? 3_000 : 15_000
}

export function GlobalMessagePage({ initialData }: GlobalMessagePageProps) {
  const { setSaveBar } = useAppSaveBar()

  const [loadError, setLoadError] = useState(initialData.loadError)
  const [loading, setLoading] = useState(false)
  const [savedValues, setSavedValues] = useState(initialData.values)
  const [values, setValues] = useState(initialData.values)
  const [publishedReadable, setPublishedReadable] = useState(initialData.publishedReadable)
  const [published, setPublished] = useState<PublishedGlobalMessageSummary | null>(initialData.published)
  const [publishWatchActive, setPublishWatchActive] = useState(false)
  const [notice, setNotice] = useState<PageNotice | null>(null)
  const [saving, setSaving] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)
  const [removePending, setRemovePending] = useState(false)

  const [translationOpen, setTranslationOpen] = useState(() => hasEnglishGlobalMessage(initialData.values))
  const watchStartedAtRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dirty = useMemo(() => !globalMessageFormValuesEqual(values, savedValues), [values, savedValues])

  const savedEffective = effectiveSavedGlobalMessageText(savedValues.messageIt, savedValues.messageEn)
  const savedEffectiveRef = useRef(savedEffective)
  useEffect(() => {
    savedEffectiveRef.current = savedEffective
  }, [savedEffective])
  const publishedEffective = published?.effectiveIt ?? ''
  const publishing =
    publishedReadable && publishWatchActive && savedEffective !== publishedEffective

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    const scheduleNextPoll = () => {
      clearTimer()
      if (!publishWatchActive) {
        return
      }
      const started = watchStartedAtRef.current ?? Date.now()
      const elapsed = Date.now() - started
      const delay = pollIntervalMs(elapsed)
      timerRef.current = setTimeout(() => {
        void (async () => {
          if (document.hidden) {
            scheduleNextPoll()
            return
          }
          const result = await readPublishedGlobalMessageAction()
          queueMicrotask(() => {
            if (!publishWatchActive) {
              return
            }
            if (!result.ok) {
              setPublishedReadable(false)
              setPublishWatchActive(false)
              clearTimer()
              return
            }
            setPublishedReadable(true)
            setPublished(result.summary)
            const nextEffective = result.summary.effectiveIt ?? ''
            if (nextEffective === savedEffectiveRef.current) {
              setPublishWatchActive(false)
              clearTimer()
              return
            }
            scheduleNextPoll()
          })
        })()
      }, delay)
    }

    if (!publishWatchActive) {
      clearTimer()
      return clearTimer
    }

    if (watchStartedAtRef.current == null) {
      watchStartedAtRef.current = Date.now()
    }

    queueMicrotask(() => {
      scheduleNextPoll()
    })

    const onVisibility = () => {
      if (!document.hidden && publishWatchActive) {
        queueMicrotask(() => scheduleNextPoll())
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearTimer()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [publishWatchActive])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setNotice(null)
    const normalized = normalizeGlobalMessageFormForSave(values)
    const result = await saveGlobalMessageAction(normalized)
    setSaving(false)
    if (!result.ok) {
      setNotice({ kind: 'server' })
      return
    }
    setSavedValues(result.values)
    setValues(result.values)
    setNotice({ kind: 'saved' })
    void readPublishedGlobalMessageAction().then((read) => {
      queueMicrotask(() => {
        if (!read.ok) {
          setPublishedReadable(false)
          setPublishWatchActive(false)
          return
        }
        setPublishedReadable(true)
        setPublished(read.summary)
        watchStartedAtRef.current = Date.now()
        setPublishWatchActive(true)
      })
    })
  }, [values])

  const handleDiscard = useCallback(() => {
    setValues(savedValues)
    setNotice(null)
  }, [savedValues])

  const handleClear = useCallback(async () => {
    setRemovePending(true)
    const result = await clearGlobalMessageAction()
    setRemovePending(false)
    if (!result.ok) {
      setNotice({ kind: 'server' })
      return
    }
    setRemoveOpen(false)
    setSavedValues(result.values)
    setValues(result.values)
    setPublishWatchActive(false)
    setPublished(null)
    setPublishedReadable(initialData.publishedReadable)
    setNotice({ kind: 'removed' })
  }, [initialData.publishedReadable])

  useEffect(() => {
    setSaveBar(
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button type="button" size="lg" disabled={!dirty || saving} onClick={() => void handleSave()}>
            {saving ? (
              <>
                <Spinner className="size-4" aria-hidden />
                {GLOBAL_MESSAGE_SAVE_PENDING}
              </>
            ) : (
              GLOBAL_MESSAGE_SAVE
            )}
          </Button>
          <Button type="button" variant="outline" size="lg" disabled={!dirty || saving} onClick={handleDiscard}>
            {GLOBAL_MESSAGE_DISCARD}
          </Button>
        </div>
        {hasSavedGlobalMessage(savedValues) ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="sm:ml-auto"
            disabled={saving}
            onClick={() => setRemoveOpen(true)}
          >
            {GLOBAL_MESSAGE_REMOVE}
          </Button>
        ) : null}
      </div>,
    )
    return () => setSaveBar(null)
  }, [dirty, handleDiscard, handleSave, savedValues, saving, setSaveBar])

  if (loadError) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pb-8">
        <header>
          <h1 className="text-xl font-semibold tracking-tight">{GLOBAL_MESSAGE_PAGE_TITLE}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{GLOBAL_MESSAGE_PAGE_DESCRIPTION}</p>
        </header>
        <Alert variant="destructive" role="alert">
          <AlertTitle>{GLOBAL_MESSAGE_LOAD_ERROR_TITLE}</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>{GLOBAL_MESSAGE_LOAD_ERROR_DESCRIPTION}</span>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLoading(true)
                void loadGlobalMessageSettingsAction().then((res) => {
                  setLoading(false)
                  if (!res.ok) {
                    setLoadError(true)
                    return
                  }
                  setLoadError(false)
                  setSavedValues(res.values)
                  setValues(res.values)
                })
              }}
            >
              {GLOBAL_MESSAGE_LOAD_RETRY}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pb-8">
      <header>
        <h1 className="text-xl font-semibold tracking-tight">{GLOBAL_MESSAGE_PAGE_TITLE}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{GLOBAL_MESSAGE_PAGE_DESCRIPTION}</p>
      </header>

      {loading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      ) : null}

      {notice?.kind === 'saved' ? (
        <Alert role="status">
          <AlertTitle>{GLOBAL_MESSAGE_TOAST_SAVED}</AlertTitle>
          <AlertDescription>{GLOBAL_MESSAGE_TOAST_SAVED_HINT}</AlertDescription>
        </Alert>
      ) : null}
      {notice?.kind === 'removed' ? (
        <Alert role="status">
          <AlertTitle>{GLOBAL_MESSAGE_TOAST_REMOVED}</AlertTitle>
          <AlertDescription>{GLOBAL_MESSAGE_TOAST_REMOVED_HINT}</AlertDescription>
        </Alert>
      ) : null}
      {notice?.kind === 'server' ? (
        <Alert variant="destructive" role="alert">
          <AlertTitle>{GLOBAL_MESSAGE_ACTION_ERROR_TITLE}</AlertTitle>
          <AlertDescription>{GLOBAL_MESSAGE_ACTION_ERROR_DESCRIPTION}</AlertDescription>
        </Alert>
      ) : null}

      <GlobalMessagePublishedPanel
        savedMessageIt={savedValues.messageIt}
        savedMessageEn={savedValues.messageEn}
        publishedReadable={publishedReadable}
        published={published}
        publishing={publishing}
      />

      <FieldGroup data-block="modulo-messaggio">
        <Field>
          <FieldLabel htmlFor="global-message-it">{GLOBAL_MESSAGE_FIELD_LABEL}</FieldLabel>
          <Textarea
            id="global-message-it"
            rows={3}
            value={values.messageIt}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                messageIt: collapseGlobalMessageNewlines(e.target.value),
              }))
            }
          />
          <FieldDescription>{GLOBAL_MESSAGE_FIELD_HINT}</FieldDescription>
        </Field>

        <LocalizedTranslationCollapsible
          open={translationOpen}
          onOpenChange={setTranslationOpen}
          hasEnglish={hasEnglishGlobalMessage(values)}
        >
          <Field>
            <FieldLabel htmlFor="global-message-en">{GLOBAL_MESSAGE_FIELD_EN}</FieldLabel>
            <Textarea
              id="global-message-en"
              rows={3}
              value={values.messageEn}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  messageEn: collapseGlobalMessageNewlines(e.target.value),
                }))
              }
            />
            <FieldDescription>{GLOBAL_MESSAGE_TRANSLATION_HINT}</FieldDescription>
          </Field>
        </LocalizedTranslationCollapsible>
      </FieldGroup>

      <MenuDeleteDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        title={GLOBAL_MESSAGE_REMOVE_TITLE}
        description={GLOBAL_MESSAGE_REMOVE_DESCRIPTION}
        confirmLabel={GLOBAL_MESSAGE_REMOVE_CONFIRM}
        pending={removePending}
        destructive
        onConfirm={() => void handleClear()}
      />
    </div>
  )
}
