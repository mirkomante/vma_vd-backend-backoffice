---
stato: validato
---

# Fase 4 — CMS siti esterni (vietnamonamour.com + villadoree.com)

> Dettaglio operativo. Fase di dominio specifica del progetto (non ereditata dal catalogo). Riferimenti: `ADR-101-modello-contenuti-siti-esterni.md`, `ADR-102-divisione-area-di-gestione.md`, `ADR-103-plugin-supporto-cms.md`, `ADR-104-meccanismo-preview-contenuti.md`, `ADR-105-strategia-rendering-comunicazione-siti-esterni.md`; `riepilogo-sessione-cms-siti-esterni.md`, `riepilogo-sessione-preview-e-aree-gestione.md`, `riepilogo-sessione-bucket-d.md`, `riepilogo-sessione-bucket-c.md` §4. Regole: tutte quelle in `.cursor/rules/`, in particolare `core/01-proporzionalita.mdc`, `core/02-processo-lavoro-agente.mdc`, `payload-pattern/02-convenzioni-payload.mdc`.

Aggiornare lo stato di ogni sottofase qui sotto e in `00-piano-generale.md` non appena completata.

**Prerequisito**: Fase 3 chiusa (v0.3.0, § 3.5). Nessun altro prerequisito infrastrutturale: questa fase non richiede nuove risorse GCP.

---

## Perimetro e architettura (decisioni già prese, da non riaprire)

- **Questo progetto** è esclusivamente Payload CMS (Next.js) su **Cloud Run**: Admin nativo `(payload)`, backoffice `(app)`, API. Contiene i contenuti dei due siti, non i siti.
- **I due siti** (vietnamonamour.com, villadoree.com) sono **applicazioni Next.js separate, in un altro progetto, non ancora sviluppate**. Ciascuno sarà deployato su **un proprio progetto Firebase Hosting distinto** (due siti, due Firebase). Nulla di Firebase appartiene a questo repository né a questa fase.
- Questa fase produce quindi: la **struttura dati e i permessi** (collection, global, plugin), e il **lato Payload** dei meccanismi di preview e revalidation, definito da un **contratto esplicito** (ADR-111) su cui i due siti costruiranno quando saranno sviluppati.
- Tutto ciò che richiede i frontend esistenti (route `/api/preview`, Draft Mode, ISR, verifica end-to-end, Block del layout, popolamento contenuti) è **rimandato**, con condizione di sblocco scritta (vedi 4.3 Parte B, 4.4 Parte B, 4.5, 4.6).

## Ordine di dipendenza reale

L'ordine di esecuzione **tra le fasi** è in `00-piano-generale.md`, «Ordine di esecuzione corrente»: la 4.0 è la prima sottofase eseguita; 4.1–4.4 (parte CMS) seguono dopo Fase 7, 8 e 6.

- **4.0** (localizzazione) → **4.1** (scaffolding) → **4.2** (plugin).
- **4.3 Parte A** e **4.4 Parte A** (lato CMS + contratto ADR-111) partono dopo 4.1; **4.3 Parte A precede 4.4 Parte A** (ADR-111 nasce in 4.3 e si completa in 4.4).
- **4.3 Parte B**, **4.4 Parte B**, **4.5**, **4.6**: ⏸ rimandate a quando i frontend (e il design) dei due siti saranno disponibili. Non bloccano le Fasi 5 e 6, salvo 5.6 (vedi `piano.yaml`, arco-13).
- La Fase 4 si considera **chiusa solo quando anche le parti rimandate sono completate**; fino ad allora è «parzialmente chiusa» e va annotato in `00-piano-generale.md`.

## Principi trasversali per questa fase

