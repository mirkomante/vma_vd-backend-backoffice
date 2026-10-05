# Migrazioni Payload + PostgreSQL

> Procedura passo passo per questo progetto (Payload 3.x, adapter `@payloadcms/db-postgres`).  
> Riferimenti di connessione prod: [`docs/operativo/cloud-sql-produzione.md`](../operativo/cloud-sql-produzione.md). Regole architetturali: `.cursor/rules/stack/01a-db-postgres.mdc`.

---

## Regola d’oro

1. **In sviluppo locale** (`vma_vd_dev`, porta `5432`): lo schema si allinea con **`push`** all’avvio di `pnpm dev` (`NODE_ENV` ≠ `production`). Non usare `pnpm migrate` sul database di sviluppo per generare o validare nuove migrazioni: compare il prompt «dev mode / data loss» e il risultato non è affidabile.
2. **In produzione** (Cloud SQL `vma-vd-backoffice`, via proxy `5433`): lo schema si allinea **solo** con **`pnpm payload migrate`**, eseguito **da locale** **prima** del push su `main` (il deploy automatico non lancia le migrazioni).
3. **Ordine obbligatorio** quando un commit introduce file in `migrations/`: **migrate su prod → push**. Un deploy con codice che si aspetta colonne/tabelle non ancora migrate fallisce a runtime.

---

## Database e porte (non confonderli)

| Ambiente | Host:porta | Database | Utente tipico | Schema |
|----------|------------|----------|---------------|--------|
| Dev locale | `127.0.0.1:5432` | `vma_vd_dev` | `vma_vd_app` (`.env`) | `push` in dev |
| Prod via proxy | `127.0.0.1:5433` | `vma-vd-backoffice` | `vma-vd-user` | solo `migrate` |
| DB vuoto per prove migrate | `127.0.0.1:5432` | es. `vma_vd_migr` | come dev | solo `migrate` (mai Cloud SQL) |

Il `.env` di sviluppo resta su **5432 / dev**. Per prod passare `DATABASE_URL` **solo al comando** (o in quella shell), con password da Secret Manager — mai committata.

---

## Comandi npm (repo root)

| Script | Equivalente | Uso |
|--------|-------------|-----|
| `pnpm migrate` | `pnpm payload migrate` | Applica migrazioni pendenti |
| `pnpm migrate:status` | — | Elenco applicate / pendenti |
| `pnpm migrate:create <nome>` | — | Genera nuovo file in `migrations/` (dopo aver applicato le esistenti sul DB di lavoro) |
| — | `pnpm payload migrate:down` | Annulla l’ultimo batch (solo su DB di prova o prod se serve rollback schema) |

Payload carica `.env` e `payload.config.ts`. Per `migrate:create` / `generate:types`, se usi plugin OAuth, servono in ambiente `APP_PUBLIC_URL`, `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` (altrimenti la config differisce).

Per migrate su prod conviene anche `NODE_ENV=production` (disabilita `push` in config).

---

## Flusso A — Sviluppo quotidiano (nessuna nuova migrazione)

1. Postgres locale in ascolto su `5432`.
2. `.env` con `DATABASE_URL` → `vma_vd_dev`.
3. `pnpm dev`: Payload allinea lo schema con **push** se serve.

Non serve `pnpm migrate` su `vma_vd_dev`.

---

## Flusso B — Sottofase che aggiunge una migrazione (sviluppatore / agente)

Da eseguire **prima del commit** che include i file in `migrations/`.

### B.1 — Codice e tipi

1. Modificare collection/global/hook come da fase di piano.
2. Se cambia lo schema esposto ai tipi:  
   `pnpm generate:types`  
   (con variabili OAuth valorizzate se la config lo richiede).
3. `pnpm typecheck`, `pnpm lint`, `pnpm build` come da fase.

### B.2 — Database vuoto locale (obbligatorio per create + prove)

Serve un database **vuoto**, **solo locale**, **non** `vma_vd_dev` e **mai** Cloud SQL.

**Creazione (una tantum), come superuser Postgres:**

```bash
createdb vma_vd_migr
# oppure, se l’utente applicativo non può creare DB:
psql postgres -c "CREATE DATABASE vma_vd_migr OWNER vma_vd_app;"
```

**Applicare le migrazioni già committate:**

```bash
DATABASE_URL='postgresql://vma_vd_app:PASSWORD@127.0.0.1:5432/vma_vd_migr' \
  pnpm migrate
```

(Sostituire `PASSWORD` con quella dell’utente dev; puoi copiarla dal `.env` cambiando solo il nome database.)

### B.3 — Generare la nuova migrazione

```bash
DATABASE_URL='postgresql://vma_vd_app:PASSWORD@127.0.0.1:5432/vma_vd_migr' \
  pnpm migrate:create nome-descrittivo-snake-case
```

Payload scrive `migrations/YYYYMMDD_HHMMSS_nome....ts` (+ `.json`) e aggiorna `migrations/index.ts`.

### B.4 — Controllo obbligatorio

1. **Leggere** il file `.ts` generato: deve riflettere **solo** le modifiche attese (es. un solo `ALTER TABLE ... ADD COLUMN`). Se compare altro, fermarsi e correggere prima del commit.
2. Applicare sullo stesso DB vuoto:

```bash
DATABASE_URL='postgresql://vma_vd_app:PASSWORD@127.0.0.1:5432/vma_vd_migr' \
  pnpm migrate
```

3. **Prova di ripristino** (solo sul DB vuoto):

