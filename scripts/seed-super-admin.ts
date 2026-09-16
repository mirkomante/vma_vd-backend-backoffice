import config from '@payload-config'
import { getPayload } from 'payload'

import { loginMethodIncludesLocal } from '@/lib/auth/roles'
import { validatePasswordPolicy } from '@/lib/auth/passwordPolicy'

/**
 * Crea il super-admin locale di bootstrap. Credenziali solo da env, mai hardcoded.
 * Idempotente: se l’email esiste già ed è un super-admin locale attivo, esce senza
 * toccare la password. Stesso script in ogni ambiente (nessun ramo dev/prod).
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
      where: { email: { equals: email } },
    })

    const found = existing.docs[0]
    if (found) {
      const isBootstrap =
        found.adminRole === 'super-admin' &&
        found.active !== false &&
        loginMethodIncludesLocal(found.loginMethod)

      if (isBootstrap) {
        payload.logger.info(
          `Seed super-admin: utente ${email} già presente come super-admin locale attivo. Nessuna modifica.`,
        )
        return
      }

      throw new Error(
        `Esiste già un utente con email ${email}, ma non è un super-admin locale attivo. Interrompo senza sovrascrivere.`,
      )
    }

    await payload.create({
      collection: 'users',
      overrideAccess: true,
      data: {
        email,
        password,
        adminRole: 'super-admin',
        appRole: 'none',
        loginMethod: 'local',
        active: true,
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
