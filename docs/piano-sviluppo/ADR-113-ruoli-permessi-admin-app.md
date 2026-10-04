# ADR — Ruoli e permessi di Admin e App

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-10-04
**Arco di decisione**: punto aperto `po-02` (schema dei ruoli) → Fase 8.3 e Fase 8.5 (`arco-34`: ruoli, guardia di accesso e sezione Orari dell'App) e Fase 4.1 (`arco-33`: permessi del manager sul CMS dei siti). **Deroga a catalogo con citazione**: `ADR-001-schema-ruoli-baseline.md` (l'enum di `adminRole` si estende) e `ADR-004-permessi-crud-utenti.md` (la matrice si estende con la riga manager), entrambi di catalogo, in `cursor-payload-template`. Supera `riepilogo-sessione-bucket-d.md` §3 (manager come `adminRole: admin` più `appRole: manager`); definisce il «ruolo dedicato» di `ADR-102-divisione-area-di-gestione.md` §1; sposta nell'App la modifica degli orari che `ADR-102` §6 e `ADR-109-global-impostazioni-sistema.md` §5 collocavano nell'Admin.

## Contesto

- `ADR-102` §1 prevede che i manager entrino in `/admin` «con ruolo dedicato» per i soli contenuti dei due siti, ma quel ruolo non è mai stato definito. Il baseline di catalogo (`ADR-001`) fissa `adminRole` a `none`/`admin`/`super-admin`, e `canAccessAdminPanel` ammette solo admin e super-admin.
- `riepilogo-sessione-bucket-d.md` §3 modellava il manager come `adminRole: admin` più `appRole: manager`. Così un admin «puro» e un manager non si distinguono per ruolo.
- Il login locale dell'App emette lo stesso cookie di sessione dell'SSO (`lib/auth/localLogin/completeLocalLoginSession.ts`). Ciò che tiene fuori da `/admin` gli utenti solo App è `canAccessAdminPanel`, insieme al vincolo di `ADR-004` «`adminRole ≠ none` ⇒ accesso solo SSO» (`lib/auth/localPasswordGuard.ts` lo verifica come `adminRole !== 'none'`).
- L'App ha tre sezioni: menù, orari e prenotazioni. Nel codice `AppSection` ne prevede due (`menu`, `reservations`).
- La regola decisa il 2026-10-04: nell'Admin il manager gestisce solo i contenuti dei siti; per tutto il resto usa l'App.

## Decisione

**1. Schema dei ruoli.** `adminRole`: `none`, `manager`, `admin`, `super-admin`. `appRole`: `none`, `manager` (invariato). I due campi restano `select` singoli; un utente può averli entrambi valorizzati.

**2. Admin nativo.**

| Ruolo | Permessi |
|---|---|
| `super-admin` | Tutto in lettura e scrittura, con i guardrail di `ADR-004`: nessuno cancella sé stesso, l'ultimo super-admin è protetto |
| `admin` | Tutto, tranne creare, modificare e cancellare i super-admin e scrivere su «Identità autorizzate» (`settings`, che può leggere) |
| `manager` | Solo il CMS dei siti, vedi sotto. Non vede utenti, «Identità autorizzate», `impostazioni-sistema`, log delle azioni, menù e prenotazioni |

CMS dei siti per il manager:
- **Pagine** (`pages-vma`, `pages-villadoree`): creazione e modifica, compresa la pubblicazione. **Cancellazione riservata agli admin**: deroga esplicita al default «`delete` eredita da `update`» di `payload-pattern/02-convenzioni-payload.mdc`.
- **Impostazioni dei siti** (`impostazioni-vma`, `impostazioni-villadoree`): lettura e modifica.
- **Meta SEO** di ogni pagina: parte della pagina, modificabili dal manager (Fase 4.2).
- **Preview delle bozze** (`ADR-104`).
- **Redirects** e impostazioni globali del plugin SEO, se esistono: solo admin.
- **Media**: da definire con la decisione sullo storage (Fase 4.2, 4.5).

**3. App.** Sezioni: `menu`, `hours`, `reservations`.

| Ruolo | Sezioni |
|---|---|
| `super-admin`, `admin` | Tutte e tre. L'accesso è **derivato da `adminRole`**: non serve nessun `appRole` |
| `manager` (`appRole`) | Menù, orari, prenotazioni, con i limiti sotto |

