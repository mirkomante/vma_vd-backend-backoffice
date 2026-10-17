'use client'

import { RefreshCw } from 'lucide-react'
import { useState } from 'react'

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
import { PUBLIC_MENU_REBUILD_UI_ENABLED } from '@/lib/menu/publicMenuRebuild'

type PublicMenuRebuildActionsProps = {
  onConfirm?: () => void | Promise<void>
}

export function PublicMenuRebuildActions({ onConfirm }: PublicMenuRebuildActionsProps) {
  const [open, setOpen] = useState(false)

  if (!PUBLIC_MENU_REBUILD_UI_ENABLED) {
    return null
  }

  return (
    <>
      <Button type="button" variant="outline" size="lg" onClick={() => setOpen(true)}>
        <RefreshCw className="size-4" aria-hidden />
        Ricompila il menù pubblico
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ricompilare il menù pubblico?</AlertDialogTitle>
            <AlertDialogDescription>
              La pubblicazione richiede alcuni minuti. Serve per vedere piatti nuovi e modifiche ai
              contenuti, ai servizi, agli orari, alle chiusure e ai giorni speciali. «Terminato» e
              «disabilitato» valgono già.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Indietro</AlertDialogCancel>
            <Button
              type="button"
              onClick={async () => {
                await onConfirm?.()
                setOpen(false)
              }}
            >
              Ricompila
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
