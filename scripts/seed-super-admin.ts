import config from '@payload-config'
import { getPayload } from 'payload'

import { hashLocalPassword } from '@/lib/auth/localCredentials/hash'
import { validatePasswordPolicy } from '@/lib/auth/passwordPolicy'

/**
 * Crea il super-admin di bootstrap. Credenziali emergenza in bootstrapCredential*;
 * loginMethod SSO (ADR-004). Email/password solo da env, mai hardcoded.
 * Idempotente: se l’email esiste già come bootstrap attivo, esce senza toccare le credenziali.
 *
 * Uso: SEED_SUPERADMIN_EMAIL=... SEED_SUPERADMIN_PASSWORD=... pnpm seed:super-admin
 */
const EMAIL_ENV = 'SEED_SUPERADMIN_EMAIL'
const PASSWORD_ENV = 'SEED_SUPERADMIN_PASSWORD'

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Variabile d’ambiente ${name} mancante o vuota.`)
  }
  return value
}

async function seedSuperAdmin(): Promise<void> {
  const email = readRequiredEnv(EMAIL_ENV).toLowerCase()
  const password = readRequiredEnv(PASSWORD_ENV)

  const policy = validatePasswordPolicy(password)
  if (policy !== true) {
    throw new Error(policy)
  }

  const payload = await getPayload({ config })

  try {
    const existing = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      showHiddenFields: true,
      where: { email: { equals: email } },
    })

    const found = existing.docs[0]
    if (found) {
      const isBootstrap =
        found.adminRole === 'super-admin' &&
        found.active !== false &&
        Boolean(found.bootstrapCredentialHash)

      if (isBootstrap) {
        payload.logger.info(
          `Seed super-admin: utente ${email} già presente come super-admin bootstrap attivo. Nessuna modifica.`,
        )
        return
      }

      throw new Error(
        `Esiste già un utente con email ${email}, ma non è un super-admin bootstrap attivo. Interrompo senza sovrascrivere.`,
      )
    }

    const { hash, salt } = await hashLocalPassword(password)

    await payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        email,
        adminRole: 'super-admin',
        appRole: 'none',
        loginMethod: 'sso',
        active: true,
        bootstrapCredentialHash: hash,
        bootstrapCredentialSalt: salt,
      },
    })

    payload.logger.info(`Seed super-admin: creato utente ${email}.`)
  } finally {
    await payload.destroy()
  }
}

try {
  await seedSuperAdmin()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Seed super-admin non riuscito: ${message}`)
  process.exit(1)
}
