---
stato: validato
---

# Fase 6 — Menù digitale (collection, API, backoffice)

> Dettaglio operativo. Fase di dominio specifica del progetto (non ereditata dal catalogo). Riferimenti: `ADR-108-modello-dati-menu-digitale.md` (con i tre emendamenti del 2026-10-04: Servizi, seed e import; menù bilingue; tipologie di vino e bevanda con la birra tra le bevande), `ADR-112-contratto-cms-frontend-menu.md`, `ADR-105-strategia-rendering-comunicazione-siti-esterni.md` (con le note di chiarimento del 2026-10-04), `ADR-113-ruoli-permessi-admin-app.md`, `ADR-109-global-impostazioni-sistema.md`, `ADR-103-plugin-supporto-cms.md` (localizzazione); `fase-7-impostazioni-sistema.md`, `fase-8-shell-app.md`, `fase-3-deploy.md` § 3.4. Regole: `core/01-proporzionalita.mdc`, `core/04-changelog-commit.mdc`, `stack/01-stile-codice.mdc`, `stack/01b-cloud-gcp.mdc`, `payload-pattern/01-architettura.mdc`, `payload-pattern/02-convenzioni-payload.mdc`, `payload-pattern/03-log-azioni.mdc`.

Aggiornare lo stato di ogni sottofase qui sotto e in `00-piano-generale.md` non appena completata.

**Prerequisito**: Fase 3 chiusa, Fase 4.0, Fase 7 e Fase 8 completate (ordine in `00-piano-generale.md`). La 6.0 richiede azioni manuali su GCP (progetto `vma-vd`, regione `europe-west1`) e non cambia il codice.

**Fonti degli schemi**: ADR-108 non elenca campo per campo piatti, vini, distillati e bevande («campi già confermati sufficienti»). I campi di questo file derivano da `prisma/schema.prisma` di `vtn-backend` (HEAD `35146cd`) e da `src/types/payload-types.ts` di `vtn-menu-ristorante-next` (HEAD `911d3bf`), letti il 2026-10-04, con i nomi portati in inglese. **Lo snapshot JSON dell'import non è stato letto**: i conteggi e i valori di tassonomia citati vengono da ADR-108.

---

## Perimetro e decisioni già prese (da non riaprire)

- **Questo piano fornisce al menù digitale le letture di contenuto e il file di disponibilità**; il frontend (6.7) è un'app Next.js SSG su Firebase, in un altro progetto, **fuori perimetro**. Il menù attuale resta in produzione, sul suo Firebase, finché il nuovo non è pronto (`po-07`).
- **Contratto** (`ADR-112`): REST standard di Payload senza token, `locale=it|en` sempre esplicito, `limit=100`, **voci disabilitate incluse con il flag `disabled`**, sezioni nel codice del frontend, `disponibilita.json` con chiavi inglesi (`dishes`, `wines`, `drinks`, `spirits`, `fixedMenus`, `services`, `globalMessage`), cache di 60 secondi, polling del browser di circa 5 minuti. **Orari, chiusure e giorni speciali non sono nel file**: una loro modifica richiede il rebuild.
- **Nomi congelati** alla chiusura di 6.2 (slug delle collection e `name` dei campi); l'elenco va nel CHANGELOG come base del contratto.
- **Menù bilingue** (`ADR-108`, secondo emendamento): italiano e inglese, traduzione manuale, campi testuali `localized` fin dallo scaffolding. Locale predefinita `it`, con ripiego incrociato.
- **Ruoli** (`ADR-113`): nell'App il manager (`appRole`) gestisce il menù; admin e super-admin accedono per `adminRole`. Le tassonomie sono in sola scelta per il manager e si gestiscono nell'Admin. **Cancellazione sempre soft** per il manager (si disabilita, non si elimina).
- **Foto escluse**; nessun concetto di «variante» del piatto (la quantità sta in `portion` sul menu fisso); **cocktail non modellati**; **la birra non ha una collection**: è una bevanda con tipologia «Birre» (terzo emendamento).
- **Import** (`ADR-108`, primo emendamento): solo dati elementari, da snapshot JSON, in 6.8; i menu fissi e le loro categorie si ricompongono a mano.
- **Orari e chiusure** vivono in `impostazioni-sistema` (Fase 7): il Global «Generali» del menù **nasce senza quei campi** e senza `isSpecialPeriod` (`ADR-109` §2).
- **Endpoint chiamati da Cloud Scheduler**: secret condiviso in un'intestazione (nota di `ADR-105`, 2026-10-04), perché il servizio Cloud Run è pubblico.
- **CI/CD solo su Cloud Build**, mai GitHub Actions.

## Ordine di dipendenza reale

**6.0 → 6.1 → 6.2 → 6.8 (prova in sviluppo) → 6.3 → 6.4 → 6.6 → 6.5.** Gli identificativi non indicano l'ordine di esecuzione.
- 6.1 precede 6.2 (`arco-14`: le collection del menù puntano alle tassonomie).
- 6.2 precede 6.3, 6.4, 6.6 e 6.8 (`arco-16`, `arco-15`, `arco-39`); 6.0 e Fase 7.2 precedono 6.4 (`arco-17`, `arco-29`); 6.4 precede 6.5 (`arco-18`); Fase 8 precede 6.6 (`arco-30`).
- **6.8 subito dopo 6.2** (prova in sviluppo): così 6.3, 6.4 e 6.6 si verificano su dati reali. L'esecuzione in produzione si fa prima del lancio, con uno snapshot del giorno.
- **6.5 dopo 6.6**: il pulsante «Ricompila il menù pubblico» sta nella sezione Menù dell'App (`arco-40`). La 6.6 si esegue dopo la 6.4 per verificare sul file i cambi di stato: è una scelta d'ordine, non una dipendenza di codice.
- Una chat Composer per sottofase. 6.1 e 6.2 modificano entrambe lo schema: si eseguono in sequenza.

