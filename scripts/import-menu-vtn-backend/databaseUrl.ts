import { DEV_DB_HOST, DEV_DB_NAME, DEV_DB_PORT } from './constants'

export type DatabaseTarget = {
  host: string
  port: string
  database: string
  display: string
}

export function parseDatabaseTarget(databaseUrl: string): DatabaseTarget {
  const url = new URL(databaseUrl)
  const host = url.hostname
  const port = url.port || (url.protocol === 'postgres:' ? '5432' : '')
  const database = url.pathname.replace(/^\//, '').split('?')[0] ?? ''
  return {
    host,
    port,
    database,
    display: `${host}:${port}/${database}`,
  }
}

export function isDevDatabaseTarget(target: DatabaseTarget): boolean {
  return (
    target.host === DEV_DB_HOST &&
    target.port === DEV_DB_PORT &&
    target.database === DEV_DB_NAME
  )
}

const DEV_DATABASE_DISPLAY = `${DEV_DB_HOST}:${DEV_DB_PORT}/${DEV_DB_NAME}`

/** Rifiuta l'avvio se `DATABASE_URL` non punta al DB dev locale (verify script). */
export function assertDevDatabaseFromEnv(): void {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) {
    throw new Error('DATABASE_URL mancante')
  }
  const target = parseDatabaseTarget(url)
  if (!isDevDatabaseTarget(target)) {
    throw new Error(
      `Script di verifica consentito solo su ${DEV_DATABASE_DISPLAY}, ottenuto ${target.display}`,
    )
  }
}
