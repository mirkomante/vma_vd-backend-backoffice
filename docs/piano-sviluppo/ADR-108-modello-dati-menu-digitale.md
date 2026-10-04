# ADR — Modello dati del menù digitale

> Template minimo. Uno per ogni **arco di decisione** del DAG di progetto (`docs/piano-sviluppo/piano.yaml`) — passo standard, non facoltativo (vedi `00-come-eseguire-il-piano.md`, Passo 0). Vale anche per una scelta che resta dentro gli invarianti standard (`auth/`, `email/`, `stack/`), purché condizioni comunque più fasi a valle.

**Stato**: accettata
**Data**: 2026-09-13
**Arco di decisione**: Fase 6.1 (`arco-14` di `piano.yaml` — tassonomie: Categoria piatto, Allergeni, geografia vini a 4 livelli Paese/Regione/Denominazione/Classificazione, Tipologia distillato; criterio manager/admin campo-per-campo) → Fase 6.2 (Collection "Piatti"/"Vini"/"Birra", relazione `menu_fisso_piatto`, Collection "Giorni Speciali" di Fase 6.3) e Fase 6.6 (`arco-15` — il piatto come record unico con il campo `porzione` di competenza manager → Backoffice `(app)` menù). **Dominio indipendente**: a differenza degli ADR precedenti, questo non ha nessuna dipendenza reale da altri ADR della sequenza — separato sia dal dominio CMS siti esterni (ADR #1–#5) sia dal dominio prenotazioni (ADR #6–#7). Nessuno stato/schema/decisione pregressa è riusato come vincolo qui.

## Contesto

Tre sessioni distinte, tutte già chiuse, hanno prodotto decisioni che condizionano insieme lo schema dati completo del menù digitale — nessuna delle tre è sufficiente da sola a fissare fase-6.2 (Collection principali) e fase-6.6 (Backoffice manager):

- `riepilogo-sessione-requisiti-architettura-menu-digitale.md` §2.1/§2.2/§2.5/§2.6/§2.7/§3/§5 — requisiti funzionali: Giorni Speciali, campo `visibility`, validazione allergeni/flag, disponibilità piatti/vini, completezza carta vini;
- `riepilogo-sessione-varianti-porzione-piatto.md` §2/§3/§4/§5 — il piatto come record unico, campo `porzione` su `menu_fisso_piatto`;
- `riepilogo-sessione-criterio-manager-admin-menu.md` §1/§2/§3/§4/§5 — criterio manager/admin campo per campo, geografia vini a 4 tassonomie, nuove Collection tassonomiche.

Il principio guida trasversale a tutte e tre (§1 del riepilogo requisiti) è: **operatività quotidiana → app manager `(app)`**, semplice e senza gestione di tassonomie; **configurazione strutturale/tassonomica → Payload Admin, solo admin**. Questo ADR applica quel principio allo schema completo e chiude, in un unico documento, tutti i punti che le tre sessioni avevano esplicitamente rimandato a un "ADR — Modello dati del menù digitale".

## Decisione

### 1. Collection "Giorni Speciali"

| Campo | Tipo Payload | Obbligatorio | Note |
|---|---|---|---|
| `data` | `date` (dayOnly) | sì | |
| `ambito` | `select` (giornata / pranzo / cena) | sì | determina quale/i servizio/i della data sono sostituiti |
| `contenuto` | da definire in implementazione | sì | **sostituzione totale** e autosufficiente dell'offerta normale (à la carte + menu fissi) per l'ambito coperto — non un'aggiunta, non un'estensione del menù normale |

**Vincoli confermati**: pianificabile in anticipo, non un toggle attivabile al momento — modellato come Collection (record multipli, ciascuno con la propria data) e non come Global a singolo valore. Il servizio **non coperto** dall'`ambito` scelto (es. solo `pranzo` impostato per quella data) segue il menù normale, senza intervento del meccanismo "Giorni Speciali". Nessun meccanismo esistente (backend attuale o prototipo Next) copre questo requisito: schema nuovo. **Struttura interna del campo `contenuto`** non ulteriormente specificata dalle sessioni sorgente — resta un dettaglio implementativo da fissare in fase-6.3 (§ Conseguenze), non blocca l'impianto architetturale qui deciso (Collection dedicata, sostituzione totale per ambito).

### 2. Campo `visibility` su Menu Fissi e Categoria Menu Fisso

| Campo | Tipo Payload | Obbligatorio | Note |
|---|---|---|---|
| `visibility` | `select` (`always` / `lunch_only` / `dinner_only`) | sì | applicato sia a Menu Fissi sia a Categoria Menu Fisso |

Pattern già validato dal prototipo `vtn-menu-ristorante-next` (Degustazione = `always`, Business lunch = `dinner_only`/`lunch_only` a seconda del caso) — adottato così com'è, non reinventato.

### 3. Collection "Piatti"

Campi già confermati sufficienti, nessuna aggiunta salvo quanto segue:

| Campo | Tipo Payload | Obbligatorio | Note |
|---|---|---|---|
| `noUovo` | `checkbox` | — | mantenuto anche se oggi non genera badge in UI |
| descrizione allergeni (testo libero) | `textarea` | no | valutare in implementazione la rimozione, tranne dove porta informazione normativa (es. Solfiti) — non deciso qui, solo segnalato |
| `terminato-per-servizio` | `checkbox` | — | temporaneo, reset automatico via Cloud Scheduler ai confini di servizio (§4.4 del riepilogo requisiti) |
| `disabilitato` | `checkbox` | — | indefinito, già esistente come `inLista` |

**Foto escluse per decisione deliberata** (nessun campo immagine sulla Collection). **Nessun concetto di "variante"** sul piatto: il piatto resta un record unico — vedi §4. I due stati di disponibilità sono **distinti e non sovrapponibili concettualmente**: `terminato-per-servizio` indica un esaurimento temporaneo dello stesso piatto identico, `disabilitato` un'assenza a tempo indefinito dalla carta.

### 4. Relazione `menu_fisso_piatto` — campo `porzione`

| Campo | Tipo Payload | Obbligatorio | Note |
|---|---|---|---|
| `porzione` | `text` | no | facoltativo — valorizzato solo quando la quantità inclusa nel menu fisso differisce dalla porzione standard à la carte (es. "2 pezzi"); di competenza **manager** |

Nessuna modifica alla Collection "Piatti" per gestire le varianti: tutte le varianti note (es. "Nem di carne" / "2 Nem di carne") servono solo a comporre menu fissi, nessuna è ordinabile a sé stante con prezzo proprio — la quantità/porzione è quindi un attributo della relazione piatto↔menu fisso, non un'entità propria del piatto. Disponibilità risolta per costruzione: un solo piatto → un solo stato `terminato-per-servizio`/`disabilitato`, a prescindere da quante porzioni ne vengono servite in un menu fisso. Percorso additivo preservato: se in futuro una porzione dovesse diventare realmente ordinabile a sé stante, va promossa a piatto autonomo — cambiamento additivo, non un ripensamento di questo schema.

### 5. Collection "Vini" — geografia a quattro tassonomie

La carta vini resta **completa di tutte le informazioni** mostrate al cliente: nessuna semplificazione del dato. La semplificazione va cercata solo nell'esperienza di compilazione lato manager (es. campo geografico mostrato solo quando pertinente), non nella ricchezza dei campi.

```
Paese (flag abilitato, condiviso con alcolici/distillati)
 ├─ Regione (relazione a Paese, flag abilitato)
 │    └─ Denominazione (relazione a Regione, ex-"Zona", no abilitato)
 └─ Classificazione (relazione a Paese, no abilitato — asse concettualmente
      distinto da Regione/Denominazione: non "dove", ma "con quali regole")
```

Nuove Collection tassonomiche:

| Collection | Relazione | Campo `abilitato` | Note |
|---|---|---|---|
| Paese | — (radice) | Sì | condivisa vini/alcolici-distillati; precedente originario del pattern |
| Regione | → Paese | Sì | lista mondiale enorme vs. uso reale ristretto, stesso pattern di Paese |
| Denominazione | → Regione | No | solo 3 valori reali oggi, no rumore da nascondere |
| Classificazione | → Paese | No | 6 valori normativi e stabili |

**Seed iniziale** (dati reali derivati da menu.vietnamonamour.com/vini, tutti `abilitato: true` dove applicabile):

| Tassonomia | Valori |
|---|---|
| Paese | Italia, Francia |
| Regione | Piemonte, Campania, Friuli Venezia Giulia, Trentino Alto Adige, Umbria, Lombardia, Marche, Sardegna, Veneto, Toscana, Puglia (IT) — Borgogna, Alsazia, Loira, Rodano (FR) |
| Denominazione | Carso (→FVG), Collio (→FVG), Franciacorta (→Lombardia) |
| Classificazione | D.O.C.G., D.O.C., I.G.T., D.O.P. (→Italia) — A.O.C., A.O.P. (→Francia) |

**Disponibilità vini**: resta la sola disponibilità binaria già esistente (`disponibile`/non disponibile) — nessuna estensione dello stato `terminato` (vedi Alternative considerate).

### 6. Collection "Birra"

| Campo | Tipo Payload | Obbligatorio | Note |
|---|---|---|---|
| `nome` | `text` | sì | |
| `birrificio` | `text` | no | |
| `tipologia` | `text` o `select` a valori fissi | no | nessuna Collection tassonomica dedicata — vedi §8, Collection Birra vestigiale |
| `formato-prezzo` | campi prezzo/formato analoghi a Vini | sì | |
| `allergeni` | relazione `hasMany` a "Allergeni" | no | tassonomia condivisa con Piatti |
| `disponibile` | `checkbox` | — | stato binario, stesso modello dei Vini — non `terminato`/`disabilitato` dei Piatti |

Collocata in sezione "Bevande" tramite le Sezioni Virtuali/query builder già validate nel prototipo, senza bisogno di nuova tassonomia di routing.

### 7. Cocktail — nessuna Collection in questa fase

Non più prodotti dal ristorante: nessuna Collection creata ora. Percorso esplicitamente additivo per una futura reintroduzione, se necessaria: nuova Collection + estensione del tipo unione `MenuItem` nel frontend Next.js, che oggi non lo include.

### 8. Tassonomie generiche

| Tassonomia | Gestione | Campo `abilitato` | Note |
|---|---|---|---|
| Categoria piatto | Admin (CRUD) | No | lista stabile, poche voci |
| Tipologia distillato | Admin (CRUD) | No | 7 valori, stesso trattamento di Categoria piatto |
| Allergeni | Admin (CRUD libero) | No — sempre abilitati | seed 14 normativi UE, condivisa piatti/bevande, mai nascosti al manager |
| Tipologia birra | — | — | non necessaria: Collection Birra vestigiale, pochi elementi, campo diretto (§6) invece di tassonomia propria |

### 9. Criterio manager/admin — principio e tabella campo per campo

**Principio applicato**: operatività quotidiana (CRUD completo su piatti/vini/bevande/distillati/menù, purché si scelga tra valori tassonomici già esistenti) → **manager**; configurazione strutturale/tassonomica (creazione di nuove voci di tassonomia) → **admin**. Cancellazione **sempre soft-delete**: nessuna entità gestita dal manager viene mai eliminata fisicamente — si usa lo stato "disabilitato", esteso dal pattern di disponibilità piatti a tutte le entità gestibili dal manager.

| Entità/Tassonomia | Gestione | Campo `abilitato` | Note |
|---|---|---|---|
| Piatti, Vini, Bevande, Distillati, Menù (CRUD) | Manager | — | cancellazione = soft-delete (disabilita, non elimina) |
| Categoria piatto | Admin (CRUD) | No | lista stabile, poche voci |
| Tipologia birra | — | — | non necessaria (§8) |
| Tipologia distillato | Admin (CRUD) | No | 7 valori |
| Allergeni | Admin (CRUD libero) | No — sempre abilitati | seed 14 normativi UE |
| Paese | Admin | Sì | condiviso vini/alcolici-distillati |
| Regione | Admin | Sì | relazione a Paese |
| Denominazione | Admin (CRUD) | No | relazione a Regione |
| Classificazione | Admin (CRUD) | No | relazione a Paese |
| `porzione` su `menu_fisso_piatto` | **Manager** | — | comporre/modificare un menù fisso è operatività quotidiana, non configurazione rara |

Questa tabella è il riferimento diretto per i permessi granulari da applicare come access control nativo Payload (stesso meccanismo già convenzionato in `ADR-102-divisione-area-di-gestione.md`, qui solo riapplicato al dominio menù — non è una dipendenza reale, è lo stesso pattern di catalogo/progetto già in uso).

### 10. Nota sulla validazione allergeni/flag di consumo

Confermato il principio: **avviso non bloccante**, non hard-validation, per casi come l'incompatibilità tra allergene "Uova" e flag "vegan"/"no uovo" attivo. Il meccanismo di implementazione (dove e con quale grado interviene l'avviso) resta **esplicitamente un punto aperto non bloccante** per questo ADR — non va progettato qui.

