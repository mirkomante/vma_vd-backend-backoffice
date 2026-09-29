---
stato: validato
---

# Fase 3 — Variante database: PostgreSQL (Cloud SQL)

> Istruzioni operative per la sottofase **3.1** di `fase-3-deploy.md`. Da allegare insieme a `fase-3-deploy.md` nella chat dedicata a quella sottofase. Vedi anche `stack/01a-db-postgres.mdc` nel catalogo regole per le convenzioni architetturali che questa variante rispetta.

---

## 3.1 — Cloud SQL for PostgreSQL

**Passaggio esterno (umano, console GCP, prima del codice)**:
- [x] Creare un'istanza **Cloud SQL for PostgreSQL** — parametri in `ADR-110-istanza-cloud-sql-produzione.md` (Enterprise, PG 18, `db-f1-micro`, `europe-west1`, zona singola).
- [x] Region allineata a § 3.2 (`europe-west1`, fissata in ADR-110).
- [x] **Un solo utente database** (`vma-vd-user`) sul database di progetto (non admin istanza).
- [x] Password random — solo Secret Manager § 3.2 / `.env` temporaneo locale, non in repo.
- [x] Connessione: **Cloud SQL Auth Proxy + IAM**, reti autorizzate vuote, IP pubblico + SSL istanza (ADR-110).
- [x] Connection string pronta per secret `DATABASE_URL` (via proxy in locale: `sslmode=disable` su `127.0.0.1:5433`).

**Checklist per l'agente** (dopo conferma umana che Cloud SQL è pronto):
- [x] Aggiornare `.env.example` + nota operativa `docs/operativo/cloud-sql-produzione.md`, helper `scripts/prod-db.sh`.
- [x] Generare e committare migrazioni iniziali (`migrations/20260929_141010_initial_schema.*`).
- [x] Eseguire `pnpm payload migrate` su Cloud SQL prod con proxy (`5433`, database `vma-vd-backoffice`) — eseguito 2026-09-29; il tentativo su `vma_vd_dev` locale fallisce se lo schema esiste già da `push` (atteso).

**Migrazioni in produzione**: `payload migrate` si esegue **manualmente da locale**, puntando temporaneamente alla connection string di produzione — stesso pattern operativo del seed di bootstrap (`fase-3-deploy.md` § 3.4): backup del proprio `.env` locale → sovrascrivere temporaneamente `DATABASE_URL` con il valore di produzione → eseguire `payload migrate` → ripristinare subito il proprio `.env` di sviluppo. Non è un passo automatico nella pipeline di build/deploy (§ 3.2) — coerente con la scelta di non introdurre infrastruttura permanente per un'operazione non legata ad ogni singolo deploy di codice.

**Attenzione — ordine delle operazioni**: eseguire le migrazioni **prima** di un deploy che assume lo schema aggiornato, non dopo — un deploy che si aspetta una colonna/tabella non ancora migrata fallisce a runtime, non in fase di build.

---

Al termine, torna a `fase-3-deploy.md`, sottofase 3.1, e verifica lì la checklist di chiusura prima di passare a 3.2.
