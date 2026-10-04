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
- Ogni sottofase ha uno stato: 🔲 da fare — 🔶 in corso — ✅ fatto — ⏸ rimandata (dipendenza esterna non ancora risolta; condizione di sblocco scritta nel file di fase). Aggiornare questo indice (e il file di dettaglio) subito dopo il completamento, non a posteriori.
- **Riferimento di contesto per le decisioni di prodotto/dominio**: le specifiche di questo progetto in `docs/` (es. `specifica-login-payloadcms.md` e le altre specifiche di dominio — da creare per questo progetto, non sono un template). Per l'auth e il pattern architetturale standard, il riferimento di default è già `.cursor/rules/` + i file di fase: **serve una specifica dedicata solo se il progetto devia** da quello standard (policy password diversa, ruolo con permessi non banali, requisito di compliance non coperto — vedi nota in `fase-2-login.md`), non come documento sempre presente per ripetere l'ovvio. I file di piano traducono le eventuali specifiche di deviazione in passi operativi; non le sostituiscono. **Regola di precedenza**: in caso di conflitto tra una specifica e il file di fase corrispondente, vince il file di fase più recente — annotare esplicitamente qui quando questo accade per una fase specifica, con la data della sessione in cui è stata presa la decisione.

## Stato generale

| Fase | Descrizione | Stato | File di dettaglio |
|---|---|---|---|
| Fase 1 | Setup progetto: Next.js, PayloadCMS, Tailwind, database locale, dipendenze base | ✅ fatto (1.1–1.7) | `fase-1-setup.md` (+ file di variante database) |
| Fase 2 | Login: provider SSO, login locale, ruoli/permessi, sessione, activity log | ✅ fatto (2.1–2.10; spike cookie prod → Fase 3 § 3.3) | `fase-2-login.md` (+ file di variante auth ed email) |
| Fase 3 | Deploy: build container, ambiente cloud, database di produzione, auth in produzione, bootstrap | ✅ fatto (3.1–3.5) | `fase-3-deploy.md` (+ file di variante database, cloud, auth) |
| Fase 4 | CMS siti esterni: localizzazione, pagine e Global dei due siti, plugin SEO/Redirects, lato CMS di preview e revalidation | 🔶 in corso (4.0 ✅; 4.1–4.4 parte CMS eseguibili; 4.5, 4.6 e parti lato siti rimandate) | `fase-4-cms-siti-esterni.md` |
| Fase 5 | Sistema prenotazioni (vietnamonamour.com) | 🔲 da fare | `fase-5-sistema-prenotazioni.md` (da scrivere) |
| Fase 6 | Menù digitale: collection, API, backoffice (il frontend pubblico 6.7 è fuori perimetro, in un altro progetto) | 🔲 da fare | `fase-6-menu-digitale.md` |
| Fase 7 | Global `impostazioni-sistema` (orari e chiusure come fonte unica, riferimenti tecnici) | 🔲 da fare | `fase-7-impostazioni-sistema.md` |
| Fase 8 | Shell dell'Area App `(app)` + shadcn/ui, condivisa dalle tre sezioni del backoffice: menù, orari e prenotazioni | 🔲 da fare | `fase-8-shell-app.md` |

## Ordine di esecuzione corrente

Il numero di fase non indica l'ordine di esecuzione. Priorità decisa il 2026-10-03: portare a compimento prima il menù digitale (parte CMS, API e backoffice; il frontend pubblico è un'app Firebase in un altro progetto).

1. **Fase 4.0** — localizzazione e lingua d'interfaccia ✅ (2026-10-03)
2. **Fase 7** — `impostazioni-sistema` (gli orari sono fonte unica per menù e prenotazioni: vanno prima di 6.1 e 5.1)
3. **Fase 8** — shell `(app)` + shadcn/ui
4. **Fase 6** — menù digitale (6.7 fuori perimetro; solo 6.5 parte B dipende dal frontend esterno)
5. Poi Fase 4.1–4.4 (parte CMS) e Fase 5

Decisioni ancora aperte, ciascuna con scadenza e punto di registrazione: `piano.yaml`, sezione `punti_aperti`.

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

