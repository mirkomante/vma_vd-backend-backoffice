/**
 * Carica `.env` poi `.env.development.local` (override DATABASE_URL → vma_vd_migr)
 * ed esegue il comando passato (es. `pnpm dev` o `pnpm payload run …`).
 * Uso locale per verify 7.4: dev e script sullo stesso DB.
 */
import { spawnSync } from 'node:child_process'
import { config } from 'dotenv'

config({ path: '.env' })
config({ path: '.env.development.local', override: true })

const db = process.env.DATABASE_URL ?? ''
if (!/\/vma_vd_migr(\?|$)/.test(db)) {
  console.error('DATABASE_URL deve essere vma_vd_migr (creare .env.development.local).')
  process.exit(1)
}

const [cmd, ...args] = process.argv.slice(2)
if (!cmd) {
  console.error('Usage: node scripts/run-with-vma-vd-migr-env.mjs <cmd> [args…]')
  process.exit(1)
}

const result = spawnSync(cmd, args, { stdio: 'inherit', env: process.env, shell: false })
process.exit(result.status ?? 1)
