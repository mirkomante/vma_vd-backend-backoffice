# Cloud SQL di produzione — connessione locale e migrate

> Riferimento operativo per Fase 3.1 (chiusa 2026-09-29: istanza + migrate `20260929_141010_initial_schema` su `vma-vd-backoffice`). Decisioni di sizing/regione: `ADR-110-istanza-cloud-sql-produzione.md`. Nessuna password in questo file.  
> **Procedura completa** (dev, DB vuoto, create, prod prima del push): [`docs/procedure/migrazioni-payload-postgres.md`](../procedure/migrazioni-payload-postgres.md).

## Istanza

| Campo | Valore |
|--------|--------|
| Progetto GCP | `vma-vd` |
| Nome connessione | `vma-vd:europe-west1:vma-vd-database` |
| Regione | `europe-west1` |
| Utente DB applicativo | `vma-vd-user` (nome in console; non committare password) |
| Database PostgreSQL | `vma-vd-backoffice` (≠ nome istanza Cloud SQL) |

## Prerequisiti locali

- `gcloud auth application-default login` (ADC per il proxy)
- Ruolo IAM **Cloud SQL Client** sul progetto
- Binari: `cloud-sql-proxy`, `psql` (client libpq)

## Auth Proxy (terminale dedicato)

```bash
cloud-sql-proxy "vma-vd:europe-west1:vma-vd-database" --port 5433
```

Il proxy espone Postgres in chiaro su `127.0.0.1:5433`; la cifratura verso Cloud SQL è gestita dal proxy → usare **`sslmode=disable`** solo su questo hop locale.

## Test rapido

```bash
psql "postgresql://vma-vd-user@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable"
```

## `DATABASE_URL` via proxy (solo da locale, migrate / seed)

Formato (sostituire `NOME_DATABASE` e password):

```text
postgresql://vma-vd-user:PASSWORD@127.0.0.1:5433/NOME_DATABASE?sslmode=disable
```

Su **Cloud Run** (§ 3.2) la stringa va nel secret `DATABASE_URL` e usa il socket Unix del connettore (non `127.0.0.1:5433`). Sul servizio Cloud Run abilitare la connessione all'istanza `vma-vd:europe-west1:vma-vd-database`, poi:

```text
postgresql://vma-vd-user:PASSWORD@/vma-vd-backoffice?host=/cloudsql/vma-vd:europe-west1:vma-vd-database
```

(Sostituire `PASSWORD`; nessuna password in repo.)

## Migrate / seed su produzione

1. Proxy in ascolto su `5433`.
2. **Preferito:** lasciare `.env` con credenziali **locali** (5432 / `vma_vd_dev`) e passare `DATABASE_URL` prod **solo al comando** (porta **5433**, utente Cloud SQL — non 5432):

```bash
DATABASE_URL='postgresql://vma-vd-user:PASSWORD@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable' pnpm migrate
DATABASE_URL='postgresql://vma-vd-user:PASSWORD@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable' pnpm migrate:status
```

3. Alternativa (file di fase): backup `.env` → sovrascrivere `DATABASE_URL` → `pnpm migrate` → ripristino immediato.

Su Cloud SQL **vuoto** non compare il prompt “dev mode / data loss”. Su **`vma_vd_dev` locale** (già allineato con `push`) il migrate fallisce o chiede conferma — non usare 5432 per prod.

## Helper

`scripts/prod-db.sh` verifica che il proxy risponda su `5433`, poi esegue il comando passato dopo `--` (es. `./scripts/prod-db.sh -- pnpm migrate:status` con `DATABASE_URL` prod già in ambiente o inline).
