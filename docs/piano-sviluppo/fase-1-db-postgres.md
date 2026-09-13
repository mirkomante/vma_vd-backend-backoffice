---
stato: validato
---

# Fase 1.3 — Variante database: PostgreSQL

> Istruzioni operative per la sottofase **1.3** di `fase-1-setup.md`. Da allegare insieme a `fase-1-setup.md` nella chat dedicata a quella sottofase. Vedi anche `stack/01a-db-postgres.mdc` nel catalogo regole per le convenzioni architetturali che questa variante rispetta (nome variabile d'ambiente, adapter, migrazioni).

**Questo è un passaggio esterno a Cursor**, anche se locale: richiede che PostgreSQL sia installato e in esecuzione sul tuo computer prima che l'agente possa configurare la connessione.

**Checklist per l'umano (da seguire prima di procedere con il codice)**:
- [ ] Verificare che **PostgreSQL** sia installato e in esecuzione in locale (metodo di installazione a scelta — non prescritto da questo catalogo).
- [ ] Creare il database e l'utente applicativo in locale, se non già presenti (nessun requisito di permessi oltre lettura/scrittura sul database del progetto).

**Checklist per l'agente (dopo conferma umana che PostgreSQL locale è attivo)**:
- [ ] Inserire la connection string locale come variabile d'ambiente (`.env`, non committata), usando il nome **`DATABASE_URL`** (convenzione Payload, coerente con l'asse database):
  ```
  DATABASE_URL=postgresql://<utente>:<password>@127.0.0.1:5432/<nome-progetto>
  ```
- [ ] Configurare l'adapter PostgreSQL di Payload (`postgresAdapter`) nel file di configurazione principale, puntando alla variabile d'ambiente `DATABASE_URL`.
- [ ] Verificare che la versione di Payload installata sia `>= 3.73.0` (requisito di sicurezza, vedi `stack/01a-db-postgres.mdc`).
- [ ] In sviluppo, `push: true` è ammesso per iterare rapidamente sullo schema; verificare che le migrazioni (`payload migrate`) vengano generate e committate prima che il progetto avanzi verso il deploy (Fase 3) — non lasciarle solo come stato implicito di `push: true`.
- [ ] Verificare la connessione avviando il progetto in locale e controllando che Payload si connetta senza errori.

**Nota percorso dev → produzione**: a differenza di MongoDB, PostgreSQL locale e PostgreSQL in produzione sono la stessa tecnologia — cambia solo la connection string e l'esecuzione delle migrazioni (obbligatorie in ogni ambiente diverso dallo sviluppo), non l'adapter né il modello dati. Dettaglio operativo completo in Fase 3.

---

Al termine di questa checklist, torna a `fase-1-setup.md`, sottofase 1.3, e verifica lì la "checklist di chiusura sottofase" prima di passare a 1.4.