## Principi trasversali per questa fase

1. **Nomi fissati prima di scrivere codice**: slug e `name` dei campi sono quelli delle tabelle di 6.1 e 6.2, **congelati alla chiusura di 6.2**. Dopo, ogni ridenominazione è una modifica di schema con migrazione e rompe il frontend. Nessun alias, nessun fallback tra nomi diversi.
2. **Convenzione lingua**: nomi di campi, funzioni e file in **inglese**; etichette dell'interfaccia in **italiano** (`stack/01-stile-codice.mdc`).
3. **Nessun deploy prima della migrazione**: `main` fa deploy automatico su Cloud Run. Per ogni sottofase che cambia lo schema, la migrazione va **applicata su Cloud SQL prod prima del push** (`pnpm payload migrate` via Auth Proxy, `docs/operativo/cloud-sql-produzione.md`).
4. **Commit solo dopo verifica runtime** (non solo TypeScript), push manuale, voce di CHANGELOG per ogni commit.
5. **Permessi con la sessione dell'utente**: l'App legge e scrive con la Local API e `overrideAccess: false`. L'accesso per sezione passa da `canAccessSection(user, 'menu')` (Fase 8.3), non da controlli duplicati.
6. **Locale sempre esplicita** nelle letture interne e nei test, come nel contratto.

---

## 6.0 — Predisposizione GCP: Cloud Scheduler, bucket GCS e IAM

**Stato**: 🔲 da fare

**Dipende da**: nessuna sottofase di codice. Recupera il debito di Fase 3 (`arco-17`, `arco-25`) **senza riaprirla**. Lavoro dell'**umano** su GCP; Composer scrive solo la documentazione operativa.

**Obiettivo**: le risorse che servono a 6.4 (reset e file di disponibilità) e a 5.3 (anonimizzazione GDPR), con i permessi minimi. I job non si creano qui: li creano 6.4 e 5.3.

**Riferimenti**: `ADR-105` (nota di chiarimento sul secret), `ADR-112` §3, `docs/operativo/cloud-run-produzione.md` (service account e servizio esistenti: runtime `vma-vd-backoffice-run@vma-vd.iam.gserviceaccount.com`, servizio `vma-vd-backend-backoffice-git`).

**Risorse da creare** (nomi proposti, da confermare nell'esecuzione):

| Risorsa | Nome proposto | Note |
|---|---|---|
| API | Cloud Scheduler | Cloud Storage: verificare che sia abilitata. Secret Manager e Cloud Build sono già in uso |
| Service account dello Scheduler | `vma-vd-scheduler@vma-vd.iam.gserviceaccount.com` | `roles/run.invoker` sul servizio Cloud Run. **Da solo non protegge nulla** (servizio pubblico): serve il secret |
| Bucket di `disponibilita.json` | `vma-vd-menu-availability` | `europe-west1`, accesso uniforme a livello di bucket, **lettura pubblica** (`allUsers` con `roles/storage.objectViewer`) |
| Permesso di scrittura | runtime SA sul **solo bucket** | `roles/storage.objectAdmin` sul bucket: per sovrascrivere un oggetto servono anche i permessi di cancellazione. **Da verificare nella prova** |
| Secret condiviso | `scheduler-shared-secret` (Secret Manager) | Variabile d'ambiente `SCHEDULER_SECRET`. Secret Accessor al runtime SA **per singolo secret**, come gli altri |

**Progetto Firebase del menù**: non esiste ancora (né quello dei due siti) e il nome verrà più avanti. Il suo ID entra nel CORS del bucket: la creazione è **manuale**, nella console di Firebase, con Hosting attivo.
- Se il progetto esiste già alla 6.0: imposta il CORS come sotto.
- Se non esiste: il bucket nasce **senza CORS** e il CORS si imposta alla creazione del progetto, **comunque prima di 6.5 Parte B**.

**CORS del bucket** (con `gcloud storage buckets update gs://BUCKET --cors-file=cors.json`): origini `https://<id-progetto>.web.app` e `https://<id-progetto>.firebaseapp.com`, metodi `GET` e `HEAD`; `http://localhost:3000` solo se serve allo sviluppo del frontend. Il dominio definitivo si aggiunge al passaggio in produzione.

**Verifiche tecniche** (non ancora fatte): che l'organizzazione non imponga il blocco dell'accesso pubblico ai bucket; che un oggetto caricato con `Cache-Control: public, max-age=60` sia servito con quell'intestazione (il default di un oggetto pubblico è di un'ora); che la richiesta con `Origin` ottenga le intestazioni CORS.

**Documentazione**: nuovo `docs/operativo/gcp-menu-scheduler.md` (nomi, ruoli assegnati, comandi usati, esito delle verifiche). **Nessun segreto nel file.**