1. **Nomi fissati prima di scrivere codice.** Slug di collection e global, nomi (`name`) dei campi e variabili d'ambiente sono decisi all'inizio della sottofase e **congelati alla chiusura di 4.1**: dopo, ogni ridenominazione è una modifica di schema con migrazione e rompe i consumatori REST (i due siti). Nessun alias, nessun fallback tra nomi diversi (stesso principio della nota al catalogo sul registro delle variabili).
2. **Convenzione lingua**: nomi di campi, collection, funzioni e file in **inglese**; etichette dell'interfaccia in **italiano** (`core` / `stack/01-stile-codice.mdc`).
3. **Nessun deploy prima della migrazione.** `main` fa deploy automatico su Cloud Run via Cloud Build: per ogni sottofase che cambia lo schema, la migrazione va **applicata su Cloud SQL prod prima del push** su `main` (`pnpm payload migrate` via Auth Proxy, `docs/operativo/cloud-sql-produzione.md`). Un deploy con collection nuove e tabelle assenti rompe le viste admin di quelle collection.
4. **Commit solo dopo verifica runtime** (non solo TypeScript), push manuale.

### Regola sulle modifiche all'interfaccia dell'Admin

Le correzioni all'interfaccia dell'Admin nativo si dividono in due classi:

| Classe | Esempi | Quando |
|---|---|---|
| **A — senza effetto sullo schema** | `label`/`labels`, `admin.description`, `admin.position`, ordine dei campi allo stesso livello, `useAsTitle`, `defaultColumns`, raggruppamenti UI, `access` (chi può creare/modificare/eliminare, anche in blocco), componenti custom (`admin.components`) | In qualsiasi momento, in un commit dedicato con voce di CHANGELOG e prova per ruolo (admin e manager). Nessuna migrazione. |
| **B — con effetto sullo schema o sul contratto** | `name` di collection/global/campo, tipo del campo, `localized`, `versions.drafts`, `hasMany`, slug dei Block, spostamento di un campo dentro/fuori da un tab **nominato** o da un `group` | Solo come sottofase esplicita, con migrazione. Con dati presenti: anche piano di migrazione dei dati. Dopo il contratto ADR-111: modifica breaking per i due siti. |

Per questo i **tab dei Global sono non nominati** (solo `label`): la disposizione si può cambiare senza toccare il percorso dei dati (da confermare in 4.1 sulla documentazione di Payload 3.89). Il default `access.delete` resta ereditato da `access.update` (`payload-pattern/02-convenzioni-payload.mdc`), salvo deroga esplicita. Il backoffice `(app)` (Fasi 5.5 e 6.6) è codice shadcn: si modifica quando serve, ma legge le stesse collection, quindi vale la classe B anche per lui.

---

## 4.0 — Localizzazione (prerequisito, deviazione da Fase 1)

