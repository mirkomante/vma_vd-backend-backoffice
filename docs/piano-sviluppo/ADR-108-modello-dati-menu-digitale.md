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