## Alternative considerate

- **Array `varianti` annidato sul piatto, o Collection dedicata alle varianti** — scartato: nessuna variante nota ha mai un prezzo proprio pagabile in autonomia dal cliente; la premessa che giustificherebbe un'entità propria non si verifica in nessun caso reale.
- **Estendere lo stato "terminato" ai vini** — scartato in questa fase: i vini restano sulla sola disponibilità binaria già esistente; il filtro lato frontend per questo caso non è mai stato implementato nel prototipo di riferimento e resta debito tecnico non ripreso ora.
- **Nazioni mai usate (Germania, Irlanda, Spagna) rimosse o mantenute senza distinzione** — scartato: gestite con un flag `abilitato` sulla tassonomia Paese, condiviso vini/alcolici-distillati, con dropdown manager filtrato lato API (`where: abilitato = true`).
- **Porzione di competenza admin** (ipotesi iniziale) — corretta: resta **manager**, comporre/modificare un menù fisso è operatività quotidiana già confermata, non configurazione rara.

## Conseguenze

- **Fase 6.1** eredita le quattro tassonomie generiche (§8) e le Collection geografiche a 4 livelli (§5), col seed iniziale già pronto per il popolamento.
- **Fase 6.2** eredita lo schema completo di "Piatti" (§3), "Vini" (§5), "Birra" (§6) e la relazione `menu_fisso_piatto` col campo `porzione` (§4) — nessun concetto di variante da modellare.
- **Fase 6.3** eredita l'impianto della Collection "Giorni Speciali" (§1: data, ambito, sostituzione totale per l'ambito coperto); la struttura interna del campo `contenuto` resta un dettaglio implementativo da chiudere in quella sottofase, non deciso qui.
- **Fase 6.4** (disponibilità + Cloud Scheduler + `disponibilita.json`) eredita i due stati distinti di disponibilità piatti (`terminato-per-servizio`/`disabilitato`, §3) e lo stato binario di vini/birra (§5/§6) come campi da leggere/aggiornare.
- **Fase 6.6** (Backoffice `(app)` menù) eredita la tabella manager/admin campo-per-campo (§9) come riferimento diretto per i permessi granulari Payload, e il campo `porzione` come editabile dal manager nella composizione dei menu fissi.
- **Punto esplicitamente aperto e non bloccante**: il meccanismo di validazione allergeni/flag (§10) è deferito a un'implementazione successiva — non condiziona lo schema dati fissato in questo ADR.
- Restano punti aperti per il futuro, non trattati da questo ADR:
  - il formato del campo `porzione` (oggi testo libero) — da rivalutare solo se servisse un giorno un formato strutturato (numero + unità) per statistiche o badge UI;
  - la valutazione puntuale su quali descrizioni libere di allergeni rimuovere, oltre ai casi con valore normativo (es. Solfiti);
  - la struttura interna definitiva del campo `contenuto` su "Giorni Speciali";
  - la riconciliazione della fonte unica orari/chiusure tra il Global "Generali" del menù e "Impostazioni prenotazioni" — resta materia dell'**ADR — Global di configurazione trasversale (`impostazioni-sistema`)**, bloccato fino alla sessione dedicata alla struttura a tab.