```bash
DATABASE_URL='postgresql://vma_vd_app:PASSWORD@127.0.0.1:5432/vma_vd_migr' \
  pnpm payload migrate:down

DATABASE_URL='postgresql://vma_vd_app:PASSWORD@127.0.0.1:5432/vma_vd_migr' \
  pnpm migrate
```

### B.5 — Commit

Includere almeno:

- `migrations/*.ts`, `migrations/*.json`, `migrations/index.ts`
- eventuale `payload-types.ts`
- codice di dominio e documentazione di fase / CHANGELOG

**Non** committare `.env`. Il lockfile va committato se sono cambiate dipendenze.

Su **`vma_vd_dev`**, dopo il commit, basta **`pnpm dev`**: il **push** aggiunge le colonne nuove senza lanciare `pnpm migrate` lì.

---

## Flusso C — Produzione (prima del push)

Eseguire **dopo** il commit locale che contiene la nuova migrazione, **prima** di `git push` su `main`.

### C.1 — Prerequisiti

- [ ] `gcloud auth application-default login` (ADC valida)
- [ ] Ruolo IAM **Cloud SQL Client** su progetto `vma-vd`
- [ ] Binari: `cloud-sql-proxy`, `psql`
- [ ] Password utente **`vma-vd-user`** (prod)

### C.2 — Avviare il proxy (terminale dedicato, lasciato aperto)

```bash
cloud-sql-proxy "vma-vd:europe-west1:vma-vd-database" --port 5433
```

Finché il proxy non gira, `psql` su `5433` risponde **Connection refused**.

Verifica rapida:

```bash
nc -z 127.0.0.1 5433 && echo OK
psql "postgresql://vma-vd-user@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable"
```

(`psql` chiede la password; non legge il `.env`.)

### C.3 — Stato migrazioni

Dalla root del repo (`.env` ancora su dev va bene):

```bash
DATABASE_URL='postgresql://vma-vd-user:PASSWORD@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable' \
  NODE_ENV=production \
  ./scripts/prod-db.sh -- pnpm migrate:status
```

`scripts/prod-db.sh` controlla che qualcosa ascolti su `5433`, poi esegue il comando dopo `--`.

**Atteso:** le migrazioni già applicate in prod risultano OK; quella del commit corrente risulta **pendente**.

### C.4 — Applicare

```bash
DATABASE_URL='postgresql://vma-vd-user:PASSWORD@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable' \
  NODE_ENV=production \
  ./scripts/prod-db.sh -- pnpm payload migrate
```

In output deve comparire la migrazione nuova (nome file coerente con `migrations/`).

### C.5 — Verifica

```bash
DATABASE_URL='postgresql://vma-vd-user:PASSWORD@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable' \
  NODE_ENV=production \
  ./scripts/prod-db.sh -- pnpm migrate:status
```

Tutte le migrazioni del repo devono risultare applicate. Opzionale:

```bash
DATABASE_URL='postgresql://vma-vd-user:PASSWORD@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable' \
  ./scripts/prod-db.sh -- psql "$DATABASE_URL" -c '\d nome_tabella'
```

### C.6 — Push e smoke test

1. `git push` su `main` (deploy Cloud Build / Cloud Run).
2. Dopo il deploy: smoke test indicati nella sottofase (es. login Google, login locale).

---

## Problemi frequenti

| Sintomo | Causa probabile | Cosa fare |
|---------|-----------------|-----------|
| `Connection refused` su `127.0.0.1:5433` | Proxy non avviato | Terminale con `cloud-sql-proxy ... --port 5433` |
| Prompt «dev mode … data loss» | `DATABASE_URL` punta a `vma_vd_dev` (schema da push) | Usare DB vuoto `vma_vd_migr` per B; per prod usare `5433` e `vma-vd-backoffice` |
| Migrate su prod non fa nulla / DB sbagliato | Porta `5432` o database dev | Controllare utente `vma-vd-user` e porta **5433** |
| `prod-db.sh` esce subito | Nessuno in ascolto su 5433 | Avviare il proxy |
| Errore IAM / credential GCP | ADC scaduta o permessi | `gcloud auth application-default login`; ruolo Cloud SQL Client |
| Build OK ma runtime errore SQL | Push **prima** della migrate prod | Migrate prod, poi push; eventuale rollback revisione Cloud Run |

---

## Rollback (solo se necessario)

- **Applicativo:** ridistribuire la revisione Cloud Run precedente (codice vecchio).
- **Schema:** le migrazioni addititive/nullable spesso restano compatibili col codice precedente; per annullare l’ultima migrazione su prod (operazione rara e da pianificare):

```bash
DATABASE_URL='postgresql://vma-vd-user:PASSWORD@127.0.0.1:5433/vma-vd-backoffice?sslmode=disable' \
  NODE_ENV=production \
  ./scripts/prod-db.sh -- pnpm payload migrate:down
```

Valutare sempre l’impatto sui dati e sul codice già deployato.

---

## Riferimenti incrociati

- Connessione istanza, formato URL, helper: [`docs/operativo/cloud-sql-produzione.md`](../operativo/cloud-sql-produzione.md)
- Ordine migrate vs deploy (Fase 3): [`docs/piano-sviluppo/fase-3-db-postgres.md`](../piano-sviluppo/fase-3-db-postgres.md) § 3.1
- Principio «migrate prod prima del push» nelle fasi di dominio: [`docs/piano-sviluppo/fase-7-impostazioni-sistema.md`](../piano-sviluppo/fase-7-impostazioni-sistema.md) (e analoghe checklist)
- Script helper: `scripts/prod-db.sh`
