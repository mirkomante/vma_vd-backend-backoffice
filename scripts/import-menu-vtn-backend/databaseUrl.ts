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
