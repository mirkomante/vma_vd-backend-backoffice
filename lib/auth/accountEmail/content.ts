import { getPublicAppUrl } from '@/lib/email/env'
import type { UserAccessFields } from '@/lib/auth/roles'

function appAuthUrl(path: string): string {
  return `${getPublicAppUrl()}${path}`
}

function accessLinksForUser(user: UserAccessFields): string[] {
  const links: string[] = []
  const adminRole = user.adminRole ?? 'none'
  const appRole = user.appRole ?? 'none'

  if (adminRole !== 'none') {
    links.push(`<li><a href="${appAuthUrl('/admin')}">Pannello Admin</a> (${appAuthUrl('/admin')})</li>`)
  }

  const showApp =
    appRole !== 'none' || adminRole === 'admin' || adminRole === 'super-admin'

  if (showApp) {
    links.push(
      `<li><a href="${appAuthUrl('/app/login')}">Area App</a> (${appAuthUrl('/app/login')})</li>`,
    )
  }

  return links
}

export function accountCreatedEmailContent(
  user: UserAccessFields,
): { subject: string; html: string } {
  const links = accessLinksForUser(user)
  const linksBlock =
    links.length > 0
      ? `<ul>${links.join('')}</ul>`
      : '<p>Per l’accesso usa l’indirizzo che ti è stato comunicato.</p>'

  return {
    subject: 'Il tuo account è stato creato',
    html: `<p>È stato creato un account per te.</p>
${linksBlock}
<p>Accedi con l’account Google del dominio autorizzato per la tua organizzazione.</p>
<p>Per problemi di accesso, rivolgiti a chi ti ha creato l’account.</p>`,
  }
}
