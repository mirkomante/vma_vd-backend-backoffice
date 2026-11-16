'use client'

import { RefreshCw } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  MENU_REBUILD_CONFIRM_LOADING_LABEL,
  MENU_REBUILD_OUTCOME_ALREADY_STARTED,
  MENU_REBUILD_OUTCOME_ERROR,
  MENU_REBUILD_OUTCOME_STARTED,
} from '@/lib/menu/rebuild/copy'
import { PUBLIC_MENU_REBUILD_UI_ENABLED } from '@/lib/menu/publicMenuRebuild'

type DialogPhase = 'confirm' | 'loading' | 'outcome'

type OutcomeKind = 'started' | 'already-started' | 'error'

async function requestMenuRebuild(): Promise<{
  httpStatus: number
  body: { status?: string; buildId?: string }
}> {
  const res = await fetch('/api/menu/rebuild', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  })
  const body = (await res.json().catch(() => ({}))) as { status?: string; buildId?: string }
  return { httpStatus: res.status, body }
}

function resolveOutcome(
  httpStatus: number,
  body: { status?: string },
): { kind: OutcomeKind; message: string } {
  if (httpStatus === 202 || body.status === 'started') {
    return { kind: 'started', message: MENU_REBUILD_OUTCOME_STARTED }
  }
  if (httpStatus === 200 && body.status === 'already-started') {
    return { kind: 'already-started', message: MENU_REBUILD_OUTCOME_ALREADY_STARTED }
  }
  return { kind: 'error', message: MENU_REBUILD_OUTCOME_ERROR }
}

export function PublicMenuRebuildActions() {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<DialogPhase>('confirm')
  const [outcomeKind, setOutcomeKind] = useState<OutcomeKind>('started')
  const [outcomeMessage, setOutcomeMessage] = useState('')

  if (!PUBLIC_MENU_REBUILD_UI_ENABLED) {
    return null
  }

  const handleOpenChange = (next: boolean) => {
    if (phase === 'loading' && !next) {
      return
    }
    setOpen(next)
    if (!next) {
      setPhase('confirm')
      setOutcomeMessage('')
    }
  }

  const handleConfirm = async () => {
    setPhase('loading')
    try {
      const { httpStatus, body } = await requestMenuRebuild()
      const outcome = resolveOutcome(httpStatus, body)
      setOutcomeKind(outcome.kind)
      setOutcomeMessage(outcome.message)
      setPhase('outcome')
    } catch {
      setOutcomeKind('error')
      setOutcomeMessage(MENU_REBUILD_OUTCOME_ERROR)
      setPhase('outcome')
    }
  }

  const showOutcome = phase === 'outcome'

  return (
    <>
      <Button type="button" variant="outline" size="lg" onClick={() => setOpen(true)}>
        <RefreshCw className="size-4" aria-hidden />
        Ricompila il menù pubblico
      </Button>
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ricompilare il menù pubblico?</AlertDialogTitle>
            <AlertDialogDescription>
              La pubblicazione richiede alcuni minuti. Serve per vedere piatti nuovi e modifiche ai
              contenuti, ai servizi, agli orari, alle chiusure e ai giorni speciali. «Terminato» e
              «disabilitato» valgono già.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {showOutcome ? (
            <Alert
              variant={outcomeKind === 'error' ? 'destructive' : 'default'}
              role={outcomeKind === 'error' ? 'alert' : 'status'}
            >
              <AlertDescription>{outcomeMessage}</AlertDescription>
            </Alert>
          ) : null}
          <AlertDialogFooter>
            {showOutcome ? (
              <Button type="button" onClick={() => handleOpenChange(false)}>
                Chiudi
              </Button>
            ) : (
              <>
                <AlertDialogCancel disabled={phase === 'loading'}>Indietro</AlertDialogCancel>
                <Button type="button" disabled={phase === 'loading'} onClick={handleConfirm}>
                  {phase === 'loading' ? MENU_REBUILD_CONFIRM_LOADING_LABEL : 'Ricompila'}
                </Button>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}