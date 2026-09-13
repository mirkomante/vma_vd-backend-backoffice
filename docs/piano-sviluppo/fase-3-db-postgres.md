---
stato: validato
---

# Fase 3 — Variante database: PostgreSQL (Cloud SQL)

> Istruzioni operative per la sottofase **3.1** di `fase-3-deploy.md`. Da allegare insieme a `fase-3-deploy.md` nella chat dedicata a quella sottofase. Vedi anche `stack/01a-db-postgres.mdc` nel catalogo regole per le convenzioni architetturali che questa variante rispetta.

---

## 3.1 — Cloud SQL for PostgreSQL

**Passaggio esterno (umano, console GCP, prima del codice)**:
- [ ] Creare un'istanza **Cloud SQL for PostgreSQL**, tier minimo adeguato alla scala attesa del progetto (rivalutare se il progetto si avvicina all'uso reale con carichi più alti).
- [ ] Region allineata alla region scelta per l'ambiente cloud (§ 3.2), per minimizzare latenza.
- [ ] **Un solo utente database**, con permessi sul solo database del progetto (non ruoli di amministrazione istanza) — stesso utente per migrazioni, seed e app a runtime, nessuna separazione.
- [ ] Password generata random (generatore GCP o password manager) — **non annotarla in chiaro da nessuna parte**: verrà incollata direttamente nel gestore di secret dell'ambiente cloud (§ 3.2).
- [ ] Connessione: valutare Cloud SQL Auth Proxy o IP autorizzati diretti, in base ai requisiti di sicurezza del progetto — stesso principio di proporzionalità già applicato all'allowlist Atlas nel gemello MongoDB: non introdurre Private IP/VPC se il progetto non lo richiede esplicitamente.
- [ ] Copiare la connection string con utente/password sostituiti — è il valore che andrà nel secret `DATABASE_URL`.

**Checklist per l'agente** (dopo conferma umana che Cloud SQL è pronto):
- [ ] Aggiornare `.env.example` con un commento che indichi Cloud SQL come DB di produzione (nessuna credenziale reale nel file).

**Migrazioni in produzione**: `payload migrate` si esegue **manualmente da locale**, puntando temporaneamente alla connection string di produzione — stesso pattern operativo del seed di bootstrap (`fase-3-deploy.md` § 3.4): backup del proprio `.env` locale → sovrascrivere temporaneamente `DATABASE_URL` con il valore di produzione → eseguire `payload migrate` → ripristinare subito il proprio `.env` di sviluppo. Non è un passo automatico nella pipeline di build/deploy (§ 3.2) — coerente con la scelta di non introdurre infrastruttura permanente per un'operazione non legata ad ogni singolo deploy di codice.

**Attenzione — ordine delle operazioni**: eseguire le migrazioni **prima** di un deploy che assume lo schema aggiornato, non dopo — un deploy che si aspetta una colonna/tabella non ancora migrata fallisce a runtime, non in fase di build.

---

Al termine, torna a `fase-3-deploy.md`, sottofase 3.1, e verifica lì la checklist di chiusura prima di passare a 3.2.
