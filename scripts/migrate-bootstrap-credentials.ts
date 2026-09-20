import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Migrazione una tantum: super-admin creati col seed legacy (loginMethod locale +
 * hash/salt sul campo auth) → credenziali su bootstrapCredential* e loginMethod sso.
 * Copia gli stessi hash/salt: la password di emergenza resta invariata.
 *
 * Uso: pnpm migrate:bootstrap-credentials
 */
async function migrateBootstrapCredentials(): Promise<void> {
  const payload = await getPayload({ config })

  try {
    const legacy = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 100,
      overrideAccess: true,
      showHiddenFields: true,
      where: {
        and: [
          { adminRole: { equals: 'super-admin' } },
          { loginMethod: { in: ['local', 'sso-and-local'] } },
          { bootstrapCredentialHash: { exists: false } },
        ],
      },
    })

    if (legacy.docs.length === 0) {
      payload.logger.info(
        'Migrazione bootstrap: nessun super-admin legacy da migrare (già aggiornati o assenti).',
      )
      return
    }

    for (const doc of legacy.docs) {
      const hash = doc.hash
      const salt = doc.salt
      if (typeof hash !== 'string' || typeof salt !== 'string') {
        throw new Error(
          `Utente ${doc.email} (id ${doc.id}): super-admin legacy senza hash/salt utilizzabili.`,
        )
      }

      await payload.update({
        collection: 'users',
        id: doc.id,
        overrideAccess: true,
        data: {
          loginMethod: 'sso',
          bootstrapCredentialHash: hash,
          bootstrapCredentialSalt: salt,
        },
      })

      payload.logger.info(`Migrazione bootstrap: aggiornato ${doc.email} (id ${doc.id}).`)
    }

    payload.logger.info(`Migrazione bootstrap: completata (${legacy.docs.length} record).`)
  } finally {
    await payload.destroy()
  }
}

try {
  await migrateBootstrapCredentials()
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Migrazione bootstrap non riuscita: ${message}`)
  process.exit(1)
}
