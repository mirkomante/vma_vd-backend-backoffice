#!/usr/bin/env bash
# Ricrea vma_vd_migr e applica migrate + migrate:create --skip-empty (fase 6.4, come 6.2).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "verify-menu-6_4-migrate: .env mancante" >&2
  exit 1
fi

export DATABASE_URL="$(node -e "
const fs = require('fs');
const lines = fs.readFileSync('.env', 'utf8').split(/\\r?\\n/);
for (const line of lines) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  if (t.startsWith('DATABASE_URL=')) {
    const v = t.slice('DATABASE_URL='.length).trim();
    process.stdout.write(v.replace(/^['\"]|['\"]$/g, ''));
    process.exit(0);
  }
}
process.exit(1);
")"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "verify-menu-6_4-migrate: DATABASE_URL mancante" >&2
  exit 1
fi

MIGR_URL="$(node -e "
const u = new URL(process.env.DATABASE_URL);
const db = u.pathname.replace(/^\\//,'').split('?')[0];
if (db === 'vma_vd_migr') process.stdout.write(process.env.DATABASE_URL);
else {
  u.pathname = '/vma_vd_migr';
  process.stdout.write(u.toString());
}
")"

if [[ "$MIGR_URL" != *"/vma_vd_migr"* ]]; then
  echo "verify-menu-6_4-migrate: URL migr non punta a vma_vd_migr" >&2
  exit 1
fi

echo "verify-menu-6_4-migrate: DROP/CREATE vma_vd_migr (psql postgres)"
if ! psql postgres -c "DROP DATABASE IF EXISTS vma_vd_migr WITH (FORCE);"; then
  echo "verify-menu-6_4-migrate: DROP DATABASE fallito — fermarsi (permessi psql)" >&2
  exit 1
fi
if ! psql postgres -c "CREATE DATABASE vma_vd_migr OWNER vma_vd_app;"; then
  echo "verify-menu-6_4-migrate: CREATE DATABASE fallito — fermarsi (permessi psql)" >&2
  exit 1
fi

export NODE_ENV=production
export DATABASE_URL="$MIGR_URL"

echo "verify-menu-6_4-migrate: pnpm migrate"
pnpm migrate

echo "verify-menu-6_4-migrate: pnpm migrate:create --skip-empty"
pnpm migrate:create --skip-empty

echo "verify-menu-6_4-migrate: OK"
