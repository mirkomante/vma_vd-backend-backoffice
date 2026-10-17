# ADR — Azioni di sistema nel registro attività

> Template minimo. Un ADR per ogni arco di decisione (`00-come-eseguire-il-piano.md`, Passo 0).

**Stato**: accettata
**Data**: 2026-10-04
**Arco di decisione**: audit di coerenza del 2026-10-04 (rilievo F7) → Fase 6.4 (reset ai confini di servizio e riscrittura di `disponibilita.json`), 6.5 (avvio del rebuild), Fase 4.4 Parte A (esito della revalidation) e Fase 5.3 (anonimizzazione GDPR). In `piano.yaml`: `arco-43` (6.4 → 4.4) e `arco-44` (6.4 → 5.3); la 6.5 dipende già dalla 6.4 (`arco-18`). **Precisa un'eccezione prevista dal catalogo**: `payload-pattern/03-log-azioni.mdc` lascia fuori gli endpoint custom che non passano da un'operazione di collection e dice che tracciarli è «una decisione da prendere e documentare a parte».

## Contesto

- La collection `activity-log` ha `user` obbligatorio (`required: true`, e `user_id NOT NULL` nella migrazione iniziale) e `eventType` con i soli valori `login`, `logout`, `accessDenied`, `create`, `update`, `delete`. Non ha un campo per l'esito o per l'id di un evento esterno. La scrittura è riservata al sistema (`create`, `update`, `delete` negati; lettura per admin e super-admin).
- Il piano chiede di registrare l'esito della revalidation dei siti (4.4A), il reset di «terminato» e gli errori di scrittura del file di disponibilità (6.4), l'avvio del rebuild con l'id della build (6.5) e l'anonimizzazione GDPR (5.3). Sono azioni **senza utente**: il job gira con un secret, non con una sessione.
- La regola `03-log-azioni.mdc` riserva a Cloud Logging i soli log tecnici (errori, richieste, debug).

## Decisione

1. **`activity-log.user` diventa facoltativo.** Per le azioni di sistema resta vuoto.
2. **Nuovo valore di `eventType`: `systemAction`.**
3. **Nuovo campo `detail`** (testo breve, facoltativo): azione ed esito sintetici, per esempio `availability-reset: ok`, `rebuild-started: <id build>`, `revalidation vma: timeout`. **Nessun dato personale**: per l'anonimizzazione GDPR solo conteggi e identificativi, mai nome o email.
4. **`collection` e `documentId`** restano; la loro `condition` nell'Admin include `systemAction` (per esempio la prenotazione anonimizzata).
5. **Scrittura**: una funzione `logSystemAction(...)` in `lib/activityLog`, lo stesso punto unico di scrittura della regola, con Local API e `overrideAccess: true` dal server. Gli `access` della collection non cambiano.
6. **Migrazione additiva e non distruttiva**: la colonna `user_id` perde il vincolo NOT NULL, si aggiunge il valore dell'enum e la colonna `detail`. Si esegue come **primo passo di 6.4** (il primo consumatore nell'ordine di esecuzione); 6.5, 4.4 Parte A e 5.3 la riusano senza altre migrazioni. Applicata su Cloud SQL prod **prima** del push.
7. **Cloud Logging resta** per i log tecnici (errori, tracce): non viene sostituito.

### Registro tecnico sync disponibilità (§7, 2026-10-13)

- Ogni esecuzione di `syncMenuAvailabilityFile` emette un log **INFO** strutturato con `msg: menu-availability-sync`, campi `origin` (es. `global:menu-general`, `collection:dishes`, `job:availability-scheduler`), `outcome` (`written` | `identical` | `no-bucket` | `write-failed`) e `globalMessagePresent` (boolean: messaggio IT o EN non vuoto nello stato usato per generare il file). **Nessun** testo del messaggio global né segreti.
- Implementazione: `lib/menu/availability/availabilitySyncTechnicalLog.ts`. Non va nel registro attività (`activity-log`): resta osservabilità per Cloud Logging (decisione §7 punto 7).
- Gli errori che impediscono la scrittura del file continuano a generare `availability-write-failed:` nel registro attività **e** `outcome: write-failed` nel log tecnico; il salvataggio CMS (REST Admin incluso) non deve fallire per errori di sync.

### Bug sync REST Global `menu-general` (2026-10-13, post-6.4)

- **Sintomo**: salvataggio Admin REST (`POST /api/globals/menu-general?locale=it`) aggiorna il DB ma non GCS fino al job; log tecnico `outcome: identical`, `globalMessagePresent: false`.
- **Causa osservata (non spiegata fino al livello Payload/DB)**: nell’hook `afterChange`, `findGlobal(..., { req, locale: 'it' })` dentro la stessa richiesta REST restituisce ancora il `globalMessage` **precedente**, mentre `doc` dell’hook contiene il valore **nuovo** (confronto solo in dev con `MENU_AVAILABILITY_DEBUG_HOOK_READ=1`, log `menu-availability-hook-read-compare`). **Aggiramento**: `stateOverlay` dal `doc` dell’hook (e patch analoghe sulle collection `dishes` / binari).
- **Letture potenzialmente stale con `req` nella stessa richiesta**: Global `menu-general` (`globalMessage` localizzato); collection menù con `disabled` / `soldOut` (`dishes`, `wines`, `drinks`, `spirits`, `fixed-menus`, `menu-services`) se si ricostruisse lo stato solo da `find`/`findGlobal` con `req` invece che dall’overlay.
- **Produzione**: vietate con `NODE_ENV=production` (elenco unico in `MENU_AVAILABILITY_FORBIDDEN_IN_PRODUCTION_ENV_KEYS`): `MENU_AVAILABILITY_IN_MEMORY`, `MENU_AVAILABILITY_WRITE_TRACE_FILE`, `MENU_AVAILABILITY_MIRROR_FILE`, `MENU_AVAILABILITY_DISABLE_STATE_OVERLAY`, `MENU_AVAILABILITY_DEBUG_HOOK_READ`, `MENU_AVAILABILITY_SYNC_DEBUG_FILE` — `devOnlyEnvGuard.ts` → `resolveAvailabilityStorage`.
- **Collection**: overlay applicato anche alle collection per precauzione; il difetto REST stale è **dimostrato sul Global**; nelle prove locali senza overlay la collection REST (`soldOut`/`disabled`) resta allineata al DB.

