'use client'

import { Button, toast, useDocumentForm, useDocumentInfo } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'
import React, { useCallback, useState } from 'react'

import { loginMethodIncludesLocal, type LoginMethod } from '@/lib/auth/roles'

/**
 * Pulsante Admin «Reinvia email di attivazione» (fase-8.4, classe A).
 */
export const ResendActivationEmailUi: UIFieldClientComponent = () => {
  const { id } = useDocumentInfo()
  const { getDataByPath } = useDocumentForm()
  const [pending, setPending] = useState(false)

  const loginMethod = getDataByPath('loginMethod') as LoginMethod | undefined
  const emailVerified = getDataByPath('emailVerified') as boolean | null | undefined

  const visible =
    Boolean(id) &&
    loginMethodIncludesLocal(loginMethod) &&
    emailVerified === false

  const handleResend = useCallback(async () => {
    if (!id || pending) {
      return
    }

    setPending(true)
    try {
      const response = await fetch('/api/users/resend-activation', {
        body: JSON.stringify({ id }),
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean
        message?: string
      }

      if (response.ok && payload.ok) {
        toast.success(payload.message ?? 'Email di attivazione inviata.')
      } else {
        toast.error(payload.message ?? 'Invio non riuscito. Riprova più tardi.')
      }
    } catch {
      toast.error('Invio non riuscito. Riprova più tardi.')
    } finally {
      setPending(false)
    }
  }, [id, pending])

  if (!visible) {
    return null
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p className="field-description" style={{ marginBottom: '0.75rem' }}>
        L’utente non ha ancora confermato l’indirizzo email. Un nuovo invio invalida il link
        precedente.
      </p>
      <Button buttonStyle="secondary" disabled={pending} onClick={handleResend} type="button">
        {pending ? 'Invio in corso…' : 'Reinvia email di attivazione'}
      </Button>
    </div>
  )
}