- **Menù**: creazione, modifica e disabilitazione di piatti, vini, bevande, distillati, menù e del campo `porzione`. La cancellazione è sempre «soft» (disabilita). Le tassonomie sono in sola scelta; la loro gestione resta agli admin, nell'Admin (`riepilogo-sessione-criterio-manager-admin-menu.md` §2, confermato).
- **Prenotazioni**: lettura e scrittura su Prenotazioni, Eccezioni giorno e «Impostazioni prenotazioni» (capienza, durata slot, soglia gruppo numeroso). Le azioni dipendono dallo stato come da `ADR-106`.
- **Orari**: orari e chiusure del ristorante e orari del B&B di vietnamonamour.com, in `impostazioni-sistema` (tab Orari e chiusure, `ADR-109`, terzo emendamento). Si modificano **solo nell'App**.

**4. Regole comuni.**
- Nell'Admin il manager parte da «nessun accesso»: ogni collection e Global deve concedere esplicitamente ciò che gli spetta. `isStaffAdminRequest` resta riservata ad admin e super-admin, quindi il manager non legge gli utenti.
- Meccanismo: funzione `access` nativa di Payload, a livello di collection, Global e campo. Le voci non pertinenti si nascondono dalla sidebar con `admin.hidden`, che in Payload 3.89.0 accetta una funzione con l'utente.
- Un utente con `adminRole: manager` entra nell'Admin **solo con Google SSO**, con un dominio abilitato in «Identità autorizzate»: il vincolo `adminRole !== 'none'` si applica senza modificare il guard. Un utente con solo `appRole: manager` può usare il login locale.

## Alternative considerate

- **Ammettere nell'Admin chi ha `appRole: manager` senza toccare lo schema** — scartata: le sessioni con password locale entrerebbero in `/admin`, contro l'invariante di catalogo.
- **Mantenere il modello di `riepilogo-sessione-bucket-d.md` §3** (`adminRole: admin` più `appRole: manager`) — scartata: non distingue un admin puro da un manager.
- **Manager fuori dall'Admin, con i contenuti dei siti gestiti dall'App** — scartata: contrasta `ADR-102` §1 e la preview nell'Admin (`ADR-104`).
- **Estendere `appRole` con admin e super-admin** — scartata: duplicherebbe l'informazione già in `adminRole`.
- **Orari al manager nell'Admin** (`ADR-109` §5 originale) — superata: l'Admin resta per i soli contenuti dei siti.

## Conseguenze

- **Deroga a catalogo**: `adminRole` non è più `none`/`admin`/`super-admin` (`ADR-001`). La matrice di `ADR-004` vale per gli attori admin e super-admin e si estende con la riga manager (nessun permesso su `users`). Richiede la migrazione dell'enum Postgres (classe B).
- **Fase 8.3** (ruoli e guardia di accesso): aggiunge il valore `manager`, aggiorna `canAccessAdminPanel` e la matrice in `fase-2-login.md`, porta `canAccessSection` a tre sezioni derivate da `adminRole` e `appRole`, e applica `admin.hidden` per il manager. Prove per ruolo.
- **Fase 8.2 e 8.5**: la navigazione ha tre sezioni; la 8.5 costruisce la sezione Orari, che legge e scrive `impostazioni-sistema` con la sessione dell'utente.
- **Fase 7.4**: `access` per campo su `impostazioni-sistema`: admin e super-admin tutto; `appRole: manager` solo la tab Orari e chiusure. L'Admin non la mostra al manager (verifica in 8.3).
- **Fase 4.1** dipende da 8.3 (`arco-33`): i permessi del manager usano `adminRole: manager`. `fase-4-cms-siti-esterni.md` §§ 4.1 e 4.2 sono aggiornate (cancellazione delle pagine e Redirects riservati agli admin).
- **ADR-111**: la fonte degli orari pubblici dei siti (ristorante, check-in, check-out) è `impostazioni-sistema`; la forma di esposizione, oggi non pubblica per default, si decide nel contratto.
- **`po-02` chiuso**: il manager è unico per menù, orari e prenotazioni.
- **Prerequisito operativo, non verificato**: chi usa l'Admin come manager ha un account Google su un dominio abilitato per l'Admin.
- **Non verificato**: il comportamento di `admin.hidden` per ruolo a runtime. Di `ADR-004` di catalogo ho letto solo la matrice riportata da `fase-2-login.md`.

## Nota di chiarimento (2026-10-04)

Non modifica la decisione. La lettura anonima della sola tab Orari e chiusure di `impostazioni-sistema` è già decisa in `ADR-112` §1 e in `fase-7-impostazioni-sistema.md` §7.4; ADR-111 stabilisce soltanto se i siti usano quella stessa REST per gli orari pubblici (ristorante, check-in, check-out).
