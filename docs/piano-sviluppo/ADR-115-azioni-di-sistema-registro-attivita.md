# ADR — Azioni di sistema nel registro attività

> Template minimo. Un ADR per ogni arco di decisione (`00-come-eseguire-il-piano.md`, Passo 0).

**Stato**: accettata
**Data**: 2026-10-04
**Arco di decisione**: audit di coerenza del 2026-10-04 (rilievo F7) → Fase 6.4 (reset ai confini di servizio e riscrittura di `disponibilita.json`), 6.5 (avvio del rebuild), Fase 4.4 Parte A (esito della revalidation) e Fase 5.3 (anonimizzazione GDPR). In `piano.yaml`: `arco-43` (6.4 → 4.4) e `arco-44` (6.4 → 5.3); la 6.5 dipende già dalla 6.4 (`arco-18`). **Precisa un'eccezione prevista dal catalogo**: `payload-pattern/03-log-azioni.mdc` lascia fuori gli endpoint custom che non passano da un'operazione di collection e dice che tracciarli è «una decisione da prendere e documentare a parte».

## Contesto

- La collection `activity-log` ha `user` obbligatorio (`required: true`, e `user_id NOT NULL` nella migrazione iniziale) e `eventType` con i soli valori `login`, `logout`, `accessDenied`, `create`, `update`, `delete`. Non ha un campo per l'esito o per l'id di un evento esterno. La scrittura è riservata al sistema (`create`, `update`, `delete` negati; lettura per admin e super-admin).
- Il piano chiede di registrare l'esito della revalidation dei siti (4.4A), il reset di «terminato» e la riscrittura del file di disponibilità da Cloud Scheduler (6.4), l'avvio del rebuild con l'id della build (6.5) e l'anonimizzazione GDPR (5.3). Sono azioni **senza utente**: il job gira con un secret, non con una sessione.
- La regola `03-log-azioni.mdc` riserva a Cloud Logging i soli log tecnici (errori, richieste, debug).

## Decisione

1. **`activity-log.user` diventa facoltativo.** Per le azioni di sistema resta vuoto.
2. **Nuovo valore di `eventType`: `systemAction`.**
3. **Nuovo campo `detail`** (testo breve, facoltativo): azione ed esito sintetici, per esempio `availability-reset: ok`, `rebuild-started: <id build>`, `revalidation vma: timeout`. **Nessun dato personale**: per l'anonimizzazione GDPR solo conteggi e identificativi, mai nome o email.
4. **`collection` e `documentId`** restano; la loro `condition` nell'Admin include `systemAction` (per esempio la prenotazione anonimizzata).
5. **Scrittura**: una funzione `logSystemAction(...)` in `lib/activityLog`, lo stesso punto unico di scrittura della regola, con Local API e `overrideAccess: true` dal server. Gli `access` della collection non cambiano.
6. **Migrazione additiva e non distruttiva**: la colonna `user_id` perde il vincolo NOT NULL, si aggiunge il valore dell'enum e la colonna `detail`. Si esegue come **primo passo di 6.4** (il primo consumatore nell'ordine di esecuzione); 6.5, 4.4 Parte A e 5.3 la riusano senza altre migrazioni. Applicata su Cloud SQL prod **prima** del push.
7. **Cloud Logging resta** per i log tecnici (errori, tracce): non viene sostituito.
8. **`users.beforeDelete` e `purgeActivityLogForUserBeforeDelete` restano invariati**: la cancellazione di un utente elimina le sue voci; le voci di sistema (`user` vuoto) non sono toccate.
9. **`detail` comincia con una chiave di azione da un elenco chiuso** (`availability-reset`, `availability-write`, `rebuild-started`, `revalidation`, `anonymization`), seguita da esito e dettagli: il filtro per azione resta possibile.

## Alternative considerate

- **Solo Cloud Logging**: scartata. Gli staff admin non lo vedono dall'Admin, retention e accesso sono separati, e le checklist delle sottofasi già prevedono «voce nel registro attività».
- **Un utente tecnico «system» in `users`**: scartata. La creazione utenti rifiuta chi non ha ruoli, e un utente con un ruolo avrebbe permessi; un record finto inquinerebbe ruoli, elenchi e controlli di accesso.
- **Una collection separata per i log di sistema**: scartata. Due registri per lo stesso scopo; quello esistente ha già il filtro per `eventType`.

## Conseguenze

- **6.4** ha un primo passo nuovo (migrazione e `logSystemAction`); **6.5** registra l'avvio del rebuild; **4.4 Parte A** registra l'esito della revalidation come `systemAction`, con l'id dell'evento in `detail`; **5.3** registra l'anonimizzazione con il conteggio.
- `payload-types.ts` va rigenerato; nell'Admin queste voci mostrano `user` vuoto.
- Non verificato: la migrazione che Payload genererà per rendere `user` facoltativo (attesa: la sola rimozione del NOT NULL, non provata).
- Se il catalogo volesse la stessa possibilità, la segnalazione è un passo a parte: non è stata inviata.
