import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Settings } from './globals/Settings'
import { isGoogleOAuthConfigured } from './lib/auth/googleOAuth/env'
import { googleOAuthAdminPlugin, googleOAuthAppPlugin } from './lib/auth/googleOAuth/plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // push consentito solo in sviluppo locale (migrazioni obbligatorie altrove — vedi stack/01a-db-postgres.mdc)
    push: process.env.NODE_ENV !== 'production',
  }),
  admin: {
    user: Users.slug,
    components: {
      beforeLogin: ['@/components/auth/AdminGoogleLoginBefore'],
    },
  },
  collections: [Users],
  globals: [Settings],
  plugins: isGoogleOAuthConfigured()
    ? [googleOAuthAdminPlugin(), googleOAuthAppPlugin()]
    : [],
  sharp,
})