1. Database di produzione (variante — vedi file di variante database, § 3.1) — ✅ fatto (2026-09-29)
2. Build container (generico) + secret e deploy sull'ambiente cloud (variante, vedi file di variante cloud, § 3.2) — ✅ fatto (2026-10-03)
3. Auth in produzione e spike cookie HTTPS (variante, vedi file di variante auth, § 3.3) — ✅ fatto (2026-10-03)
4. Bootstrap super-admin e dati iniziali — ✅ fatto (2026-10-03)
5. Verifica finale di chiusura fase — ✅ fatto (2026-10-03)

## Fase 4 — CMS siti esterni, panoramica sottofasi

Dettaglio completo in `fase-4-cms-siti-esterni.md`. Questo progetto contiene solo i contenuti dei due siti (Payload su Cloud Run); i due siti sono applicazioni separate, in un altro progetto, non ancora sviluppate, ciascuna su un proprio progetto Firebase Hosting distinto. Le parti che richiedono i frontend o il design sono rimandate.

0. Localizzazione nativa Payload (recupero della deviazione da Fase 1, ADR-103) — ✅ fatto (2026-10-03)
1. Scaffolding Collection pagine e Global sito — 🔲 da fare
2. Plugin di supporto (SEO, Redirects) — 🔲 da fare
3. Meccanismo di preview — Parte A lato CMS e contratto ADR-111: 🔲 da fare; Parte B lato siti: ⏸ rimandata
4. Revalidation e comunicazione coi siti — Parte A lato CMS: 🔲 da fare; Parte B ISR e verifica end-to-end: ⏸ rimandata
5. Definizione dei Block del layout builder — ⏸ rimandata
6. Content population e compilazione Redirects — ⏸ rimandata

## Fase 5 in poi — dominio specifico del progetto

> Nota di progetto (2026-10-03): la Fase 4 è definita (sezione sopra). Resta da scrivere il file di Fase 5 (prenotazioni), già presente come nodo in `piano.yaml`; i file di Fase 6, 7 e 8 sono scritti e validati (2026-10-04).

## Prossimi passi

- **Prossimo passo**: passare a Composer, con la Fase 7.1 come prima sottofase (file di Fase 6, 7 e 8 validati il 2026-10-04). Punti aperti: nessuno (`po-04`, `po-05`, `po-06`, `po-07` e `po-09` chiusi il 2026-10-04). Il file di Fase 5 si scrive più avanti, secondo l'ordine di esecuzione. Fase 3 chiusa ✅ (2026-10-03, § 3.5). Lacuna prod documentata: login locale App ed email di attivazione non rieseguiti in produzione, ora tracciata in `fase-8.6` (bloccata).
- **Correzione di catalogo (2026-09-20)**: riaperte 2.2 e 2.8 a seguito di un bug di processo — `disableLocalStrategy` (2.4) blocca il login nativo per l'intera collection `users`, non solo per l'Admin, rendendo 2.7 (e 2.6) non implementabili come originariamente scritte nel template. Dettaglio completo nelle note di debito in `fase-2-login.md`, sottofasi 2.2 e 2.8.
- Fase 2.4 / 2.5 chiuse: due istanze `payload-oauth2` (`google-admin`, `google-app`), callback con `jwtSign` Payload, `/admin/login` solo Google, `/app/login` con istanza App.
- Fase 2.3 chiusa: credenziali Google OAuth di sviluppo in `.env`, redirect URI locali registrati, nota operativa `docs/operativo/credenziali-google-oauth.md`.
- Fase 2.2 chiusa in codice, riaperta 2026-09-20: Global `settings` (Identità autorizzate) con allow-list domini e guardrail anti-lista-vuota (debito di 2.8, scelta b) — dominio reale `vietnamonamour.com` censito il 2026-09-20 (conferma umana, CHANGELOG).
- Fase 2.8: seed bootstrap + guardrail ultimo super-admin con credenziali `bootstrapCredential*` (ADR-004); migrazione legacy `pnpm migrate:bootstrap-credentials`. Identità Workspace per SSO Admin: chiusa (due identità separate, vedi `fase-2-login.md` 2.8).
- Fase 1 chiusa: ambiente locale confermato stabile (App e Admin si avviano); push di `f98a812` su `origin/main`.
- Aggiornare questo indice e il file di fase corrispondente a ogni sottofase completata.
