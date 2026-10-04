---
stato: bozza
---

# Fase 7 — Global `impostazioni-sistema` (configurazione tecnica trasversale)

> Dettaglio operativo. Fase di dominio specifica del progetto (non ereditata dal catalogo). Riferimenti: `ADR-109-global-impostazioni-sistema.md` (con l'**Emendamento a §1 del 2026-10-04** sui mittenti email), `ADR-102-divisione-area-di-gestione.md` §6, `ADR-113-ruoli-permessi-admin-app.md`, `ADR-107-modello-dati-sistema-prenotazioni.md` §1 (emendato da ADR-109 §3); `riepilogo-sessione-bucket-c.md` §3, `riepilogo-sessione-impostazioni-sistema.md`. Regole: `core/01-proporzionalita.mdc`, `core/04-changelog-commit.mdc`, `payload-pattern/02-convenzioni-payload.mdc`, `stack/01-stile-codice.mdc`, `email/01a-resend.mdc`.

Aggiornare lo stato di ogni sottofase qui sotto e in `00-piano-generale.md` non appena completata.

**Prerequisito**: Fase 3 chiusa (v0.3.0) e Fase 4.0 completata (`localization` attiva, migrazione `_locales` già applicata). Nessuna nuova risorsa GCP. La fase **non dipende dalla shell `(app)`** (Fase 8): crea i campi e i permessi. Il manager li modificherà nella sezione Orari dell'App (Fase 8.5, `ADR-113`); admin e super-admin possono già modificarli nell'Admin nativo.

---

## Perimetro e decisioni già prese (da non riaprire)

- Un solo Global, slug **`impostazioni-sistema`**, a 4 tab (Orari e chiusure, Calendario, Comunicazioni, Integrazioni future): ADR-109 §1.
- **Orari e chiusure sono la fonte unica** per menù e prenotazioni. I Global «Impostazioni prenotazioni» (5.1) e «Generali» del menù (6.1) **nascono senza quei campi** (ADR-109 §§2–3; `arco-21`, `arco-22`, direzione invertita il 2026-10-03). Questa fase **non crea** quei due Global.
- **Mittenti email** (Emendamento a §1, accettato): mittente di sistema nelle env `RESEND_FROM_ADDRESS`/`RESEND_FROM_NAME`, **invariate**; mittenti verso i clienti nell'array del Global, **un record per sito** (`vietnamonamour`, `villadoree`); **nessun fallback** tra le due sorgenti.
- **Permessi** (ADR-109 §5 come emendato dal terzo emendamento, e `ADR-113`): nell'Admin il manager non accede a questo Global; admin e super-admin hanno tutto; l'utente con `appRole: manager` legge e modifica solo la tab Orari e chiusure, dall'App. Meccanismo: funzione `access` nativa **a livello di singolo campo**, non di tab.
- Nessun segreto in campi Payload: il Global ospita solo riferimenti non sensibili. **Nessun campo `localized`**: è configurazione tecnica, non contenuto dei siti.

## Ordine di dipendenza reale

**7.1 → 7.2 → 7.3 → 7.4.** 7.2 e 7.3 sono indipendenti nei contenuti ma modificano lo stesso file di Global: si eseguono in sequenza, una chat Composer per sottofase. 7.4 viene per ultima perché i permessi agiscono sui campi già esistenti. La fase si esegue prima di Fase 8 e Fase 6 (`00-piano-generale.md`, «Ordine di esecuzione corrente»).

## Principi trasversali per questa fase

1. **Nomi fissati prima di scrivere codice.** Slug e `name` dei campi sono decisi all'inizio di 7.1 e **congelati alla chiusura di 7.3**, quando tutti i campi esistono: dopo, ogni ridenominazione è una modifica di schema con migrazione e rompe i consumatori (Fasi 5 e 6, via Local API). Nessun alias, nessun fallback tra nomi diversi.
2. **Convenzione lingua**: nomi di campi, funzioni e file in **inglese**; etichette dell'interfaccia in **italiano** (`stack/01-stile-codice.mdc`). Lo scostamento da ADR-109 è chiuso dal secondo Emendamento a §1 (2026-10-04).
3. **Nessun deploy prima della migrazione.** `main` fa deploy automatico su Cloud Run: per ogni sottofase che cambia lo schema, la migrazione va **applicata su Cloud SQL prod prima del push** (`pnpm payload migrate` via Auth Proxy, `docs/operativo/cloud-sql-produzione.md`).
4. **Commit solo dopo verifica runtime** (non solo TypeScript), push manuale. Voce di CHANGELOG per ogni commit.

---

## 7.1 — Scheletro del Global e nomi

**Stato**: 🔲 da fare

**Dipende da**: 4.0 completata.

**Obiettivo**: registrare il Global `impostazioni-sistema` con le 4 tab e il default di accesso più restrittivo (solo admin e super-admin), senza ancora i campi di 7.2 e 7.3.

**Riferimenti**: `ADR-109` §§1, 5; `globals/Settings.ts` (modello di Global con `access` per ruolo; la sua etichetta Admin «Identità autorizzate» deve restare distinta da quella di questo Global).

**Decisioni prese il 2026-10-04** (ADR-109 non le fissa, o le fissa in modo diverso da convenzione e codice; registrate nel secondo Emendamento a §1 di ADR-109):

1. **Nomi dei campi** in inglese camelCase, etichette in italiano. ADR-109 (e ADR-107) usano nomi italiani con trattino (`orario-inizio`, `mittenti-resend`); la convenzione di progetto e il codice esistente (`adminRole`, `allowedDomains`) usano l'inglese camelCase. Tabella confermata:

   | ADR-109 | `name` nel codice | Tipo |
   |---|---|---|
   | `servizi` | `services` | array, esattamente 2 righe |
   | ↳ `nome` | `name` | select, valori `lunch` / `dinner` (etichette Pranzo / Cena) |
   | ↳ `orario-inizio` / `orario-fine` | `startTime` / `endTime` | text `HH:mm` (ora locale, senza fuso) |
   | `giorni-riposo-settimanale` | `weeklyClosedDays` | select `hasMany`, `monday`…`sunday` |
   | `chiusure-annuali` | `annualClosures` | array |
   | ↳ `data` / `etichetta` | `date` / `label` | date solo giorno / text |
   | gruppo B&B (solo vietnamonamour.com) | `bnb` | group |
   | ↳ check-in / check-out | `checkInTime` / `checkOutTime` | text `HH:mm` |
   | ↳ indicazione colazione | `breakfastNote` | text libero, non localizzato (release 1) |
   | `google-calendar-id` | `googleCalendarId` | text |
   | `mittenti-resend` | `resendSenders` | array |
   | ↳ `sito` / nome / indirizzo | `site` / `name` / `address` | select / text / email |
   | `contatti-notifiche-staff` | `staffNotificationContacts` | array |
   | ↳ `nome` / `email` | `name` / `email` | text / email |

   I valori `lunch`/`dinner` devono coincidere con quelli di `servizio` in ADR-107 (Eccezioni giorno e Prenotazioni, oggi `pranzo`/`cena`): la scelta vale anche per Fase 5 e 6, che usano gli stessi nomi italiani. ADR-109 non viene riscritto; questo file diventa il riferimento per i nomi.
2. **Tab non nominati** (solo `label`), come nei Global dei siti (Fase 4): la disposizione si può cambiare senza toccare il percorso dei dati. ADR-109 riporta tra parentesi degli identificativi (`orari-chiusure`, …) che qui sono letti come descrittivi, non come `name` dei tab.
3. **Una migrazione per sottofase** (7.1–7.3), come in Fase 4.
4. **Nessun `activityLog`** su questo Global: nessun requisito documentato (`payload-pattern/03-log-azioni.mdc`: collegarlo solo quando un requisito reale lo richiede).

**Verifica tecnica**: la tab «Integrazioni future» non ha campi (ADR-109 §1). Verificare che Payload 3.89 accetti una tab senza campi; in caso contrario, segnalarlo prima di scegliere una soluzione.

**Checklist di chiusura sottofase**:
- [ ] Global registrato con slug `impostazioni-sistema` e le 4 tab; nomi confermati dall'umano.
- [ ] Prova per ruolo: admin e super-admin lo vedono; un utente con solo `appRole` non entra nell'Admin.
- [ ] Migrazione generata, committata e applicata su Cloud SQL prod **prima** del push.
- [ ] Voce di CHANGELOG.

---

## 7.2 — Orari e chiusure (fonte unica)

**Stato**: 🔲 da fare

**Dipende da**: 7.1.

**Obiettivo**: tab «Orari e chiusure» con `services`, `weeklyClosedDays`, `annualClosures` e il gruppo `bnb` (ADR-109 §1 e terzo emendamento), più il pulsante che precompila `annualClosures` con le festività italiane (ADR-107 §1, spostato da ADR-109 §3).

**Riferimenti**: `ADR-109` §§1–3.

**Validazione**: `services` ha esattamente due righe, una per `lunch` e una per `dinner` (lettura di «2 voci fisse» in ADR-109); `startTime`, `endTime`, `checkInTime` e `checkOutTime` accettano solo `HH:mm` a 24 ore (`^([01]\d|2[0-3]):[0-5]\d$`) e un valore diverso viene rifiutato.

**Orari come testo** (secondo Emendamento a §1 di ADR-109): `startTime`, `endTime`, `checkInTime` e `checkOutTime` sono l'ora locale del ristorante, senza data né fuso. Non si usa un campo `date`: in Payload 3.89.0 è una colonna `timestamp with time zone` e, per il solo orario, il selettore non normalizza data né fuso.

**Pulsante festività** (funzione di supporto già prevista, componente custom dell'Admin, classe A): chiede l'anno e aggiunge a `annualClosures` le 12 festività nazionali di quell'anno (1 gennaio, 6 gennaio, Pasqua, Lunedì dell'Angelo, 25 aprile, 1 maggio, 2 giugno, 15 agosto, 1 novembre, 8 dicembre, 25 dicembre, 26 dicembre), con etichette in italiano. Pasqua si calcola con una funzione senza nuove dipendenze (algoritmo gregoriano). Le date già presenti non vengono duplicate. Le righe restano modificabili e cancellabili a mano.

**Checklist di chiusura sottofase**:
- [ ] Campi (compreso il gruppo `bnb`), validazione sul numero di servizi e sul formato `HH:mm`.
- [ ] Pulsante festività funzionante, risultato modificabile a mano.
- [ ] Migrazione applicata su Cloud SQL prod prima del push.
- [ ] Riportato nei file di fase 5 e 6 (da scrivere) che «Impostazioni prenotazioni» e «Generali» nascono senza questi campi.

---

## 7.3 — Riferimenti tecnici (Calendario, Comunicazioni, Integrazioni future)

**Stato**: 🔲 da fare

**Dipende da**: 7.2.

**Obiettivo**: le altre tre tab di ADR-109 §1, così come ridefinite dall'Emendamento a §1.

**Campi**:
- **Calendario**: `googleCalendarId`, riferimento non sensibile. Resta **vuoto**: lo valorizza e lo consuma la 5.4 (`arco-24`).
- **Comunicazioni**: `resendSenders` (un record per `site`; `name`; `address`) e `staffNotificationContacts` (`name`, `email`).
- **Integrazioni future**: nessun campo.

**Validazioni** (`payload-pattern/02-convenzioni-payload.mdc`, hook di normalizzazione): `address` e `email` normalizzati (trim, minuscolo, formato); al più un record di `resendSenders` per `site`.

**Vincoli dall'Emendamento a §1**: l'env `RESEND_FROM_*` e `lib/email/env.ts` **non si toccano** in questa fase; non è previsto un test di invio al salvataggio; il prerequisito «dominio Verified in Resend prima di inserire un record» è operativo e non verificato dal sistema.

**Checklist di chiusura sottofase**:
- [ ] Campi, normalizzazione e unicità per `site`; nessun consumatore collegato.
- [ ] **Nomi congelati**: elenco degli slug e dei `name` riportato nel CHANGELOG.
- [ ] Migrazione applicata su Cloud SQL prod prima del push.

---

## 7.4 — Permessi granulari campo-per-campo

**Stato**: 🔲 da fare

**Dipende da**: 7.3 (campi esistenti). Non dipende dal nuovo valore `manager` di `adminRole` (Fase 8.3): usa i valori già esistenti.

**Obiettivo**: applicare i permessi di `ADR-113` con la funzione `access` nativa a livello di campo, senza funzionalità custom (`arco-23`).

| Chi | Permessi su `impostazioni-sistema` |
|---|---|
| `admin`, `super-admin` | Lettura e modifica di tutte le tab |
| `appRole: manager` | Lettura e modifica della sola tab Orari e chiusure (chiusure e gruppo `bnb` compresi), dall'App |
| Altri | Nessun accesso |

**Accesso a livello di Global**: deve ammettere sia gli admin sia `appRole: manager`, altrimenti il manager non potrebbe leggere nessun campo; la restrizione alle sole tab consentite sta sui singoli campi.

**Nascondere il Global dall'Admin** a `adminRole: manager` (`admin.hidden` con funzione): si implementa e si verifica in **Fase 8.3**, insieme al nuovo valore del ruolo.

**Verifiche tecniche** (non ancora fatte): prova per ruolo via Local API e REST (admin, super-admin, utente con `appRole: manager`, utente senza ruoli) su lettura e scrittura di ogni campo; rifiuto o scarto di un `update` su un campo non consentito.

**Checklist di chiusura sottofase**:
- [ ] Prova per ruolo su ogni campo.
- [ ] Nessuna modifica di schema (solo `access`), quindi nessuna migrazione.
- [ ] Voce di CHANGELOG.

---

## Variabili d'ambiente introdotte dalla Fase 7

**Nessuna.** `RESEND_FROM_ADDRESS` e `RESEND_FROM_NAME` restano come sono (nomi invariati, un nome per variabile, senza alias).

## Incoerenze note e punti aperti

- **Accesso del manager all'Admin (risolto).** Definito da `ADR-113` (proposta): `adminRole` ottiene il valore `manager`, solo per il CMS dei siti; gli orari si modificano nell'App (Fase 8.5).
- **`servizi[].nome` in due Global.** ADR-109 §3 lascia `servizi[].nome` e `durata-slot` in «Impostazioni prenotazioni», mentre gli orari dei servizi stanno qui: il legame è solo il nome, con rischio di disallineamento. Da gestire in 5.1.
- **Assenza di migrazione dati** (ADR-109 §2): assunta in base allo stato `da_fare` di 5.1 e 6.1, non verificata contro dati già presenti in Bookly o nel backend attuale del menù.
