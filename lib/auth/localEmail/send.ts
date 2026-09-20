import type { Payload, PayloadRequest } from 'payload'

import { getPublicAppUrl } from '@/lib/email/env'

function appAuthUrl(path: string): string {
  return `${getPublicAppUrl()}${path}`
}

/**
 * Invio via adapter Payload (`payload.sendEmail`). Un fallimento non deve
 * cambiare il messaggio o il flusso lato utente — si logga e si va avanti.
 */
export async function sendAppAuthEmail(args: {
  payload: Payload
  req?: PayloadRequest
  to: string
  subject: string
  html: string
}): Promise<void> {
  const { payload, to, subject, html } = args
  try {
    await payload.sendEmail({
      to,
      subject,
      html,
    })
  } catch (error) {
    payload.logger.error({
      err: error,
      msg: 'Invio email transazionale non riuscito',
    })
  }
}

export function activationEmailContent(token: string): { subject: string; html: string } {
  const href = appAuthUrl(`/app/login/verify?token=${encodeURIComponent(token)}`)
  return {
    subject: 'Conferma il tuo indirizzo email',
    html: `<p>È stato creato un account per l’Area App. Conferma l’indirizzo aprendo questo link:</p>
<p><a href="${href}">${href}</a></p>
<p>Se non te lo aspettavi, puoi ignorare questo messaggio.</p>`,
  }
}

export function resetPasswordEmailContent(token: string): { subject: string; html: string } {
  const href = appAuthUrl(`/app/login/reset?token=${encodeURIComponent(token)}`)
  return {
    subject: 'Reimposta la password',
    html: `<p>Hai richiesto di reimpostare la password dell’Area App. Il link è valido per un’ora:</p>
<p><a href="${href}">${href}</a></p>
<p>Se non hai fatto tu questa richiesta, puoi ignorare questo messaggio.</p>`,
  }
}