## Emendamento (2026-10-04) — Servizi, seed esteso e import dei dati esistenti (po-05)

**Stato dell'emendamento**: proposta — diventa `accettata` solo con il passaggio esplicito dell'umano. Lo stato `accettata` dell'ADR nel suo insieme non cambia.

Aggiunge la Collection «Servizi», sostituisce la tabella del seed iniziale del §5 e fissa i criteri dell'import dei dati esistenti. Il resto dell'ADR resta invariato.

### Verifiche su cui poggia

- **Snapshot dell'API v1 di `vtn-backend`** (produzione, 2026-10-04, letto da file JSON): 44 piatti (3 nascosti), 8 menu fissi, 90 vini (13 nascosti), 38 distillati (6 nascosti), 13 bevande, 1 birra, 2 cocktail, 3 servizi, 14 allergeni.
- **Frontend attuale** (`vietnamonamour-nodejs`, ramo `vtn-backend-api-data`): mostra i servizi nel footer di tutte le pagine (`GET /api/v1/servizi`); le pagine di San Valentino sono menu fissi con ID in configurazione, senza data né sostituzione dell'offerta.
- **Il seed del §5** era ricavato dal sito pubblico e quindi non vede le voci nascoste.

### Decisione

1. **Collection «Servizi»** (coperto, diritto di dolce, diritto di tappo). Campi: nome, prezzo, `disabilitato` (checkbox). Collegabile ai menu fissi con una relazione `hasMany` facoltativa sul menu fisso (oggi due business lunch hanno il «Coperto»). Operatività quotidiana, quindi **manager**, con cancellazione soft come le altre entità del menù. I servizi si mostrano in fondo alle pagine del menù, e l'esposizione fa parte del contratto `ADR-112`. Slug e nomi dei campi (inglese) nel file di fase.
2. **Seed esteso**, che sostituisce la tabella del §5. Il seed contiene i valori **usati dai record importati**, non l'intero vocabolario del vecchio sistema:

   | Tassonomia | Valori |
   |---|---|
   | Paese (13, di cui 12 abilitati) | Filippine, Francia, Giappone, Guatemala, Guyana, Italia, Libano, Martinica, Scozia, Thailandia, Trinidad e Tobago, Venezuela, Vietnam |
   | Regione (16, di cui 15 abilitate) | le 15 del §5 più Sicilia |
   | Denominazione (3) | Carso, Collio, Franciacorta (Valdobbiadene esiste nel vecchio sistema ma non è usata: non si crea) |
   | Classificazione (6) | invariata: D.O.C.G., D.O.C., I.G.T., D.O.P. (Italia); A.O.C., A.O.P. (Francia) |
   | Allergeni (14) | i 14 normativi, già coincidenti per nome con quelli del vecchio sistema |

   `abilitato` è **vero** per i valori usati da voci in carta oggi (12 Paesi, 15 regioni), secondo il criterio già deciso per il seed («popolamento basato solo su dati reali oggi in carta», `riepilogo-sessione-criterio-manager-admin-menu.md`), ed è **falso** per Libano e Sicilia, usati solo da voci nascoste. Libano e Sicilia esistono perché le voci nascoste importate come `disabilitato` mantengano la loro geografia, ma il manager non li vede.
