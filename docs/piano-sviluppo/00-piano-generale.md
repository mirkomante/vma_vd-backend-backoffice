# Piano generale di sviluppo — VMA_VD-backend-backoffice

> File indice. Contiene la panoramica delle fasi e lo stato di avanzamento. Il dettaglio operativo di ogni fase vive nel proprio file, linkato sotto. Questo file va aggiornato ad ogni sottofase completata: è la fonte di verità sullo stato reale del progetto, non quello che si presume fatto.

## Varianti adottate in questo progetto


- **Provider auth**: `Google OAuth`
- **Provider email**: `Resend`
- **Database**: `PostgreSQL`
- **Ambiente cloud**: `Google Cloud Run`
- **Package manager**: pnpm (fisso, non variante)
- **UI kit di base**: shadcn/ui (fisso, non variante)

## Come si usa questo piano

- Composer **non legge questi file automaticamente**: vanno indicati esplicitamente all'inizio di ogni sessione di lavoro (es. "leggi `fase-1-setup.md`, sottofase 1.3, e procedi").
- **Procedimento dettagliato su come condurre le sessioni** (struttura delle chat, prerequisiti, documenti da allegare, quando fare test in ambiente dev): vedi `00-come-eseguire-il-piano.md`.
- Le regole di comportamento dell'agente (`.cursor/rules/*.mdc`) si applicano sempre, indipendentemente da quale fase/file di piano è in lavorazione: in particolare, fermarsi su installazioni problematiche e su passaggi esterni a Cursor (vedi `core/02-processo-lavoro-agente.mdc`), distinguere validazione di codice da test in ambiente dev (vedi `core/03-validazione-testing.mdc`), e mantenere aggiornato il changelog prima di ogni commit (vedi `core/04-changelog-commit.mdc`).
- **Cronologia delle modifiche**: `docs/piano-sviluppo/CHANGELOG.md`, formato Keep a Changelog — distinto dai file di fase (che indicano cosa fare e lo stato attuale), il changelog è uno storico append-only di cosa è stato effettivamente fatto, sessione per sessione, inclusi esiti dei test.
- Ogni sottofase ha uno stato: 🔲 da fare — 🔶 in corso — ✅ fatto. Aggiornare questo indice (e il file di dettaglio) subito dopo il completamento, non a posteriori.
- **Riferimento di contesto per le decisioni di prodotto/dominio**: le specifiche di questo progetto in `docs/` (es. `specifica-login-payloadcms.md` e le altre specifiche di dominio — da creare per questo progetto, non sono un template). Per l'auth e il pattern architetturale standard, il riferimento di default è già `.cursor/rules/` + i file di fase: **serve una specifica dedicata solo se il progetto devia** da quello standard (policy password diversa, ruolo con permessi non banali, requisito di compliance non coperto — vedi nota in `fase-2-login.md`), non come documento sempre presente per ripetere l'ovvio. I file di piano traducono le eventuali specifiche di deviazione in passi operativi; non le sostituiscono. **Regola di precedenza**: in caso di conflitto tra una specifica e il file di fase corrispondente, vince il file di fase più recente — annotare esplicitamente qui quando questo accade per una fase specifica, con la data della sessione in cui è stata presa la decisione.

## Stato generale

| Fase | Descrizione | Stato | File di dettaglio |
|---|---|---|---|
| Fase 1 | Setup progetto: Next.js, PayloadCMS, Tailwind, database locale, dipendenze base | 🔶 in corso (1.1 ✅, 1.2 ✅) | `fase-1-setup.md` (+ file di variante database) |
| Fase 2 | Login: provider SSO, login locale, ruoli/permessi, sessione, activity log | 🔲 da fare | `fase-2-login.md` (+ file di variante auth ed email) |
| Fase 3 | Deploy: build container, ambiente cloud, database di produzione, auth in produzione, bootstrap | 🔲 da fare | `fase-3-deploy.md` (+ file di variante database, cloud, auth) |
| Fase 4+ | Dominio specifico di questo progetto — da definire (vedi sotto) | 🔲 da fare | `fase-4-*.md`, ... |

## Fase 1 — Setup, panoramica sottofasi

Dettaglio completo in `fase-1-setup.md`. Elenco delle sottofasi previste (l'ordine è anche l'ordine di esecuzione consigliato):

1. Inizializzazione progetto Next.js
2. Installazione e configurazione PayloadCMS v3 dentro il progetto Next.js
3. Configurazione connessione al database locale (variante — vedi file di variante database, § 1.3)
4. Installazione e configurazione Tailwind CSS
5. Verifica struttura cartelle secondo l'architettura decisa (`(payload)` vs route group App)
6. Primo avvio locale e verifica che pannello Admin e struttura base siano raggiungibili
7. Verifica finale di chiusura fase (commit già fatti per sottofase, qui solo controllo — vedi policy commit in `00-come-eseguire-il-piano.md`)

## Fase 2 — Login, panoramica sottofasi

Dettaglio completo in `fase-2-login.md`. Nota: l'ordine pratico consigliato esegue la sottofase 2.8 (seed super-admin) subito dopo la 2.1, prima di completare l'integrazione del provider SSO — vedi nota in cima al file di dettaglio.

1. Collection `users` (schema, ruoli `adminRole`/`appRole`, campo `active`, `loginMethod`)
2. Global "Settings" — allow-list identità autorizzate
3. Setup credenziali provider SSO (passaggio esterno — variante, vedi file di variante auth)
4. Integrazione provider SSO — istanza Admin (variante)
5. Integrazione provider SSO — istanza App (variante)
6. Login locale (form App) — verifica password nativa (generico) + invio email attivazione/reset (variante, vedi file di variante email)
7. Route locale di emergenza per super-admin
8. Script di seed super-admin + guardrail
9. Collection `activityLog`
10. Spike di test end-to-end con credenziali reali

## Fase 3 — Deploy, panoramica sottofasi

Dettaglio completo in `fase-3-deploy.md`. Non esiste un ambiente di staging separato: un solo deploy, quello di produzione.

1. Database di produzione (variante — vedi file di variante database, § 3.1)
2. Build container (generico) + secret e deploy sull'ambiente cloud (variante, vedi file di variante cloud, § 3.2)
3. Auth in produzione e spike cookie HTTPS (variante, vedi file di variante auth, § 3.3)
4. Bootstrap super-admin e dati iniziali
5. Verifica finale di chiusura fase

## Fase 4 in poi — dominio specifico del progetto

Le fasi da 4 in avanti non fanno parte di questo template: sono la logica applicativa specifica di *questo* progetto (es. import dati da una fonte esterna, funzionalità di dominio, aree specifiche dell'Area App). Vanno scritte da zero, seguendo la stessa forma dei file di fase (intestazione con riferimenti, sottofasi con Stato/Obiettivo/Checklist, note di chiusura) usata in Fase 1-3, ma con contenuto proprio di questo progetto — non c'è contenuto da riusare qui.

Quando si definisce la Fase 4, aggiungere qui la sua riga nella tabella "Stato generale" sopra e una sezione "Fase 4 — [nome], panoramica sottofasi" analoga a quelle di Fase 1-3.

## Prossimi passi

- **Prossimo passo**: Fase 1, sottofase 1.3 — vedi `fase-1-setup.md` e `fase-1-db-postgres.md`.
- Aggiornare questo indice e il file di fase corrispondente a ogni sottofase completata.
