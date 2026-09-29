#!/usr/bin/env bash
# Verifica Cloud SQL Auth Proxy in locale ed esegue un comando (migrate, seed, psql via env, ecc.).
# Prerequisito: DATABASE_URL in .env (o in ambiente) punta al DB prod via 127.0.0.1 e proxy acceso.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONNECTION_NAME="${CLOUD_SQL_CONNECTION_NAME:-vma-vd:europe-west1:vma-vd-database}"
PROXY_PORT="${CLOUD_SQL_PROXY_PORT:-5433}"

if [[ $# -lt 1 ]]; then
  echo "Uso: $0 -- <comando...>" >&2
  echo "Esempio (proxy già avviato, DATABASE_URL prod in .env):" >&2
  echo "  $0 -- pnpm payload migrate" >&2
  echo "" >&2
  echo "Avvia il proxy in un altro terminale:" >&2
  echo "  cloud-sql-proxy \"${CONNECTION_NAME}\" --port ${PROXY_PORT}" >&2
  exit 1
fi

if [[ "$1" != "--" ]]; then
  echo "Primo argomento deve essere --" >&2
  exit 1
fi
shift

if ! command -v nc >/dev/null 2>&1; then
  echo "Attenzione: 'nc' non trovato; salto il controllo porta ${PROXY_PORT}." >&2
else
  if ! nc -z 127.0.0.1 "${PROXY_PORT}" 2>/dev/null; then
    echo "Nessun servizio in ascolto su 127.0.0.1:${PROXY_PORT}." >&2
    echo "Avvia: cloud-sql-proxy \"${CONNECTION_NAME}\" --port ${PROXY_PORT}" >&2
    exit 1
  fi
fi

cd "${ROOT}"
exec "$@"
