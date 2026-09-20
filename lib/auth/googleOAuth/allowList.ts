import type { PayloadRequest } from 'payload'

import { normalizeDomain, SETTINGS_SLUG } from '@/lib/auth/allowedDomains'

import type { OAuthLoginArea } from './areas'
import { OAuthLoginRejectedError } from './errors'

type AllowedDomainsGlobal = {
  allowedDomains?: Array<{
    domain?: string | null
    allowAdmin?: boolean | null
    allowApp?: boolean | null
  }> | null
}

export async function assertHostedDomainAllowed(
  req: PayloadRequest,
  hostedDomain: string,
  area: OAuthLoginArea,
): Promise<void> {
  const domain = normalizeDomain(hostedDomain)
  if (!domain) {
    throw new OAuthLoginRejectedError()
  }

  const settings = (await req.payload.findGlobal({
    slug: SETTINGS_SLUG,
    req,
  })) as AllowedDomainsGlobal

  const rows = settings.allowedDomains ?? []
  const match = rows.find((row) => normalizeDomain(row.domain) === domain)

  if (!match) {
    throw new OAuthLoginRejectedError()
  }

  if (area === 'admin' && !match.allowAdmin) {
    throw new OAuthLoginRejectedError()
  }

  if (area === 'app' && !match.allowApp) {
    throw new OAuthLoginRejectedError()
  }
}
