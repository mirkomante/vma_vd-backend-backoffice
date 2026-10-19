import { config as loadEnv } from 'dotenv'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import config from '@payload-config'
import { getPayload } from 'payload'

import { assertDevDatabaseFromEnv } from '../../scripts/import-menu-vtn-backend/databaseUrl'
import { countVerifyUiRecords } from '../lib/cleanup-fixtures'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '../..')
loadEnv({ path: join(root, '.env') })
assertDevDatabaseFromEnv()

const payload = await getPayload({ config })
try {
  const total = await countVerifyUiRecords(payload)
  process.stdout.write(JSON.stringify({ total }))
} finally {
  await payload.destroy()
}