3. **Import dei dati esistenti.** Il nuovo menù è un'evoluzione del vecchio: l'import ne migliora i dati e non li copia alla lettera.
   - **Sorgente**: snapshot JSON dell'API v1, esportato il giorno dell'import con la procedura di `docs/operativo/export-menu-vtn-backend.md`. Non si legge l'API dal vivo.
   - **Voci nascoste** (`inLista` falso): importate come `disabilitato`.
   - **Solo dati elementari** (decisione del 2026-10-04): si importano piatti, vini, distillati, bevande, servizi e tassonomie. I **menu fissi non si importano**: si ricompongono a mano nel nuovo sistema, perché sono pochi (8, con 17 relazioni ai piatti) e la ricomposizione è più sicura dell'import di relazioni, varianti e `visibility`.
   - **Non importati**: i menu fissi e le loro categorie (si ricompongono a mano), Birre e Cocktail (non compaiono nel sito; i cocktail sono abbandonati) e i menu speciali, come San Valentino, che si ricreano in 6.3 con il meccanismo «Giorni Speciali».
   - **Varianti**: «2 Nem di carne» e «2 Nem vegetariani» esistono oggi solo dentro due menu fissi e non si importano: nella ricomposizione a mano i due menu useranno il piatto base con `porzione`.
   - **Categorie dei menu fissi**: non si importano, si ricreano a mano insieme ai menu (decisione del 2026-10-04), con `visibility`: Degustazione sempre, Business lunch solo pranzo (confermato il 2026-10-04).
   - **Normalizzazioni**: spazi ai bordi, `capacita` («75cl» e «75 cl»), `certificazione` verso la Classificazione («D.O.C» e «A.O.P» diventano «D.O.C.» e «A.O.P.»).
   - **Correzioni a mano nella revisione**: una descrizione corrotta (`Brut••75cl••COTEAUX DU LAYON•LOIRA`) e una che ripete la regione.
   - **Scrittura**: Local API, locale `it`, idempotente per chiave naturale. Prima un report a secco, poi una prova in sviluppo, poi la produzione da locale, come il seed del super-admin (`fase-3-deploy.md` § 3.4).
   - **Revisione nell'App prima del lancio**: ricomposizione delle 2 categorie e dei menu fissi (3 Degustazione e 5 Business lunch) con `visibility`, `porzione` e collegamento ai Servizi (oggi il «Coperto» è collegato a due business lunch), traduzioni se `po-09` le richiede, e i **9 piatti su 44 senza allergeni dichiarati**, da rileggere dal ristorante.

### Alternative considerate

- **Reinserimento manuale** — scartata: circa 200 voci in buona forma; si ridigiterebbero gli allergeni (dato di legge) e i prezzi.
- **Importare anche i menu fissi** — scartata (2026-10-04): sono 8 e la composizione a mano è più sicura, oltre a essere una prova del flusso di composizione nel nuovo sistema.
- **Import dall'API dal vivo** — scartata: dipende dal vecchio sistema e non è ripetibile né rivedibile.
- **Scraping del sito pubblico** — scartata: perde ID, campi e voci nascoste.
- **Servizi come elenco nel Global «Generali» o fuori dal modello** — scartate: la prima perde il legame con i menu fissi, la seconda rende ogni cambio di prezzo una modifica di codice.

### Conseguenze

- **Fase 6.2** scaffolda anche «Servizi»; la nuova **fase 6.8** esegue l'import dopo la 6.2 (`arco-39`); la **6.3** riceve la nota su San Valentino.
- **`ADR-112`** deve includere i servizi nelle letture pubbliche.
- **`po-09`**: se il menù è bilingue, l'import scrive in italiano e le traduzioni restano manuali.
- Il file `fase-6-menu-digitale.md` riprende questi criteri.
