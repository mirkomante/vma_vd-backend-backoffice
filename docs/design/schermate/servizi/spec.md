# Servizi, elenco e modulo — specifica di schermata (`/app/menu/services`, voce Servizi)

**Stato**: design chiuso il 2026-10-14, **scelte da confermare** (sezione 10). È la schermata più semplice del Menù: tre campi (nome localizzato, prezzo, disabilitato), elenco piatto senza gruppi, ricerca né filtri. Struttura e comportamenti sono quelli di `schermate/vini/spec.md` e `schermate/bevande/spec.md`; qui si dicono per intero testi e differenze.

**Si implementa in**: `fase-6` sottofase 6.6 (backoffice «Menù»; non ancora nel repo). Dipende da 8.2 (shell), 8.3 (guardia), 6.2 (collection `menu-services`), 6.4 (disponibilità), 6.5 (ricompilazione) e dalla Parte 0 di 6.6 (permessi di cancellazione e registro). Chi usa i servizi è la schermata dei menù fissi (da disegnare).

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1, D5, D6, D8, D9, D10, D13, D14), `fase-6-menu-digitale.md` §§6.2, 6.4, 6.5, 6.6, `ADR-108` (emendamento del 2026-10-04 sui Servizi; nota del 2026-10-13 sulle relazioni; emendamento del 2026-10-14), `ADR-113` (emendamento del 2026-10-14), `ADR-115` (nota del 2026-10-14).

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato) e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Telefono: `390-modulo-chiaro.png`, `390-modulo-inglese-aperto-chiaro.png`, `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png`, `390-disponibilita-chiaro.png`, `390-elimina-chiaro.png`, `390-elimina-senza-uso-chiaro.png`, `390-eliminato-chiaro.png`, `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png`, `390-errore-azione-chiaro.png`. Notebook: `1280-modulo-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo e accesso

Il manager (e admin e super-admin) vede i servizi (coperto, diritto di dolce, diritto di tappo: **3 nello snapshot**), li abilita e disabilita con un tocco, ne crea, modifica ed elimina, e può avviare la ricompilazione del menù pubblico. Funziona da telefono e da notebook.

- **Accesso**: `canAccessSection(user, 'menu')`. Non autenticato → `/app/login`. Sezione non consentita non raggiungibile nemmeno dall'URL.
- **Cancellazione** (D14): il manager elimina un servizio, con conferma. A differenza dei piatti, **un servizio usato dai menù fissi si può eliminare**: sparisce in silenzio da tutti i menù fissi che lo contengono (cascade, `ADR-108` nota del 2026-10-13: `fixed_menus_rels` → `menu_services`, `ON DELETE cascade`). Per questo la conferma lo dichiara prima di «Non si può annullare.». **Disabilitare** è l'interruttore, senza avvisi.
- **Nome omonimo**: `menu-services` non va confuso con `services` di `impostazioni-sistema` (gli orari di pranzo e cena): nel codice si distinguono (`menuServices`, `serviceHours`).
- **Fuori perimetro**: l'assegnazione dei servizi ai menù fissi (si fa nella schermata dei menù fissi); il pulsante «Ricompila il menù pubblico» è condiviso con le altre liste, e la sua posizione definitiva si decide con la schermata di integrazione.

## 2. Collegamento ai dati

Collection `menu-services` (`fase-6` §6.2), con la Local API **con la sessione dell'utente** (`overrideAccess: false`): il manager legge, crea, modifica e cancella (emendamento ad `ADR-113` del 2026-10-14); un utente senza ruolo non può nulla.

| Elemento | Campo | Note |
|---|---|---|
| Nome | `name` (**localizzato**) | Obbligatorio in italiano; l'inglese è facoltativo con ripiego sull'italiano (D10) |
| Traduzione inglese | `name`, locale `en` | Badge «Presente» se non vuoto, «Manca» altrimenti |
| Prezzo | `price` (numero) | Obbligatorio; mostrato e scritto con la virgola. Il modello non dice a chi si applica (per persona, per tavolo): l'App non lo suggerisce |
| Disabilitato | `disabled` | Assenza a tempo indefinito; l'interruttore «Disponibile» è il suo contrario |

**Interrogazioni**
- Elenco: tutti i servizi, disabilitati compresi, **ordinati per nome** (in italiano), nella richiesta (`sort`), non nel browser. Nessuna ricerca né filtro: sono tre voci.
- `limit=100`, come il contratto di `ADR-112`. Oltre 100 vale la regola degli altri elenchi (avviso «Mostrati 100 servizi su {totale}» con «Mostra altri servizi»): il caso non si verificherà in pratica e non si disegna, ma non si tronca in silenzio.
- **Prima di eliminare**: i menù fissi che contengono il servizio (`fixed-menus` con `services` uguale all'identificativo; nomi, al massimo tre, poi «e altri {N}»), letti con la sessione dell'utente. Non blocca: serve a dire dove sparirà.

**Operazioni**: abilita/disabilita (aggiorna `disabled`, effetto immediato); salva (crea o modifica); elimina (cancellazione fisica, D14, dopo conferma).

**Effetti sul menù pubblico**
- Abilita/disabilita riscrive `disponibilita.json` (6.4), entro pochi secondi, senza ricompilazione.
- Servizi nuovi e modifiche ai contenuti compaiono **dopo la ricompilazione** (6.5): l'avviso lo ricorda.
- **Eliminazione**: l'hook `afterDelete` riscrive il file di disponibilità; il servizio sparisce dai menù fissi subito e dal menù pubblico alla ricompilazione; ogni cancellazione lascia una riga nel registro attività (`eventType: delete`, `area: app`, collection, identificativo, nome e numero dei menù fissi che lo usavano, nessun dato personale; `ADR-115`, nota del 2026-10-14).

## 3. Albero blocchi → componenti → varianti

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| `topbar` | Pulsante del menu, briciola «Menù › Servizi» | `SidebarTrigger`, `Separator`, `Breadcrumb` |
| `intestazione-pagina` | Titolo, descrizione, due azioni | `Button (default, lg)` «Nuovo servizio» e `Button (outline, lg)` «Ricompila il menù pubblico» |
| `elenco` | Conteggio, poi tabella e schede | testo, vedi sotto |
| `elenco-tabella` (da 768 px) | Nome (con badge «Disabilitato» accanto), Prezzo, Disponibile, azioni | `Table` a colonne fisse, `Badge (outline)`, `Switch`, `Button (ghost, icon)` ×2: matita e cestino |
| `elenco-schede` (sotto 768 px) | Nome, prezzo, badge «Disabilitato», interruttore «Disponibile», matita, cestino | `Card (sm)`, `Badge (outline)`, `Switch`, `Button (ghost, icon)` ×2 |
| (stato) modulo | Nuovo servizio e modifica: nome, traduzione, prezzo, disabilitato | `Sheet`, `FieldGroup`, `Field`, `Input`, `Collapsible`, `Badge (outline)`, `Switch`, `FieldDescription`, `FieldError`, `Button (lg)` |
| (stato) elimina | Conferma «Eliminare {nome}?», con il cascade dichiarato | `AlertDialog`, `Button (destructive)`, `Button (outline)`, `Spinner` |
| (stato) ricompila | Conferma della ricompilazione (componente condiviso) | `AlertDialog`, `Button (default)`, `Spinner` |
| (stato) caricamento, avvisi | Tre blocchi; esiti ed errori | `Skeleton`, `Alert (default \| destructive)` |

## 4. Layout e regole responsive

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Colonna | Tutta la larghezza, margine 16 px | Centrata, larga al massimo `max-w-5xl`: a 1280 px è 976 px |
| Azioni di pagina | In colonna, «Nuovo servizio» per prima, poi «Ricompila il menù pubblico» | In riga, «Ricompila» a sinistra e «Nuovo servizio» a destra |
| Elenco | Schede: nome e prezzo a sinistra (misurato 172 px su 358 per il nome); a destra interruttore «Disponibile» con etichetta, matita, cestino | Tabella a **colonne fisse** (Prezzo 7 rem, Disponibile 7 rem, azioni 6 rem; il resto al nome) |
| Righe disabilitate | Attenuate, badge «Disabilitato»; l'interruttore resta attivo | Idem; il badge sta accanto al nome |
| Foglio del modulo | Dal basso, altezza massima 90 % con scorrimento; pulsanti agganciati in fondo, affiancati | Da destra; pulsanti agganciati in fondo, affiancati |
| Dimensioni dei controlli | Dispositivo touch (`pointer-coarse`): ≥ 44 px (D6) | Con mouse: misure standard di Nova |

Nessuno scorrimento orizzontale a 360, 390 e 1280 px.

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Elenco | Servizi in ordine per nome con il conteggio; righe disabilitate attenuate | `*-chiaro.png`, `*-scuro.png` |
| Abilita o disabilita | L'interruttore cambia, avviso «Servizio disabilitato» o «Servizio abilitato» | `390-disponibilita-chiaro.png` |
| Modulo | Nome, traduzione, prezzo, disabilitato | `390-modulo-chiaro.png`, `1280-modulo-chiaro.png` |
| Traduzione inglese aperta | Name con il suggerimento sul ripiego | `390-modulo-inglese-aperto-chiaro.png` |
| Nuovo servizio, errori | Modulo vuoto; messaggi sotto i campi | `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png` |
| Errore dell'azione | Avviso rosso nel foglio che l'ha avviata; nulla cambia | `390-errore-azione-chiaro.png` |
| Elimina, servizio usato | Conferma con «Verrà tolto anche da {N} menù fissi: {nomi}.» | `390-elimina-chiaro.png` |
| Elimina, servizio non usato | Conferma semplice, solo «Non si può annullare.» | `390-elimina-senza-uso-chiaro.png` |
| Servizio eliminato | La riga sparisce; avviso «Servizio eliminato» con il richiamo alla ricompilazione | `390-eliminato-chiaro.png` |
| Caricamento, errore di caricamento | Tre blocchi `Skeleton`; solo avviso rosso con «Riprova» | `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png` |
| Nessun servizio | Messaggio e «Nuovo servizio» | `390-vuoto-chiaro.png` |

La conferma di ricompilazione è quella di `schermate/piatti/`. Non ci sono gli stati «filtri», «nessun risultato» ed «elenco parziale»: la schermata non ha ricerca né filtri, e il limite non si raggiunge (sezione 2).

## 6. Testi

Tutti in italiano; `{…}` sono dinamici.

| Dove | Testo |
|---|---|
| Titolo | Servizi / Voci accessorie: coperto, diritto di dolce, diritto di tappo. / Nuovo servizio · Ricompila il menù pubblico |
| Elenco | «{1 servizio \| N servizi}» sopra le righe |
| Colonne | Nome, Prezzo, Disponibile, (Azioni, solo per lo screen reader) |
| Riga | Prezzo «{2,00} €»; badge «Disabilitato» accanto al nome sulle righe disabilitate |
| Stato | Nome accessibile dell'interruttore «Disponibile: {nome}»; etichetta visibile «Disponibile» su telefono |
| Azioni di riga | «Modifica {nome}» ed «Elimina {nome}» (nomi accessibili, nessun testo visibile) |
| Avvisi rapidi | Servizio abilitato · Servizio disabilitato / «Il menù pubblico si aggiorna entro pochi secondi.» |
| Avvisi di salvataggio | Servizio aggiunto · Servizio salvato / «Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».» |
| Elimina | «Eliminare {nome}?» / servizio usato: «Verrà tolto anche da {1 menù fisso \| N menù fissi}: {nomi}. Non si può annullare.» (al massimo tre nomi, poi «e altri {N}»); servizio non usato: «Non si può annullare.» / Indietro, Elimina. Esito: «Servizio eliminato» / «Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».» |
| Modulo, titolo | Nuovo servizio («Il servizio compare nel menù pubblico dopo la ricompilazione.») · Modifica servizio («{nome}») |
| Modulo, campi | Nome · «Traduzione inglese (facoltativa)» con «Manca» o «Presente», Name (segnaposto: il nome italiano; «Facoltativa. Se resta vuota, il menù mostra il testo italiano.») · Prezzo (€) · «Disabilitato» («Assente a tempo indefinito: il servizio non compare nel menù.») · Salva («Salvataggio…»), Annulla |
| Errori del modulo | Campo obbligatorio. (nome e prezzo) · Inserisci un prezzo valido (es. 2,50). |
| Errore dell'azione | Operazione non riuscita / Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore. |
| Errore di caricamento | Impossibile caricare i servizi / Riprova tra qualche istante; se il problema continua, avvisa l’amministratore. / Riprova |
| Vuoto | Nessun servizio. (+ «Nuovo servizio») |

**Singolare e plurale**: «1 servizio» al singolare, negli altri casi «N servizi».

## 7. Comportamenti

1. **Abilita e disabilita con un tocco**: l'interruttore «Disponibile» salva subito (D9), anche sulle righe disabilitate; se fallisce nulla cambia e compare l'errore. Nessun avviso se il servizio è usato dai menù fissi: è reversibile.
2. **Apertura del modulo** con la matita; il nome non è un collegamento e la scheda non è tappabile (D13). «Nuovo servizio» apre lo stesso modulo vuoto.
3. **Elimina**: il cestino legge i menù fissi che contengono il servizio e apre la conferma; se ce ne sono, la conferma dice dove verrà tolto. «Elimina» cancella, chiude la finestra, toglie la riga e mostra l'avviso. Se la cancellazione fallisce nulla cambia e compare l'errore imprevisto nella finestra. Mentre si elimina: pulsanti disabilitati, `Spinner`. Nessun testo suggerisce di disabilitare: l'interruttore è nella riga.
4. **Traduzione inglese** (D10): chiusa per default, si apre se esiste il nome inglese; il campo Name ha come segnaposto il nome italiano e, vuoto, il menù mostra l'italiano.
5. **Validazione**: nome (italiano) e prezzo obbligatori; prezzo numerico (virgola o punto, al massimo due decimali; zero è ammesso). Con errori: nessun salvataggio, messaggi sotto i campi, primo campo non valido in vista e con il focus.
6. **Salvataggio**: subito (D9), con `Spinner` e «Salvataggio…»; a buon fine il foglio si chiude e compare l'avviso che ricorda la ricompilazione; in errore l'avviso rosso resta nel foglio.
7. **Ordine**: per nome, senza distinzione tra maiuscole e minuscole e con le regole dell'italiano.
8. **Tema e tocco**: come D4 e D6.

## 8. Componenti da installare e da comporre

- **Da installare**: nessun componente oltre a quelli già richiesti da shell, Orari, Prenotazioni, Piatti e Vini.
- **Componenti di composizione** (`components/app/`, solo con componenti di `components/ui`): gli stessi di vini, distillati e bevande, senza gruppi, ricerca e filtri; modulo con il solo nome (traduzione compresa), prezzo e disabilitato; conferma di eliminazione con la riga sul cascade; pulsante «Ricompila» condiviso.
- **Eccezioni alla regola UI** (`ui-check-allow`): nessuna.
- **Logica pura in `lib/`** (con test): stato mostrato, ordine per nome, formato del prezzo con la virgola, testi con singolare e plurale, e il **testo della conferma di eliminazione** (elenco dei menù fissi con al massimo tre nomi e «e altri {N}»), riusabile per i menù fissi e i giorni speciali.

## 9. Checklist di accettazione

Si verifica con Playwright. Controlli comuni **C1–C10** di `modello-specifica-schermata.md`. Specifici:

1. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px in tutte le viste. *Misurato nel prototipo il 2026-10-14 in elenco, nuovo, modulo, conferma di eliminazione e ricompila: nessuno.*
2. **Aree di tocco** a 390 px con tocco simulato (C2): nessun elemento sotto 44 px in tutte le viste. *Misurato nel prototipo nelle stesse viste: nessuno.*
3. **Colonna e elenco**: a 1280 px la colonna è larga 976 px; tabella da 768 px, schede sotto. *Misurato nel prototipo.*
4. **Azioni di riga**: interruttore «Disponibile», matita e cestino a 44 px, con i nomi accessibili della sezione 6; il nome non è cliccabile; nessun menu «⋯».
5. **Abilita e disabilita**: un tocco cambia lo stato, compare l'avviso; `disponibilita.json` cambia entro pochi secondi (dopo la 6.4). L'interruttore è attivo anche sui servizi disabilitati.
6. **Ricompilazione**: come in Piatti.
7. **Modulo**: nome e prezzo obbligatori con i messaggi della sezione 6; il prezzo accetta «2», «2,5», «2,50» e «2.50» e rifiuta «abc» e «2,555». *Provato nel prototipo: un modulo vuoto dà due errori; «abc» e «2,555» sono rifiutati, «2», «2.50» e «2,5» accettati.*
8. **Lingue**: traduzione chiusa per default e aperta se esiste il nome inglese; badge coerente; con l'inglese vuoto una lettura `locale=en` ricade sull'italiano.
9. **Eliminazione**: per un servizio usato la conferma dice «Verrà tolto anche da {N} menù fissi: {nomi}.» con i nomi giusti (al massimo tre, poi «e altri N»); dopo l'eliminazione il servizio non è più nei menù fissi che lo contenevano (cascade verificato sul database); per un servizio non usato la conferma è semplice; compare «Servizio eliminato»; la riga di registro esiste (con il numero dei menù fissi); `disponibilita.json` non contiene più l'identificativo; consentita a manager (`appRole`), admin e super-admin, rifiutata a un utente senza ruolo. *Testi provati nel prototipo con tre servizi (due usati, uno no).*
10. **Persistenza e permessi**: nuovo e modifica si salvano con la sessione dell'utente (`overrideAccess: false`) e la rilettura dà gli stessi valori.
11. **Ordine**: per nome; l'ordine arriva dalla richiesta.
12. **Stati e testi**: come negli screenshot e nella sezione 6, singolare e plurale compresi.
13. **Temi, accesso, `pnpm ui:check`**: C3, C4 (`canAccessSection(user, 'menu')`), C9.
14. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro (C10).

## 10. Scelte, assunzioni e debiti

**Da confermare da Mirko** (il design le usa)
1. **Nessuna ricerca né filtro**, elenco piatto in ordine per nome: i servizi sono tre.
2. **La conferma dichiara il cascade** («Verrà tolto anche da {N} menù fissi: …»), come previsto da D14; l'eliminazione non è bloccata.
3. **Nessun avviso quando si disabilita** un servizio usato dai menù fissi (è reversibile).
4. **Un solo prezzo, «Prezzo (€)»**, senza dire se vale per persona o per tavolo (il modello non lo prevede); zero è ammesso.
5. **Nome tradotto in inglese** (D10), come negli altri contenuti con nome localizzato.
6. **Sottotitolo della pagina**: «Voci accessorie: coperto, diritto di dolce, diritto di tappo.», dalla descrizione della collection.
7. **Pulsante «Ricompila il menù pubblico»** in intestazione come nelle altre liste, in attesa della schermata di integrazione.

**Debiti futuri e punti aperti**
- **A chi si applica un servizio** (per persona, per tavolo): non modellato; se servirà, un campo nuovo con le sue regole.
- **Esito della ricompilazione**: come in Piatti, la schermata dice solo «avviata» (6.5).
- **Avvisi sui menù fissi senza servizio**: se un menù fisso resta senza il servizio eliminato, lo si vede nella schermata dei menù fissi (da disegnare).