**Checklist di chiusura sottofase**:
- [ ] Cloud Scheduler abilitato; service account dello Scheduler creato con `run.invoker` sul solo servizio.
- [ ] Bucket creato, a lettura pubblica; scrittura riservata al runtime SA sul solo bucket.
- [ ] Secret creato in Secret Manager e accessibile al runtime SA per singolo secret; **valore non scritto in nessun file del repo**.
- [ ] Oggetto di prova: servito con cache a 60 secondi; CORS verificato con `curl -I -H "Origin: …"` (o rimandato, con nota, se il progetto Firebase non c'è ancora).
- [ ] `docs/operativo/gcp-menu-scheduler.md` scritto; `piano.yaml` e `00-piano-generale.md` aggiornati.

---

## 6.1 — Tassonomie e Global «Generali»

**Stato**: 🔲 da fare

**Dipende da**: Fase 7 e Fase 8 completate. Non dipende da 6.0.

**Obiettivo**: le collection tassonomiche, il Global «Generali» senza i campi orario e i permessi, con il seed dei valori usati dai record da importare.

**Riferimenti**: `ADR-108` §§5, 8, 9 e primo emendamento (seed esteso), secondo emendamento (campi `localized`); `ADR-109` §§2 e 4; `ADR-113` §2.

**Collection tassonomiche** (nomi proposti):

| Tassonomia | Slug | Campi | Seed |
|---|---|---|---|
| Categoria piatto | `dish-categories` | `name` (L) | dall'import (6.8) |
| Allergeni | `allergens` | `name` (L), `description` (L, facoltativo: informazione normativa, es. solfiti) | 14 normativi UE, con italiano e inglese |
| Paesi | `countries` | `name` (L), `enabled` (checkbox, vero) | 13, di cui 12 abilitati (Libano no) |
| Regioni | `regions` | `name` (L), `country` (→ `countries`, obbligatorio), `enabled` | 16, di cui 15 abilitate (Sicilia no) |
| Denominazioni | `appellations` | `name`, `region` (→ `regions`, obbligatorio) | Carso, Collio (→ Friuli Venezia Giulia), Franciacorta (→ Lombardia) |
| Classificazioni | `classifications` | `name`, `country` (→ `countries`, obbligatorio) | D.O.C.G., D.O.C., I.G.T., D.O.P. (→ Italia); A.O.C., A.O.P. (→ Francia) |
| Tipologia distillato | `spirit-types` | `name` (L) | dall'import (6.8); attesi 7: Distillati vietnamiti, Amari e Liquori, Grappe, Vin Doux Naturel, Calvados, Whisky, Rum |
| Tipologia vino | `wine-types` | `name` (L) | dall'import (6.8); attesi: Bianchi, Rosati, Rossi, Spumanti, Champagne |
| Tipologia bevanda | `drink-types` | `name` (L) | dall'import (6.8); attesi: Calde, Fredde, Vietnamite. «Birre» la crea un admin al primo inserimento |

(L) = `localized`. Denominazioni e classificazioni **non** sono `localized` (nomi propri e sigle). Il seed completo di Paesi e Regioni è la tabella di `ADR-108`, primo emendamento; le tipologie di vino e di bevanda sono introdotte dal terzo emendamento. **Le tassonomie senza seed (categorie dei piatti e tipologie) nascono vuote in 6.1 e si popolano con l'import (6.8)**, dai nomi dello snapshot: i valori «attesi» qui sopra vengono dalla documentazione del prototipo (vino e distillato) e dall'API del vecchio backend letta il 2026-10-04 (bevanda), e vanno **verificati sullo snapshot**. Il manager sceglie soltanto; le tipologie le crea l'admin.

**Allergeni, denominazioni di riferimento** (Reg. UE 1169/2011, allegato II): cereali contenenti glutine, crostacei, uova, pesce, arachidi, soia, latte, frutta a guscio, sedano, senape, semi di sesamo, anidride solforosa e solfiti, lupini, molluschi (inglese: cereals containing gluten, crustaceans, eggs, fish, peanuts, soybeans, milk, tree nuts, celery, mustard, sesame seeds, sulphur dioxide and sulphites, lupin, molluscs). **Il seed usa i nomi italiani del vecchio sistema** (ADR-108: coincidono già); le traduzioni inglesi qui sopra sono una proposta da rivedere.

**Global «Generali»** (slug proposto `menu-general`): **un solo campo**, `globalMessage` (`localized`, testo breve: l'avviso immediato, per esempio «oggi cucina chiusa»; alimenta `disponibilita.json`, quindi cambia senza rebuild). **Nessun campo di orario o di chiusura e nessun `isSpecialPeriod`** (`ADR-109` §2). Il prototipo ha anche `messaggioChiusura`, che non si porta: il banner di chiusura lo compone il frontend da orari e chiusure annuali (`label`). Se il ristorante volesse un testo libero a locale chiuso, si aggiunge dopo con una migrazione.

**Seed**: script idempotente per chiave naturale (nome), sullo schema di `scripts/seed-super-admin.ts` (`pnpm seed:menu-taxonomies`, nome proposto), eseguito in sviluppo e poi in produzione **da locale**, come in `fase-3-deploy.md` § 3.4. Prima la migrazione sul database di produzione, poi il seed.

**Permessi**:

| Chi | Tassonomie e «Generali» |
|---|---|
| Richiesta anonima | Lettura (serve al contratto, `ADR-112`) |
| `admin`, `super-admin` | Lettura e scrittura, anche cancellazione |
| `appRole: manager` | **Sola lettura** delle tassonomie; per «Generali» lettura e modifica del solo `globalMessage` (dall'App) |
| `adminRole: manager` | Nessun accesso nell'Admin (`admin.hidden` con funzione, verificato con 8.3) |

**Verifiche tecniche**: prova per ruolo (anonimo, utente senza ruoli, manager App, admin, super-admin) su lettura e scrittura di ogni collection e del Global; il seed non crea duplicati se rieseguito; le relazioni (`regions.country`, `appellations.region`, `classifications.country`) rifiutano un riferimento vuoto.

**Checklist di chiusura sottofase**:
- [ ] Collection e Global registrati con i nomi della tabella (o con quelli confermati nella validazione).
- [ ] Campi `localized` secondo la regola; locale predefinita `it`, ripiego incrociato verificato su una lettura `locale=en` con testo mancante.
- [ ] Seed eseguito e verificato (conteggi: 13 Paesi, 16 regioni, 3 denominazioni, 6 classificazioni, 14 allergeni).
- [ ] Prova per ruolo superata.
- [ ] Migrazione generata, committata e applicata su Cloud SQL prod **prima** del push.
- [ ] Riportato che «Generali» nasce senza campi orario (come da checklist di 7.2).
- [ ] CHANGELOG.

---

## 6.2 — Collection del menù e relazione menu fisso–piatto

**Stato**: 🔲 da fare

**Dipende da**: 6.1.

**Obiettivo**: le collection dei contenuti del menù, con i permessi di `ADR-113`, la lettura pubblica del contratto `ADR-112` e i nomi congelati.

**Riferimenti**: `ADR-108` §§1–4, 6, 9 e emendamenti, `ADR-112` §1, `ADR-113` §§3–4.

**Nomi e campi** (proposti; **diventano il contratto alla chiusura**). (L) = `localized`. Tutte hanno `disabled` (checkbox, falso): la cancellazione del manager è la disabilitazione.

`dishes` — Piatti

| Campo | Tipo | Note |
|---|---|---|
| `name` (L) | testo | obbligatorio |
| `description` (L) | testo lungo | |
| `price` | numero | obbligatorio |
| `category` | → `dish-categories` | obbligatorio |
| `allergens` | → `allergens`, molti | |
| `glutenFree`, `dairyFree`, `vegan`, `eggFree` | checkbox | `noLatticini` e `noUovo` del vecchio sistema |
| `soldOut` | checkbox | «terminato per il servizio»: temporaneo, reset in 6.4 |
| `disabled` | checkbox | assenza a tempo indefinito |

`wines` — Vini: `name`, `description` (L), `winery`, `year` (testo), `volume` (testo, per esempio «75 cl»), `abv` (testo), `price`, `glassPrice` (facoltativo), `classification` (→ `classifications`), `country` (→ `countries`, obbligatorio), `region` (→ `regions`), `appellation` (→ `appellations`), `type` (→ `wine-types`, obbligatorio), `disabled`. Disponibilità **binaria** (`disabled`): nessun `soldOut`.

`spirits` — Distillati: `name`, `description` (L), `abv`, `aging`, `volume`, `price`, `country` (→ `countries`, obbligatorio), `type` (→ `spirit-types`, obbligatorio), `disabled`.

`drinks` — Bevande, **birra compresa** (tipologia «Birre»): `name` (L), `description` (L), `price`, `type` (→ `drink-types`, obbligatorio), `country` (facoltativo), `abv` e `volume` (facoltativi, per le birre e simili), `allergens` (→ `allergens`, molti, facoltativo), `disabled`. Disponibilità binaria (`disabled`), come i vini.

`menu-services` — Servizi: `name` (L), `price`, `disabled`. Omonimo del campo `services` di `impostazioni-sistema`: nel codice si distinguono (`menuServices`, `serviceHours`).

`fixed-menu-categories` — Categorie menu fisso: `name` (L), `visibility`, `disabled`.

`fixed-menus` — Menu fissi: `name` (L), `description` (L), `price`, `category` (→ `fixed-menu-categories`, obbligatorio), `visibility` (`always` / `lunch_only` / `dinner_only`, obbligatorio, predefinito `always`), `dishes` (array: `dish` → `dishes`, obbligatorio, e `portion` (L, facoltativo)), `services` (→ `menu-services`, molti), `disabled`.
- La relazione `menu_fisso_piatto` di `ADR-108` §4 si realizza come **campo array del menu fisso**, senza collection di giunzione. L'ordine dell'array è l'ordine di visualizzazione. Un piatto non compare due volte nello stesso menu (validazione).

Il contratto non impone altri campi. Il valore predefinito di `visibility` e la validazione sono scelte di implementazione.

**Controlli di coerenza** (non bloccanti per il resto della fase): in un vino la regione deve appartenere al paese e la denominazione alla regione; un valore incoerente viene rifiutato con un messaggio in italiano. **La validazione allergeni/flag** (`ADR-108` §10) resta un punto aperto non bloccante: **non si progetta qui**.

**Permessi**:

| Chi | Collection del menù |
|---|---|
| Richiesta anonima | Sola lettura (`ADR-112`), voci disabilitate incluse |
| `admin`, `super-admin` | Tutto, compresa la cancellazione fisica |
| `appRole: manager` | Lettura, creazione e modifica (`canAccessSection(user, 'menu')`); **nessuna cancellazione** |
| `adminRole: manager` | Nessun accesso nell'Admin (`admin.hidden`) |

**Pubblicazione**: nessuna bozza (`versions` non attivi): ciò che si salva è subito leggibile. Voci nuove e modifiche ai contenuti compaiono sul menù pubblico dopo il rebuild (6.5); gli stati `disabled` e `soldOut` passano dal file di disponibilità (6.4).

**Verifiche tecniche**: lettura anonima `GET /api/dishes?locale=it&limit=100&depth=2` e con `locale=en`; la REST restituisce anche le voci disabilitate con `disabled: true`; prova per ruolo su ogni collection (creazione, modifica, cancellazione); un manager che tenta la cancellazione è rifiutato.

**Checklist di chiusura sottofase**:
- [ ] Collection registrate con i nomi confermati; sezione «Menù digitale» nella barra laterale dell'Admin per admin e super-admin.
- [ ] Campi `localized` secondo la regola di `ADR-108`; **nessun** `localized` su nomi propri, sigle, anno, capacità, grado, prezzi e flag.
- [ ] Menu fisso: array con `portion`, ordine, nessun doppione; `visibility` su menu e categoria.
- [ ] Lettura pubblica e prova per ruolo superate.
- [ ] Migrazione applicata su Cloud SQL prod **prima** del push.
- [ ] **Nomi congelati**: l'elenco di slug e campi riportato nel CHANGELOG come base del contratto con il frontend.

---

## 6.8 — Import dei dati elementari dal vecchio backend

**Stato**: 🔲 da fare

**Dipende da**: 6.2 (`arco-39`). Si esegue subito dopo, in sviluppo; la produzione si esegue prima del lancio.

**Obiettivo**: popolare piatti, vini, distillati, bevande, servizi e le tassonomie con i dati del vecchio sistema, in italiano. Il nuovo menù ne è un'evoluzione: l'import **migliora i dati, non li copia alla lettera**.

**Riferimenti**: `ADR-108`, primo emendamento (criteri) e secondo (solo italiano); `docs/operativo/export-menu-vtn-backend.md`; `fase-3-deploy.md` § 3.4 (esecuzione da locale), `scripts/seed-super-admin.ts`, `scripts/prod-db.sh`.

**Sorgente**: snapshot JSON dell'API v1 di `vtn-backend`, esportato il giorno dell'import con la procedura operativa. Non si legge l'API dal vivo. Lo snapshot non si committa nel repository: va fuori dal repo o in una cartella ignorata da git (posizione da fissare all'esecuzione).

**Script**: `scripts/import-menu-vtn-backend.ts` (nome proposto), con `pnpm import:menu` (da fissare), argomenti: cartella dello snapshot e `--apply`. **Senza `--apply` è un report a secco**: non scrive nulla.
- Scrittura con la Local API, locale `it`, **idempotente per chiave naturale** (il report a secco segnala le chiavi duplicate nello snapshot).
- Ordine: tassonomie, poi servizi, poi piatti, vini, distillati, bevande.
- Sequenza di esecuzione: report a secco → prova in sviluppo → verifica a campione → produzione da locale (migrazione già applicata).

**Corrispondenze** (vecchio → nuovo):

| Vecchio | Nuovo | Note |
|---|---|---|
| `Nazione`, `Regione` | `countries`, `regions` | abbinate per nome ai valori del seed (6.1); un nome non trovato è un errore del report, non una creazione silenziosa |
| `Zona` | `appellations` | solo Carso, Collio e Franciacorta; Valdobbiadene non si crea |
| `certificazione` del vino | `classification` | «D.O.C» e «A.O.P» diventano «D.O.C.» e «A.O.P.» |
| `CategoriaPiatti` | `dish-categories` | create dai nomi dello snapshot |
| `TipologiaLiquore` | `spirit-types` | create dai nomi dello snapshot |
| `TipologiaVino`, `TipologiaBevanda` | `wine-types`, `drink-types` | create dai nomi dello snapshot |
| `Piatto` | `dishes` | `inLista` falso → `disabled`; allergeni per nome |
| `Vino`, `Liquore`, `Bevanda` | `wines`, `spirits`, `drinks` | `inLista` falso → `disabled`; `prezzoCalice` → `glassPrice`; `grado` → `abv`; `cantina` → `winery`; `capacita` → `volume` |
| `ServizioAccessorio` | `menu-services` | coperto, diritto di dolce, diritto di tappo |

**Voci nascoste**: importate come `disabled` (conteggi di riferimento dello snapshot del 2026-10-04: 44 piatti, di cui 3 nascosti; 90 vini, 13; 38 distillati, 6; 13 bevande; 3 servizi; 14 allergeni). Libano e Sicilia esistono perché le voci nascoste mantengano la geografia.

**Non importati**: menu fissi e relative categorie (si ricompongono a mano), birre e cocktail, menu speciali come San Valentino (si ricreano in 6.3), le varianti «2 Nem di carne» e «2 Nem vegetariani» (nei due menu useranno il piatto base con `portion`).

**Normalizzazioni**: spazi ai bordi; `capacita` («75cl» e «75 cl» in una forma sola); `certificazione` come sopra. **Correzioni a mano nella revisione**: una descrizione corrotta (`Brut••75cl••COTEAUX DU LAYON•LOIRA`) e una che ripete la regione.

**Revisione nell'App prima del lancio** (a carico dell'umano, con 6.6): ricomposizione delle 2 categorie e degli 8 menu fissi (3 Degustazione, 5 Business lunch) con `visibility` (Degustazione sempre, Business lunch solo a pranzo), `portion` e collegamento ai servizi (oggi il coperto è su due business lunch); traduzioni inglesi manuali; i **9 piatti su 44 senza allergeni dichiarati**, da rileggere con il ristorante.

**Checklist di chiusura sottofase**:
- [ ] Report a secco: conteggi per entità, duplicati di chiave naturale, valori non abbinati. Nessun errore.
- [ ] Prova in sviluppo; secondo `--apply` senza duplicati (idempotenza).
- [ ] Esecuzione in produzione da locale con uno snapshot del giorno; conteggi coincidenti.
- [ ] Lettura pubblica `locale=it` di un piatto, un vino e un distillato importati; una voce nascosta con `disabled: true`.
- [ ] CHANGELOG; elenco della revisione consegnato all'umano.

---

## 6.3 — Giorni Speciali

**Stato**: 🔲 da fare

**Dipende da**: 6.2.

**Obiettivo**: la collection `special-days`: un giorno, o un solo servizio, il cui menù **sostituisce del tutto** l'offerta normale (à la carte e menu fissi). Il servizio non coperto segue il menù normale.

**Riferimenti**: `ADR-108` §1, `riepilogo-sessione-requisiti-architettura-menu-digitale.md` §2.1.

**Campi** (slug proposto `special-days`): `date` (solo giorno, obbligatorio), `scope` (`day` / `lunch` / `dinner`, obbligatorio), `content` (da fissare: vedi sotto). Pianificabile in anticipo; un giorno speciale preparato in anticipo è leggibile nella REST pubblica (accettato, nessuna bozza).

**Decisione da prendere all'inizio di 6.3: struttura di `content`** (`ADR-108` §1 la rimanda a questa sottofase). Proposta, perché un menù sostitutivo deve portare gli allergeni dei piatti:
- `content` è una **relazione a uno o più menu fissi** (che già contengono i piatti, le porzioni, il prezzo e gli allergeni), più un `message` (L) facoltativo per il banner;
- un menu fisso riservato a un giorno speciale deve restare fuori dalle pagine normali: servirebbe un flag `specialOnly` sul menu fisso (**campo nuovo**, da approvare e da inserire prima del congelamento dei nomi, o con una migrazione additiva).

**Vincolo di coerenza**: due giorni speciali non possono coprire lo stesso servizio della stessa data (`day` si sovrappone a `lunch` e a `dinner`).

**Permessi**: lettura anonima; creazione e modifica `appRole: manager` e admin; cancellazione solo admin (disabilitazione con `disabled`, come le altre voci).

**Caso di prova**: ricreare San Valentino come menu fisso con `specialOnly` e un giorno speciale `dinner`.

**Checklist di chiusura sottofase**:
- [ ] Struttura di `content` approvata e documentata qui.
- [ ] Lettura pubblica con `locale=it` e `en`; validazione della sovrapposizione.
- [ ] Prova per ruolo.
- [ ] Migrazione applicata su Cloud SQL prod **prima** del push; CHANGELOG.

---

## 6.4 — Disponibilità, reset ai confini di servizio e `disponibilita.json`

**Stato**: 🔲 da fare

**Dipende da**: 6.0 (risorse GCP), 6.2 (campi), Fase 7.2 (confini di servizio, `arco-29`).

**Obiettivo**: il file `disponibilita.json` sul bucket, sempre allineato allo stato del CMS, e il reset di `soldOut` ai confini di servizio.

**Riferimenti**: `ADR-112` §§3 e 4, `ADR-108` §§3 e 5, `ADR-105` (secret condiviso), `docs/operativo/gcp-menu-scheduler.md` (6.0).

**Generazione del file** (schema esatto di `ADR-112` §3): ogni gruppo (`dishes`, `wines`, `drinks`, `spirits`, `fixedMenus`, `services`) elenca **tutte** le voci con lo stato corrente: `available`, `soldOut` (solo piatti) o `hidden` (`disabled`). Chiavi: gli identificativi numerici di Payload come stringhe. `updatedAt` in UTC; `schemaVersion: 1`. `globalMessage` dal Global «Generali», con `it` ed `en`, **assente** se non c'è un messaggio.

**Scrittura**: un solo oggetto sul bucket, con `Cache-Control: public, max-age=60` e tipo `application/json`, impostati **a ogni scrittura** (non c'è un default utile). Dipendenza proposta: la libreria ufficiale di Cloud Storage per Node.

**Quando si riscrive**:
- a ogni salvataggio di una voce che cambia `disabled` o `soldOut`, di una voce nuova o eliminata, o del `globalMessage` (hook `afterChange` e `afterDelete`): il file deve seguire il manager in tempo breve;
- a ogni reset ai confini di servizio.

**Reset ai confini di servizio**: un endpoint custom, protetto dal secret condiviso (intestazione, confronto a tempo costante), **idempotente**, che azzera `soldOut` e riscrive il file. Un secret errato o assente è rifiutato senza dettagli. L'esito va nel registro attività (`payload-pattern/03-log-azioni.mdc`), come azione di sistema.

**Decisioni da prendere all'inizio di 6.4**:
1. **Che cosa significa «confine»**: reset **a fine servizio** (il piatto torna disponibile e il manager può già prepararsi) oppure **a inizio del successivo** (come dice `riepilogo-sessione-requisiti-architettura-menu-digitale.md` §2.6). Cambia anche chi marca «terminato» prima dell'apertura.
2. **Orari fissi o job frequente**: i job hanno un orario fisso, ma i confini li può cambiare il manager (dall'App, 8.5). Soluzione candidata: un job a intervalli brevi il cui endpoint decide da solo se un confine è passato, in modo da tollerare job saltati e cambi di orario. Il **numero di job e il listino di Cloud Scheduler** si verificano prima di decidere (il costo è un vincolo del cliente).
3. **Nomi delle variabili d'ambiente** del CMS (bucket e secret): `ADR-112` §6 le rimanda a questa sottofase.

**Orari**: i confini si leggono da `impostazioni-sistema` (testo `HH:mm` in ora locale) e si confrontano con l'ora **Europe/Rome** (con le API di internazionalizzazione di Node, senza dipendenze nuove). Giorni di riposo e chiusure annuali si valutano allo stesso modo.

**Sviluppo locale**: se la variabile del bucket non è impostata la scrittura si salta con un avviso nel log. La verifica reale si fa su un bucket di sviluppo (`gcloud auth application-default login`) oppure in produzione.

**Verifiche tecniche**: il file generato è valido rispetto allo schema; intestazioni `Cache-Control` e CORS lette da un browser sul dominio di prova; reset ripetuto due volte con lo stesso effetto; secret errato rifiutato; una modifica di `disabled` si vede nel file entro pochi secondi; creazione del job in sviluppo o in produzione a cura dell'umano.

**Checklist di chiusura sottofase**:
- [ ] Le tre decisioni sopra prese e annotate qui.
- [ ] File conforme a `ADR-112` §3; gruppi completi; `globalMessage` assente se vuoto.
- [ ] Riscrittura su ogni cambio di stato; reset idempotente e protetto.
- [ ] Job creato in Cloud Scheduler con il secret nell'intestazione; esecuzione di prova riuscita.
- [ ] Variabili d'ambiente documentate (sotto) e montate su Cloud Run; secret in Secret Manager.
- [ ] Voci nel registro attività; CHANGELOG.

---

## 6.6 — Backoffice «Menù» nell'App

**Stato**: 🔲 da fare

**Dipende da**: Fase 8 (8.2 shell e navigazione, 8.3 guardia di accesso; `arco-30`), 6.2 (`arco-15`) e 6.4 (i cambi di stato riscrivono il file).

**Obiettivo**: la sezione `/app/menu` in cui il manager gestisce il menù, **mobile-first**, con shadcn/ui.

**Riferimenti**: `ADR-113` §3, `ADR-108` §§9 e 10 e secondo emendamento, `fase-8-shell-app.md` (shell e componenti).

**Contenuto**:
- **Elenchi** di piatti, vini, distillati, bevande, servizi, menu fissi e giorni speciali, con ricerca e filtro per categoria o tipologia, e per «disabilitati».
- **Azioni rapide dall'elenco**: «terminato» per i piatti (`soldOut`) e abilita/disabilita per ogni voce. Sono l'operatività quotidiana: un tocco, risultato immediato (e file riscritto, 6.4).
- **Moduli di creazione e modifica** con scelta della lingua per i campi `localized` (italiano predefinito, inglese facoltativo, ripiego sull'italiano se manca). Le tassonomie sono **a sola scelta**: nessun pulsante per crearle. Per Paesi e regioni il menu a tendina elenca solo i valori con `enabled` vero, **filtrati nella query, non solo nascosti nell'interfaccia**.
- **Composizione dei menu fissi**: scelta dei piatti, ordine, `portion`, `visibility`, servizi collegati.
- **Messaggio globale**: modifica di `globalMessage` nelle due lingue.
- **Pulsante «Ricompila il menù pubblico»** (6.5), con una nota su che cosa lo richiede: voci nuove, modifiche ai contenuti, ai servizi, agli orari, alle chiusure e ai giorni speciali.
- **Nessuna cancellazione**: si disabilita. Un filtro «senza allergeni dichiarati» aiuta la revisione di 6.8; **non è una validazione**.

**Vincoli**:
- Legge e scrive con la Local API **con la sessione dell'utente** (`overrideAccess: false`), così valgono i permessi di 6.2.
- Messaggi di errore in italiano; target di tocco adatti al telefono; conferma del salvataggio.
- **Fuori perimetro**: la validazione allergeni/flag (`ADR-108` §10) e il frontend pubblico.

**Checklist di chiusura sottofase**:
- [ ] Prova per ruolo: il manager crea, modifica e disabilita; non può cancellare né creare tassonomie; l'admin pure; un utente senza ruolo è rifiutato.
- [ ] «Terminato» e «disabilita» da telefono: il file di disponibilità cambia entro pochi secondi.
- [ ] Un menu fisso composto con `portion`, ordine e `visibility`; i due menu con «2 Nem» (revisione di 6.8) usano il piatto base.
- [ ] Menu a tendina di Paesi e regioni filtrati nella query.
- [ ] CHANGELOG.

---

## 6.5 — Rebuild manuale del menù (Cloud Build)

**Stato**: 🔲 da fare

**Dipende da**: 6.4 (`arco-18`), 6.0 e 6.6 (il pulsante sta nella sezione Menù).

**Obiettivo**: il pulsante «Ricompila il menù pubblico» nell'App, che avvia una build dell'app del menù e la pubblica su Firebase Hosting. È lo strumento di pubblicazione di tutto ciò che non passa dal file di disponibilità.

**Riferimenti**: `ADR-105` (meccanismo di rebuild verificato e note di chiarimento), `ADR-112` §5, `riepilogo-sessione-bucket-d.md` §2.

**Meccanismo**: trigger Cloud Build **manuale** nel progetto GCP `vma-vd`, collegato al repository del **progetto menù** (nome da definire; non il prototipo); un endpoint custom di Payload invoca l'API `triggers.run`; lo step di build usa l'immagine `us-docker.pkg.dev/firebase-cli/us/firebase` ed esegue `firebase deploy --project <ID> --only hosting`. Feedback «avviata» con l'id della build nel registro attività; la conferma dell'esito (Pub/Sub sul cambio di stato) **non è in questa sottofase**.

**Parte A — nel CMS** (eseguibile con uno step di prova che non fa deploy):
- Endpoint, ruolo `appRole: manager` o admin (`canAccessSection(user, 'menu')`); un secondo avvio ravvicinato viene ignorato con un messaggio.
- Pulsante nella sezione Menù (6.6) con conferma: spiega che la pubblicazione richiede alcuni minuti.
- IAM: al runtime SA `roles/cloudbuild.builds.editor`; `roles/iam.serviceAccountUser` sul service account della build, che è **dedicato** (proposta: `vma-vd-menu-build@vma-vd.iam.gserviceaccount.com`), per minimo privilegio.
- Prova con un trigger manuale separato, con configurazione inline che stampa un messaggio e non fa deploy: verifica endpoint, permessi, avvio e id nel registro attività.

**Parte B — con il Firebase nuovo** (`po-07`): si prova tutto sul progetto Firebase che ospiterà il frontend, con un'**app Next minimale di prova**. Si costruisce **fuori da questo repository** (repository del progetto menù, nome da definire); questa fase ne dà la specifica:
- pagina SSG con l'**ora della build**;
- **lettura del CMS a build-time** (`MENU_CMS_URL`, `locale` esplicito): per esempio il numero dei piatti e il nome del primo, in italiano e in inglese;
- **lettura di `disponibilita.json` dal browser** (`NEXT_PUBLIC_MENU_AVAILABILITY_URL`): `updatedAt`, stato di un piatto e, in caso di errore, un messaggio esplicito (CORS, rete); in prova rilegge ogni 30 secondi invece che ogni 5 minuti.
- Permessi del service account della build sul progetto Firebase, **scritti per il caso incrociato** (build in `vma-vd`, deploy su un altro progetto): `roles/firebasehosting.admin` e quanto richiede la guida ufficiale «Deploy to Firebase» di Cloud Build. **Da verificare nella prova.**

**Sequenza di prova**: (1) pulsante → build avviata, id nel registro; (2) la pagina cambia l'ora; (3) rinomina un piatto → rebuild → il nome compare; (4) «terminato» su un piatto → entro circa un minuto il browser mostra il nuovo stato, senza rebuild; (5) messaggio globale modificato → compare.

**Documentazione**: nuovo `docs/operativo/menu-rebuild-cloud-build.md` (trigger, service account, ruoli, regione del trigger, comandi). Nessun segreto.

**Checklist di chiusura sottofase**:
- [ ] Parte A: pulsante, endpoint e permessi; build di prova avviata dal CMS.
- [ ] Parte B: deploy riuscito sul Firebase nuovo; i cinque passaggi della sequenza verificati.
- [ ] Un utente senza ruolo non può invocare l'endpoint.
- [ ] `docs/operativo/menu-rebuild-cloud-build.md` scritto.
- [ ] Nome del repository del progetto menù e ID del progetto Firebase riportati in `ADR-105` (nota) e in `piano.yaml`.
- [ ] CHANGELOG.

---

## 6.7 — Frontend pubblico del menù (fuori perimetro)

**Stato**: ➖ fuori perimetro (confermato il 2026-10-03)

Sviluppato in un altro progetto (app Firebase del menù). Questo piano fornisce **le letture REST e `disponibilita.json` secondo `ADR-112`**, il pulsante di rebuild e i dati importati. L'app Next minimale di 6.5 Parte B è un banco di prova usa e getta: **non è** il frontend.

---

## Variabili d'ambiente introdotte dalla Fase 6

| Variabile | Dove | Uso | Sottofase |
|---|---|---|---|
| `SCHEDULER_SECRET` | Cloud Run (da Secret Manager, `scheduler-shared-secret`) | secret condiviso degli endpoint chiamati da Cloud Scheduler | 6.0, usata in 6.4 e 5.3 |
| variabile del bucket | Cloud Run | nome del bucket di `disponibilita.json` (nome da fissare in 6.4) | 6.4 |
| `MENU_CMS_URL`, `NEXT_PUBLIC_MENU_AVAILABILITY_URL` | app del menù (non questo repo) | `ADR-112` §6; usate dall'app di prova di 6.5 | 6.5 |

Un nome per variabile, nessun alias.

## Decisioni prese alla validazione (2026-10-04)

1. **Tipologie di vino e di bevanda**: due tassonomie (`wine-types`, `drink-types`), gestite dall'admin, obbligatorie su vini e bevande, nate vuote e popolate dall'import (terzo emendamento ad `ADR-108`).
2. **Birra**: nessuna collection; è una bevanda con tipologia «Birre», con `abv`, `volume` e `allergens` facoltativi sulle bevande. Sostituisce il §6 di `ADR-108`.
3. **`soloMenuFissi`**: non si porta. Le sole due voci con quel flag nello snapshot sono le varianti «2 Nem», che non si importano (decisione sulle varianti del 2026-09-12, `ADR-108` §4). Se un giorno un piatto fosse solo di un menu fisso, si aggiunge una checkbox con una migrazione.
4. **Global «Generali»**: un solo campo, `globalMessage`.
5. **Nomi**: slug e campi in inglese (come `ADR-112`), con `winery` e `volume`; si congelano alla chiusura di 6.2.

## Incoerenze note e punti aperti

- **Valori di tipologia da verificare sullo snapshot** (vino e distillato vengono dalla documentazione del prototipo). «Vietnamite» è una tipologia di bevanda per origine e si sovrappone a «Calde» e «Fredde»: l'import la porta com'è (una tipologia per bevanda); da rivedere con il ristorante dopo l'import.
- **`descrizione` degli allergeni**: `ADR-108` §3 la elenca tra i campi del piatto, ma nel vecchio schema è un campo dell'allergene. Qui è `allergens.description`, facoltativo.
- **Categorie dei menu fissi, giorni speciali e servizi** sono assegnati al manager (come «Menù (CRUD)» di `ADR-108` §9): assunzione, non scritta in `ADR-108`.
- **`sigla` di `Nazione`** non si porta (non è nel modello di `ADR-108`). Se serve al frontend, si aggiunge prima del congelamento.
- **Allergeni sui vini** (solfiti): non previsti; `ADR-108` li cita solo per i piatti e per le birre. Non si decide qui.
- **Non verificati**: contenuto dello snapshot; permessi minimi esatti su GCS e Firebase (verifica nelle prove di 6.0 e 6.5); regione del trigger Cloud Build; listino di Cloud Scheduler; comportamento di `admin.hidden` per ruolo a runtime.
