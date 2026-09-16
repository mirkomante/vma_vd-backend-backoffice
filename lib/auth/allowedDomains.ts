import { ValidationError } from 'payload'

/**
 * Identificatore SSO per Google Workspace: il claim `hd` dell’id_token.
 * La verifica contro questa lista avviene in 2.4/2.5, non nel login locale (2.6).
 */
export const SETTINGS_SLUG = 'settings'

export const EMPTY_ALLOW_LIST_MESSAGE =
  'Non è possibile salvare l’allow-list senza almeno un dominio autorizzato.'

export const INVALID_DOMAIN_MESSAGE =
  'Il dominio deve essere un nome host valido (es. esempio.com), senza protocollo né percorso.'

export const DUPLICATE_DOMAIN_MESSAGE = 'Questo dominio è già presente in elenco.'

/** FQDN con almeno due etichette; nessuna porta, path o schema. */
const DOMAIN_PATTERN =
  /^(?=.{1,253}$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/

export type AllowedDomainEntry = {
  id?: string
  domain?: string | null
  allowAdmin?: boolean | null
  allowApp?: boolean | null
}

export type SettingsWriteData = {
  allowedDomains?: AllowedDomainEntry[] | null
}

export function normalizeDomain(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim().toLowerCase()
}

export function isValidDomainFormat(domain: string): boolean {
  return DOMAIN_PATTERN.test(domain)
}

/**
 * Trim/lowercase, formato, duplicati, e rifiuto se la lista risultasse vuota.
 * Restituisce le voci normalizzate da riassegnare su `data` prima del salvataggio.
 */
export function prepareAllowedDomains(
  data: SettingsWriteData | undefined,
): AllowedDomainEntry[] {
  const rows = data?.allowedDomains
  if (!rows || rows.length === 0) {
    throwAllowListError(EMPTY_ALLOW_LIST_MESSAGE, 'allowedDomains')
  }

  const seen = new Set<string>()
  const next: AllowedDomainEntry[] = []

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index]
    const domain = normalizeDomain(row?.domain)
    const path = `allowedDomains.${index}.domain`

    if (!isValidDomainFormat(domain)) {
      throwAllowListError(INVALID_DOMAIN_MESSAGE, path)
    }

    if (seen.has(domain)) {
      throwAllowListError(DUPLICATE_DOMAIN_MESSAGE, path)
    }

    seen.add(domain)
    next.push({
      ...row,
      domain,
    })
  }

  return next
}

function throwAllowListError(message: string, path: string): never {
  throw new ValidationError({
    global: SETTINGS_SLUG,
    errors: [{ message, path }],
  })
}