**Stato**: ✅ fatto (2026-10-03; migrazione applicata su Cloud SQL prod, conferma dell'umano del 2026-10-04)

**Dipende da**: Fase 3 chiusa. Precede 4.1.

**Obiettivo**: abilitare la localizzazione nativa di Payload a livello di intero progetto, prima che esista qualunque campo `localized` o contenuto reale.

**Motivo**: `ADR-103` § 3 e `piano.yaml` arco-01 richiedevano la configurazione `localization` già in Fase 1; la Fase 1 è stata chiusa senza (nessuna occorrenza di `localization` nel codice). **Deviazione da registrare** in `fase-1-setup.md` (come richiesto dalle Conseguenze di ADR-103) e nel CHANGELOG. Oggi non ci sono contenuti: l'intervento costa poco e evita il problema di migrazione dati su campi già popolati.

**Configurazione da applicare** (da ADR-103, senza varianti):

```ts
localization: {
  locales: [
    { label: 'Italiano', code: 'it', fallbackLocale: 'en' },
    { label: 'English',  code: 'en', fallbackLocale: 'it' },
  ],
  defaultLocale: 'it',
  fallback: true,
}
```

**Lingua dell'interfaccia (aggiunta rispetto ad ADR-103)**: `localization.defaultLocale` **non** imposta la lingua dell'interfaccia: nei tipi di Payload 3.89 è la locale dei **contenuti** per chi non ne ha espressa una (vedi nota di chiarimento in `ADR-103`). Per avere Admin e `(app)` in italiano, come prevedono ADR-102 e ADR-103, serve la configurazione `i18n`, oggi assente in `payload.config.ts` (l'Admin è quindi in inglese):

```ts
import { it } from '@payloadcms/translations/languages/it'

i18n: {
  supportedLanguages: { it },
  fallbackLanguage: 'it',
}
```

Con pnpm `@payloadcms/translations` va aggiunto come **dipendenza diretta**, versione esatta uguale a quella di Payload (`3.89.0`): oggi è solo transitiva.

**Lingue d'interfaccia (deciso)**: **solo italiano** (`supportedLanguages: { it }`, `fallbackLanguage: 'it'`), per proporzionalità; eseguito in 4.0 il 2026-10-03 (commit `62cdde8`). Scartata l'alternativa italiano e inglese selezionabili.

**Regole che ne derivano** (da ADR-103, con la precisazione sopra):
- `defaultLocale: 'it'` è la locale dei contenuti per le richieste senza `locale` (chiamate interne, Local API, script) e la locale iniziale di modifica nell'Admin; **non** determina la lingua dei siti (la decide il `locale` esplicito di ogni richiesta) **né la lingua dell'interfaccia** (la decide `i18n`).
- Ogni richiesta REST dai siti passa `locale` esplicito: `it` per vietnamonamour.com, `en` per villadoree.com (release 1). Convenzione vincolante, da riportare nel contratto ADR-111.
- Nessun campo esistente (`users`, `settings`, `activityLog`) viene marcato `localized`: sono dati di configurazione, non contenuti.

**Checklist di chiusura sottofase**:
- [x] `localization` presente in `payload.config.ts`, valori identici a ADR-103.
- [x] Configurazione `i18n` applicata secondo la scelta confermata; `@payloadcms/translations` dipendenza diretta alla stessa versione di Payload; interfaccia Admin in italiano verificata a runtime.
- [x] Tipi rigenerati; `pnpm build` e avvio locale senza errori; selettore lingua contenuti: non verificabile in 4.0 (nessun campo `localized`); da verificare in 4.1.
- [x] Login (SSO e locale di emergenza) e Global `settings` invariati e funzionanti.
- [x] `payload migrate:create` eseguito (`20261003_155849_localization_enum`, solo enum `_locales`). Migrazione da committare; **applicare su Cloud SQL prod prima del push su `main`**.
- [x] Deviazione annotata in `fase-1-setup.md`, CHANGELOG aggiornato, stato aggiornato in `00-piano-generale.md`.

---

## 4.1 — Scaffolding Collection pages e Global sito

**Stato**: 🔲 da fare

**Dipende da**: 4.0 completata e **Fase 8.3** (valore `manager` di `adminRole`, `ADR-113`, `arco-33`). Non dipende dal design (`riepilogo-sessione-cms-siti-esterni.md` § 6).

**Obiettivo**: struttura dati dei due siti con permessi per ruolo, senza contenuti e senza il campo `layout` (che dipende dal design, 4.5).

**Riferimenti**: `ADR-101`, `ADR-102` §§ 1, 6, `ADR-103` § 3, `riepilogo-sessione-cms-siti-esterni.md` §§ 1, 2, 4, 6.

**Alberatura confermata** (flat, un livello sotto Home, nessuna gerarchia):
- vietnamonamour.com: Home, Ristorante, Camere, Prenota un tavolo, Contatti, Privacy Policy (solo footer).
- villadoree.com: Home, Apartments, Location, History, Privacy Policy (solo footer).

**Passaggi da confermare con l'umano prima di scrivere codice** (ADR-101 non li fissa):
1. **Slug delle due collection.** ADR-101 prescrive «una per sito»; proposta, allineata ai Global: `pages-vma` e `pages-villadoree`, generate da un'unica funzione factory con il sito come parametro.
2. **Slug dei campi `slug` (URL) localizzato o no.** In release 1 ogni sito usa una sola lingua. Se in release 2 gli URL saranno diversi per lingua, lo slug va localizzato **ora**: farlo dopo, con pagine esistenti, è la migrazione che 4.0 vuole evitare.
3. **Campi del Global «Generali»**: proposta di nomi (inglese) da confermare, con quali localizzati.
4. **Bozze sui Global**: `versions.drafts` è necessario sulle pagine (ADR-104, anticipato qui perché abilitarlo dopo cambia lo schema); sui Global header/footer è da decidere.
5. **Record scheletro delle pagine** (solo slug e titolo, in bozza) già in 4.1: default **no** (il popolamento è 4.6); se sì, si può anticipare la raccolta delle URL `from` dei Redirects (ADR-103).

**Collection `pages-vma` e `pages-villadoree`** (stessa struttura):
- `title` (localized), `slug` (univoco nella collection; localizzazione secondo il passaggio 2).
- `versions: { drafts: true }`.
- **Nessun campo `layout`** in questa sottofase: lo aggiunge 4.5 (ogni Block corrisponde 1:1 a un componente visivo del design).
- I campi SEO arrivano da 4.2.
- `admin.useAsTitle: 'title'`, `defaultColumns` essenziali, gruppo di menù Admin dedicato ai siti.

**Global `impostazioni-vma` e `impostazioni-villadoree`** (`tabs` non nominati, ADR-101 § 2):
- **Generali**: ragione sociale, P.IVA, indirizzo, contatti, social, copyright (nomi definitivi dal passaggio 3).
- **Header**: `mainNav`; **Footer**: `footerNav` (qui vive Privacy Policy).
- **Campo Link riusabile** (ADR-101 § 3): interno (relationship alla collection `pages-*` del **proprio** sito) oppure esterno (URL libero), con «apri in nuova scheda». La factory del campo riceve lo slug della collection di destinazione. Copre le voci esterne di villadoree.com (Book Now → Amenitiz, WhatsApp).
- Etichette delle voci di navigazione `localized`.

**Permessi** (`ADR-102` §§ 1, 6): `adminRole: manager` (`ADR-113`) con read+update pieno su `impostazioni-vma` e `impostazioni-villadoree` e create/update, pubblicazione compresa, sulle pagine dei due siti; **`delete` sulle pagine riservato agli admin** (deroga esplicita al default «`delete` eredita da `update`», `ADR-113`). Funzione `access` nativa a livello di collection/global, non convenzione lato UI. Admin e super-admin accesso completo.

**Bozze via REST** (audit 2026-10-04, F24): con `versions.drafts` e una lettura pubblica, `draft=true` è un parametro di query che chiunque può inviare, e Payload non filtra da solo per `_status`. `access.read` delle collection `pages-*` (e dei Global con `versions.drafts`) è quindi `({ req }) => (isManagerOrStaff(req.user) ? true : { _status: { equals: 'published' } })`, dove `isManagerOrStaff` richiede un utente attivo con `adminRole` `manager`, `admin` o `super-admin` (nuova funzione in `lib/auth/userAccess.ts`, costruita su `isActiveUser` di 7.0).

**Checklist di chiusura sottofase**:
- [ ] Le due collection e i due Global esistono con gli slug confermati e `localized` dove deciso.
- [ ] Prova per ruolo: manager vede e modifica solo ciò che gli compete e non può cancellare una pagina; admin e super-admin tutto.
- [ ] `GET /api/pages-vma?draft=true&locale=it` e `GET /api/pages-villadoree?draft=true&locale=en`, anonimi, restituiscono solo documenti pubblicati (comportamento dedotto dai sorgenti di Payload: verificare a runtime); stessa prova su `GET /api/pages-vma/:id?draft=true` e su `GET /api/globals/impostazioni-vma?draft=true` (Global con `versions.drafts`).
- [ ] Verificato in Admin il comportamento del valore di fallback sui campi localizzati (punto aperto di ADR-103): campo vuoto o valore di fallback mostrato.
- [ ] Migrazione generata, committata e applicata su Cloud SQL prod **prima** del push.
- [ ] **Nomi congelati**: elenco degli slug e dei `name` dei campi riportato nel CHANGELOG come base del contratto ADR-111.
- [ ] Voce di `activityLog` per gli eventi rilevanti, coerente con `payload-pattern/03-log-azioni.mdc`.

---

## 4.2 — Plugin di supporto (SEO, Redirects)

**Stato**: 🔲 da fare

**Dipende da**: 4.1 completata (arco-02: pagine come target della relationship `to` e come soggetto dei meta SEO).

**Obiettivo**: SEO per pagina e struttura dei Redirects, senza compilare nessun redirect (4.6).

**Riferimenti**: `ADR-103` §§ 1, 2; `riepilogo-sessione-cms-siti-esterni.md` §§ 3.1, 3.2.

**Plugin**:
- `@payloadcms/plugin-seo` su entrambe le collection pagina, con un override dei `fields` che marca `localized: true` i campi `title` e `description` del gruppo `meta` (in 3.89.0 il gruppo non è `localized` di default; gli altri sotto-campi sono da verificare).
- `@payloadcms/plugin-redirects`: aggiunge la collection `redirects` (`from`, `to` = relationship a `pages-*` oppure URL esterno, tipo 301/302). Non è automatico: i siti leggeranno la collection e applicheranno l'HTTP redirect.
- Versione **identica** a quella di Payload (`3.89.0`, tutti i pacchetti `@payloadcms/*` fissati alla stessa versione).

**Punti aperti da chiudere prima del codice** (non coperti da ADR-103):
1. **Due siti, due istanze del plugin** (decisione del 2026-10-04, dal sorgente di `@payloadcms/plugin-redirects` 3.89.0). Ogni istanza genera una collection (`overrides.slug`); il campo `from` è `unique` nella collection e `to` è una relazione alle collection indicate in `collections`. Con una collection sola i due siti non potrebbero avere lo stesso percorso sorgente (per esempio `/privacy`) e un redirect potrebbe puntare a pagine dell'altro sito. Quindi: `redirects-vma` (`collections: ['pages-vma']`) e `redirects-villadoree` (`collections: ['pages-villadoree']`), nomi proposti. Verificare a runtime che le due istanze convivano.
2. **Immagine SEO e storage dei media.** Non esiste una collection `media` né una decisione di storage. Cloud Run ha un filesystem effimero: gli upload richiedono uno storage esterno (es. un bucket GCS con adapter). Finché non è deciso, il plugin SEO va configurato **senza campo immagine**, e la decisione sui media è prerequisito di 4.5 (Gallery, Hero) e di un'eventuale immagine nei Global.

**Checklist di chiusura sottofase**:
- [ ] Plugin installati alla versione allineata a Payload, configurati secondo i due punti aperti.
- [ ] Campi `title` e `description` del gruppo `meta` SEO `localized` (override esplicito dei `fields` del plugin), modificabili dal manager come parte della pagina.
- [ ] Collection `redirects`: lettura pubblica (serve ai siti; il plugin la imposta da solo) e creazione, modifica e cancellazione riservate agli admin tramite `overrides.access` (`ADR-113`); il default del plugin le lascia a qualunque utente autenticato. Prova per ruolo (audit F5).
- [ ] Decisione annotata: **due istanze del plugin, una per sito** (`overrides.slug` e `collections` distinti, vedi il punto aperto 1). Verificare a runtime che le due istanze convivano; il tipo 301/302 compare solo con `redirectTypes`.
- [ ] Collection `redirects` presente e vuota; nessun redirect inserito.
- [ ] Migrazione applicata su Cloud SQL prod prima del push; CHANGELOG aggiornato.

---

## 4.3 — Meccanismo di preview

**Riferimenti**: `ADR-104`; `riepilogo-sessione-preview-e-aree-gestione.md` § 1.

### Parte A — lato CMS (ora)

**Stato**: 🔲 da fare

**Dipende da**: 4.1 completata (arco-04).

**Obiettivo**: tutto ciò che sta lato Payload della Draft Preview, definito nel **contratto ADR-111**, verificabile senza i siti.

**Primo passo: scrivere `ADR-111-contratto-cms-siti-esterni.md`** (decisione, namespace `ADR-1NN`; aggiungere l'entry in `piano.yaml` `adr_da_scrivere`). Contenuto minimo del contratto, valido per i due siti:
- **Link di preview firmato**: parametri (sito, collection, slug, locale, scadenza), algoritmo di firma, durata del token, route di destinazione `/api/preview` sul sito.
- **Letture in `draft: true`**: come si emette il token API per la lettura delle bozze (ADR-104 lo prevede; modalità da decidere, ad es. utente tecnico a sola lettura per sito), con quali permessi. **Vincolo emerso dall'audit (2026-10-04)**: `users` non ha `useAPIKey` e la creazione di un utente rifiuta chi ha entrambi i ruoli `none`, quindi un «utente tecnico» non è realizzabile senza una decisione di schema; inoltre la strategia API-key di Payload non controlla `active` né i ruoli. Opzioni da valutare in ADR-111: (a) un token firmato a sola lettura, per sito, verificato da una strategia di autenticazione dedicata, senza nuova collection; (b) una collection dedicata `api-clients`, un record per sito, sola lettura su `pages-*` e `impostazioni-*`, separata da `users`. **Non usare `useAPIKey`**: la 4 lo cambia (SHA1 rimosso, `enableAPIKey`), vedi `ADR-116`.
- **Letture del contenuto pubblicato**: REST senza token (ADR-105), `locale` esplicito obbligatorio.
- **Nomi dei campi e degli slug**: quelli congelati in 4.1.
- **Variabili d'ambiente** (tabella sotto).

**Implementazione lato Payload**: generazione e verifica del token di preview in un modulo dedicato (`lib/preview/`), collegamento al pulsante di anteprima dell'Admin per le pagine (impostazione `admin.preview`, da verificare sulla documentazione 3.89), nessun accesso ai siti.

**Checklist di chiusura sottofase**:
- [ ] ADR-111 scritto (parte preview), stato `proposta` finché i siti non lo confermano.
- [ ] ADR-111: meccanismo del token per la lettura delle bozze deciso, tenendo conto del vincolo emerso dall'audit (`users` non ha `useAPIKey` e `useAPIKey` non va usata, `ADR-116`; opzioni: token firmato per sito o collection `api-clients`; audit F4).
- [ ] Test automatico di firma e verifica del token (valido, scaduto, manomesso, sito/locale sbagliato).
- [ ] Il pulsante di anteprima dell'Admin genera un link coerente col contratto, verificato a mano su una bozza.
- [ ] Segreti in Secret Manager (accessor per singolo secret sul runtime SA), non in file né in Payload.

### Parte B — lato siti (rimandata)

**Stato**: ⏸ rimandata

**Condizione di sblocco**: frontend dei due siti avviati (progetto separato) con runtime Node per-request (Draft Mode non è compatibile con `output: 'export'`, ADR-104).

**Contenuto**: route `/api/preview` sui due siti, Draft Mode, letture `draft: true`, verifica end-to-end. Non è lavoro di questo repository: qui resta l'ADR-111 come contratto e la verifica di conformità.

---

## 4.4 — Revalidation e comunicazione coi siti

**Riferimenti**: `ADR-105` (parte «Revalidation dei due siti CMS» e «Comunicazione»); `riepilogo-sessione-bucket-d.md` §§ 2, 5.

> **Il rebuild via Cloud Build con `firebase-tools` descritto in ADR-105 riguarda solo il menù SSG (Fase 6.5)**, non i due siti CMS, che usano ISR on-demand. Nessuna parte di quel meccanismo è in questa sottofase.

### Parte A — lato CMS (ora)

**Stato**: 🔲 da fare

**Dipende da**: 4.1 completata; 4.3 Parte A per il contratto condiviso (ADR-111).

**Obiettivo**: l'hook di revalidation lato Payload e la parte «revalidation» di ADR-111.

**Contratto (ADR-111, parte revalidation)**, da fissare prima del codice: endpoint di revalidation del sito (percorso, metodo, header del secret, corpo con `path`/`tag` e `locale`), semantica per pubblicazione, modifica di pagina pubblicata, depubblicazione ed eliminazione, e per modifica dei Global (header/footer toccano tutte le pagine).

**Implementazione**:
- Hook `afterChange` (e `afterDelete`) sulle collection `pages-*` e sui Global `impostazioni-*`, che chiama l'endpoint del sito interessato con il secret condiviso. Si attiva solo sulla pubblicazione effettiva, non sul salvataggio di bozze.
- **Mai bloccante**: errori o timeout del sito non fanno fallire il salvataggio; l'esito è registrato in `activityLog` come `systemAction` (`ADR-115`), con l'id dell'evento in `detail`.
- **Inattivo se l'URL del sito non è configurato** (nessun errore, voce di log), così l'hook può esistere prima dei siti.
- Provato con un ricevente finto locale che registra le chiamate.

**Checklist di chiusura sottofase**:
- [ ] ADR-111 completo (preview + revalidation).
- [ ] Hook verificato con ricevente finto: chiamata su pubblicazione, nessuna su bozza, comportamento corretto con URL assente e con ricevente irraggiungibile.
- [ ] Salvataggio mai bloccato da un errore di revalidation (provato).
- [ ] Esito della revalidation registrato in `activity-log` come `systemAction`, con l'id dell'evento in `detail` (`ADR-115`; la migrazione è già stata fatta in 6.4).
- [ ] Segreti e URL come da tabella variabili; Cloud Run configurato; CHANGELOG aggiornato.

### Parte B — ISR e verifica end-to-end (rimandata)

**Stato**: ⏸ rimandata

**Condizione di sblocco**: frontend dei due siti sviluppati e deployati sui rispettivi Firebase Hosting.

**Contenuto**: endpoint di revalidation implementati sui siti, ISR on-demand su Firebase Hosting, verifica end-to-end della catena pubblicazione → revalidation → pagina aggiornata. Punti aperti già noti in ADR-105: nome/percorso esatto dell'endpoint e del secret (chiusi dal contratto ADR-111).

---

## 4.5 — Definizione dei Block del layout builder

**Stato**: ⏸ rimandata

**Condizione di sblocco**: design dei due siti e frontend disponibili. Ogni Block corrisponde 1:1 a un componente visivo reale; va definito guardando il design, non prima, per non riscriverlo.

**Prerequisiti da chiudere prima di avviarla**: decisione sullo storage dei media (vedi 4.2, punto aperto 2); campo `layout` di tipo Blocks aggiunto a `pages-*` (qui, non in 4.1); Block iniziali attesi da ADR-101: Hero, RichText, Gallery, CTA, più il blocco del modulo prenotazione per «Prenota un tavolo» (innesto con Fase 5.6) e le pagine con contenuto specifico (`riepilogo-sessione-cms-siti-esterni.md` § 4: History di villadoree.com come pagina reale, RichText + Gallery).

---

## 4.6 — Content population e compilazione Redirects

**Stato**: ⏸ rimandata

**Dipende da**: 4.5 (le pagine devono esistere come record prima di poter essere target di un redirect interno).

**Condizione di sblocco**: 4.5 completata.

**Contenuto**: popolamento reale in Admin da parte del manager (compresa l'indicazione sulla colazione del B&B, testo della pagina e non campo di `impostazioni-sistema`); compilazione `from` → `to` dei Redirects (riservata agli admin, `ADR-113`), con gli URL sorgente raccolti da Google Search Console («Pagine») o, in mancanza, da ricerca `site:` (una tantum al lancio). La sola raccolta degli URL `from` è anticipabile senza rischio.

---

## Variabili d'ambiente introdotte dalla Fase 4

Nomi **canonici**, uno per scopo, senza alias; da confermare prima di 4.3 Parte A e riportati in `.env.example` e nel contratto ADR-111. Nessuna variabile `NEXT_PUBLIC_*`: sono tutte lette a runtime lato server.

| Nome (proposta) | Scopo | Classe | Dove |
|---|---|---|---|
| `PREVIEW_SECRET_VMA`, `PREVIEW_SECRET_VILLADOREE` | firma del token di preview per sito | secret (Secret Manager) | Cloud Run, accessor per singolo secret |
| `REVALIDATE_SECRET_VMA`, `REVALIDATE_SECRET_VILLADOREE` | secret condiviso della revalidation per sito (distinto dal precedente) | secret (Secret Manager) | idem |
| `SITE_VMA_PUBLIC_URL`, `SITE_VILLADOREE_PUBLIC_URL` | URL pubblico di ciascun sito (link di preview, chiamata di revalidation) | runtime-plain | env su Cloud Run; vuota finché il sito non esiste |

Valori di sviluppo in `.env.example` già dalla Fase 4.0/4.1, non nella fase in cui servono.

---

## Incoerenze note

- **`piano.yaml` arco-06 (errore di scrittura) — corretto 2026-10-03.** Attribuiva alla Fase 3 un ambiente «Firebase Hosting, Cloud Functions» necessario per 4.4. Firebase appartiene ai due siti (due progetti Firebase distinti, in un altro progetto), non a questo progetto. L'arco è stato rimosso (id non riassegnato, commento nel file); nessuna attività Firebase in questo repository.
- **ADR-105, omissione — corretta 2026-10-03.** Diceva che i siti sono «su Firebase Hosting» senza precisare che sono due applicazioni distinte, ciascuna su un proprio progetto Firebase. Aggiunta una «Nota di chiarimento» in fondo all'ADR; la decisione non cambia.
- **ADR-103 e due siti.** Il plugin Redirects genera una collection per istanza e i siti sono due: decisa il 2026-10-04 con due istanze, una per sito (4.2, punto aperto 1).
- **ADR-103, semantica di `defaultLocale`.** Attribuisce a `defaultLocale` anche la lingua d'interfaccia, ma in Payload 3.89 è la locale dei contenuti; l'interfaccia dipende da `i18n`. Nota di chiarimento aggiunta in `ADR-103` (2026-10-03); la decisione su locales, fallback e `locale` esplicito non cambia. Inoltre l'abilitazione di `localization` crea l'enum `_locales` nello schema: la migrazione di 4.0 non è vuota.
- **Storage dei media non deciso.** Nessuna collection `media` né storage esterno (vedi 4.2, punto aperto 2). Prerequisito di 4.5.
- **Archi 17 e 25 (nota per le Fasi 5 e 6).** `piano.yaml` indica la Fase 3 come produttrice di «Cloud Scheduler» (arco-25, per 5.3) e «Cloud Scheduler, GCS» (arco-17, per 6.4). Né `fase-3-deploy.md` né il CHANGELOG riportano la loro predisposizione: sono prerequisiti reali non consegnati. Questa volta non sono un errore di scrittura, ma un debito. **Risolto il 2026-10-04 (`po-04`)**: li predispone la nuova sottofase `fase-6.0`, senza riaprire la Fase 3, e `arco-17` e `arco-25` ripartono da lì.
- **Sottofasi rimandate e Fase 5.6.** Il form pubblico «Prenota un tavolo» (5.6) innesta sulla pagina di 4.1 ma vive nel frontend del sito: va rimandato insieme a esso.