### Nota (2026-10-14) — Traccia delle cancellazioni dei contenuti del menù

Non modifica la decisione. Ogni cancellazione di `dishes`, `wines`, `spirits`, `drinks`, `menu-services`, `fixed-menus` e `special-days` lascia una riga nel registro attività, scritta da un hook `afterDelete` di collection (quindi anche per le cancellazioni dell'Admin): `eventType: delete` (valore già nell'enum, nessuna migrazione), `user`, `area`, `collection`, `documentId` e `detail` con il nome della voce e il numero di riferimenti che la usavano (per esempio i menù fissi che contenevano un servizio). **Nessun dato personale.** È il primo uso di `eventType: delete` per un'azione utente. Un errore di scrittura del registro non blocca la cancellazione, come per `logSystemAction`. Motivo: `ADR-113`, emendamento del 2026-10-14 (il manager cancella). L'avviso nell'Admin prima della cancellazione e la traccia per le tassonomie (allergeni) restano `po-13`.

## Alternative considerate

- **Solo Cloud Logging**: scartata. Gli staff admin non lo vedono dall'Admin, retention e accesso sono separati, e le checklist delle sottofasi già prevedono «voce nel registro attività».
- **Un utente tecnico «system» in `users`**: scartata. La creazione utenti rifiuta chi non ha ruoli, e un utente con un ruolo avrebbe permessi; un record finto inquinerebbe ruoli, elenchi e controlli di accesso.
- **Una collection separata per i log di sistema**: scartata. Due registri per lo stesso scopo; quello esistente ha già il filtro per `eventType`.

## Conseguenze

- **6.4** ha un primo passo nuovo (migrazione e `logSystemAction`); **6.5** registra l'avvio del rebuild; **4.4 Parte A** registra l'esito della revalidation come `systemAction`, con l'id dell'evento in `detail`; **5.3** registra l'anonimizzazione con il conteggio.
- `payload-types.ts` va rigenerato; nell'Admin queste voci mostrano `user` vuoto.
- Non verificato: la migrazione che Payload genererà per rendere `user` facoltativo (attesa: la sola rimozione del NOT NULL, non provata).
- Se il catalogo volesse la stessa possibilità, la segnalazione è un passo a parte: non è stata inviata.

## Precisazioni (2026-10-04) — accettate dall'umano il 2026-10-04

1. `users.beforeDelete` e `purgeActivityLogForUserBeforeDelete` restano invariati: la cancellazione di un utente elimina le sue voci; le voci di sistema (`user` vuoto) non sono toccate.
2. `detail` comincia con una chiave di azione da un elenco chiuso (`availability-reset`, `availability-realigned`, `availability-write-failed`, `rebuild-started`, `revalidation`, `anonymization`), seguita da esito e dettagli. `availability-write-failed` registra solo gli errori di scrittura del file: le riscritture riuscite non si registrano (ce n'è una per ogni cambio di stato del manager). `availability-realigned` solo quando il job Scheduler riscrive perché il file su GCS differiva dal CMS (ignorando `updatedAt`).

## Implementazione (2026-10-13, sottofase 6.4)

- Migrazione applicata: `migrations/20261013_110424_activity_log_6_4.ts` (primo consumatore; su Cloud SQL prod **prima** del push che contiene il codice 6.4).
- `logSystemAction` in `lib/activityLog/logSystemAction.ts`.
- Reset Scheduler: `detail` tipo `availability-reset: ok; boundary=<ISO>` o `availability-reset: baseline; boundary=<ISO>` (primo tick senza stato precedente: solo baseline, nessun azzeramento `soldOut`).

## Nota di chiarimento (2026-10-17, cancellazioni senza utente e area della riga)

Non cambia la decisione né lo schema. Precisa due punti della nota del 2026-10-14. (1) La riga `delete` si scrive **solo se la cancellazione ha un utente** (`req.user`): le cancellazioni senza utente, come la pulizia di uno script con `overrideAccess: true`, non lasciano riga (evita voci spurie dagli script di prova e di svuotamento). (2) `area` si risolve in quest'ordine: la chiave `activityArea` del `context` della Local API (`'app'` o `'admin'`, costante `ACTIVITY_AREA_CONTEXT_KEY` in `lib/menu/menuContentDeleteLog.ts`); altrimenti `admin` se la richiesta arriva dall'API REST o GraphQL (il pannello Admin); altrimenti dai ruoli dell'utente. Le azioni del server dell'App passano sempre `context: { activityArea: 'app' }`, così un admin che cancella dall'App risulta `app`. Il campo `detail` ha il formato `nome={testo}; riferimenti={n}`; per i giorni speciali `nome=AAAA-MM-GG ambito={day|lunch|dinner}; riferimenti=0`.

