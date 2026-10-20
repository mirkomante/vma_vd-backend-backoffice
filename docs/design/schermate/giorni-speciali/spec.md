# Giorni speciali, elenco e modulo — specifica di schermata (`/app/menu/special-days`, voce Giorni speciali)

**Stato**: design chiuso il 2026-10-15 con le risposte di Mirko alle sei domande di impostazione (Prossimi e Passati, date passate con avviso, interruttore «Attivo», messaggio senza limite, «Togli» con conferma, indicatore di pubblicazione) e la conferma della demo; le assunzioni della sezione 10 sono state confermate da Mirko il 2026-10-20. Struttura e comportamenti comuni sono quelli di `schermate/servizi/spec.md` e `schermate/menu-fissi/spec.md`; qui si dicono per intero testi e differenze.

**Si implementa in**: `fase-6` sottofase 6.6 (backoffice «Menù»; non ancora nel repo). Dipende da 8.2 (shell), 8.3 (guardia), 6.2 e 6.3 (collection `special-days`, `fixed-menus`), 6.5 (ricompilazione) e dalla Parte 0 di 6.6 (permessi di cancellazione e registro). La nota di `ADR-112` dice che **orari, chiusure e giorni speciali non sono in `disponibilita.json`**: ogni loro modifica richiede la ricompilazione del menù pubblico.

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1, D5, D6, D8, D9, D10, D13, D14), `fase-6-menu-digitale.md` §§6.3, 6.5, 6.6, `ADR-108` (emendamento del 2026-10-12 su `content`; emendamento del 2026-10-14), `ADR-112` (note del 2026-10-12 su `special-days`), `ADR-113` (emendamento del 2026-10-14), `ADR-115` (nota del 2026-10-14), `schermate/orari/spec.md` (stesso campo data nativo).

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato) e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Telefono: `390-modulo-chiaro.png`, `390-modulo-menu-chiaro.png`, `390-modulo-inglese-aperto-chiaro.png`, `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png`, `390-sovrapposizione-chiaro.png`, `390-data-passata-chiaro.png`, `390-attivazione-chiaro.png`, `390-elimina-chiaro.png`, `390-eliminato-chiaro.png`, `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png`, `390-errore-azione-chiaro.png`. Notebook: `1280-modulo-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`. Nel mockup e negli screenshot «oggi» è il 15 ottobre 2026.

---

## 1. Obiettivo e accesso

Il manager (e admin e super-admin) vede i giorni speciali divisi in **Prossimi** e **Passati**, li attiva e disattiva con un tocco, ne crea, modifica ed elimina, sceglie i menù fissi di ogni giorno e può avviare la ricompilazione del menù pubblico. Funziona da telefono e da notebook.

- **Accesso**: `canAccessSection(user, 'menu')`. Non autenticato → `/app/login`. Sezione non consentita non raggiungibile nemmeno dall'URL.
- **Cosa fa un giorno speciale**: **sostituisce del tutto** l'offerta normale (alla carta e menù fissi) per la data e l'ambito scelti; l'ambito «Giornata intera» sostituisce pranzo e cena, «Solo pranzo» o «Solo cena» lasciano l'altro servizio sul menù normale (`fase-6` §6.3). Il modulo lo dice in un riquadro.
- **Cancellazione** (D14): il manager elimina un giorno speciale, con conferma semplice: **nessuna relazione punta ai giorni speciali** (`ADR-108`, nota del 2026-10-13). **Attivare e disattivare** è l'interruttore «Attivo».
- **Ricompilazione**: nuovi giorni, modifiche, attivazioni, disattivazioni ed eliminazioni compaiono sul menù pubblico **dopo la ricompilazione**, non prima: gli avvisi lo ricordano. Non c'è nulla di «immediato» in questa schermata.
- **Fuori perimetro**: la creazione dei menù fissi (schermata dei Menù fissi); il pulsante «Ricompila il menù pubblico» è condiviso con le altre liste, e la sua posizione definitiva si decide con la schermata di integrazione.

## 2. Collegamento ai dati

Collection `special-days` (`fase-6` §6.3), con la Local API **con la sessione dell'utente** (`overrideAccess: false`): il manager legge, crea, modifica e cancella (emendamento ad `ADR-113` del 2026-10-14); un utente senza ruolo non può nulla.

| Elemento | Campo | Note |
|---|---|---|
| Data | `date` | Obbligatoria. Il campo è un giorno di calendario: l'App scrive **sempre `AAAA-MM-GG`** (forma accettata dal server, che la normalizza a mezzogiorno UTC). Campo data nativo, come le chiusure annuali di Orari; mostrata in lettere con il giorno della settimana («giovedì 31 dicembre 2026») |
| Ambito | `scope` (`day` / `lunch` / `dinner`) | Obbligatorio: «Giornata intera», «Solo pranzo», «Solo cena» |
| Menù fissi | `content.fixedMenus` → `fixed-menus` (molti) | **Almeno uno** (obbligatorio nel modello). Caselle raggruppate per categoria |
| Messaggio | `content.message` (testo, **localizzato**) | Facoltativo: banner sul giorno speciale; inglese facoltativo con ripiego sull'italiano (D10) |
| Disattivato | `disabled` | Assenza a tempo indefinito: il giorno non si applica e **non conta per la sovrapposizione** |

**Interrogazioni**
- **Prossimi**: giorni con data da oggi in poi (oggi compreso, in Europe/Rome: `todayRomeAsSpecialDayDate()`), in ordine **crescente** di data (a parità, per ambito). **Passati**: data prima di oggi, in ordine **decrescente**. Due richieste con `where` e `sort` della Local API, non nel browser; disabilitati compresi. `limit=100` per ciascuna: oltre vale la regola degli altri elenchi («Mostra altri giorni speciali»), non disegnata perché il caso non si verifica in pratica; non si tronca in silenzio.
- **Menù fissi del modulo**: tutti i menù fissi (8 nello snapshot), raggruppati per categoria, con il badge «Solo giorni speciali» e, se disabilitati, «Disabilitato»; un menù disabilitato si può scegliere ma non avrà effetto (assunzione, sezione 10). Un valore già salvato resta visibile anche se ora fuori elenco.
- **Controllo di sovrapposizione**: il server rifiuta un giorno attivo che si sovrappone a un altro attivo con la stessa data (`validateSpecialDayOverlap`, 6.3: «Giornata intera» si sovrappone a tutto, «pranzo» e «cena» solo con se stessi). L'App lo anticipa nel modulo, appena data e ambito sono scelti, con **lo stesso testo del server** (da `lib/`, non riscritto).

**Operazioni**: attiva/disattiva (aggiorna `disabled`); salva (crea o modifica, con la validazione sopra); elimina (cancellazione fisica, D14, dopo conferma).

**Effetti sul menù pubblico**
- Nessuna scrittura di `disponibilita.json` (i giorni speciali non ci sono): tutto compare dopo la ricompilazione (6.5).
- Ogni cancellazione lascia una riga nel registro attività (`eventType: delete`, `area: app`, collection, identificativo, data e ambito nel dettaglio, nessun dato personale; `ADR-115`, nota del 2026-10-14).

## 3. Albero blocchi → componenti → varianti

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| `topbar` | Pulsante del menu, briciola «Menù › Giorni speciali» | `SidebarTrigger`, `Separator`, `Breadcrumb` |
| `intestazione-pagina` | Titolo, descrizione, due azioni | `Button (default, lg)` «Nuovo giorno speciale» e `Button (outline, lg)` «Ricompila il menù pubblico» |
| `gruppo-prossimi`, `gruppo-passati` | Intestazione «{Prossimi \| Passati} {N giorni}», poi tabella e schede | testo (`h2`) |
| `elenco-tabella` (da 768 px) | Data (in lettere, con etichetta «Oggi», badge «Disattivato» e, sotto, il messaggio), Ambito, Menù fissi (nomi), Attivo, azioni | `Table` a colonne fisse, `Badge`, `Switch`, `Button (ghost, icon)` ×2: matita e cestino |
| `elenco-schede` (sotto 768 px) | Data in lettere con «Oggi»; «{ambito} · {menù}»; badge «Disattivato»; interruttore «Attivo», matita, cestino | `Card (sm)`, `Badge`, `Switch`, `Button (ghost, icon)` ×2 |
| (stato) modulo | Riquadro informativo; sezioni `quando`, `menu-fissi`, `messaggio`, `disponibilita` | `Sheet`, `Alert (default)`, `FieldGroup`, `FieldSet`, `FieldLegend`, `Field`, `Input (date)`, `Select`, `Checkbox`, `Badge`, `Textarea`, `Collapsible`, `Switch`, `FieldDescription`, `FieldError`, `Button (lg)` |
| (stato) elimina | Conferma «Eliminare il giorno speciale di {data}?» | `AlertDialog`, `Button (destructive)`, `Button (outline)`, `Spinner` |
| (stato) ricompila, caricamento, avvisi | Come le altre liste | `AlertDialog`, `Skeleton`, `Alert` |

## 4. Layout e regole responsive

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Colonna | Tutta la larghezza, margine 16 px | Centrata, larga al massimo `max-w-5xl`: a 1280 px è 976 px |
| Azioni di pagina | In colonna, «Nuovo giorno speciale» per prima, poi «Ricompila il menù pubblico» | In riga, «Ricompila» a sinistra e «Nuovo giorno speciale» a destra |
| Elenco | Schede: data in lettere, «ambito · menù» (troncati con i puntini), badge; a destra interruttore «Attivo» con etichetta, matita, cestino | Tabella a **colonne fisse** (Data 16 rem, Ambito 9 rem, Attivo 7 rem, azioni 6 rem; il resto ai menù fissi) |
| Gruppo vuoto | Non compare; se non ci sono «Prossimi» ma ci sono «Passati», sopra compare «Nessun giorno speciale in programma.» | Idem |
| Righe disattivate | Attenuate, badge «Disattivato»; l'interruttore resta attivo | Idem |
| Foglio del modulo | Dal basso, altezza massima 90 % con scorrimento; pulsanti agganciati in fondo, affiancati | Da destra; pulsanti agganciati in fondo, affiancati |
| Dimensioni dei controlli | Dispositivo touch (`pointer-coarse`): ≥ 44 px (D6) | Con mouse: misure standard di Nova |

Nessuno scorrimento orizzontale a 360, 390 e 1280 px.

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Elenco | «Prossimi» (dal più vicino, con «Oggi») e «Passati» (dal più recente); righe disattivate attenuate | `*-chiaro.png`, `*-scuro.png` |
| Attiva o disattiva | L'interruttore cambia; avviso «Giorno speciale attivato» o «disattivato» con il richiamo alla ricompilazione | `390-attivazione-chiaro.png` |
| Modulo | Riquadro informativo, data, ambito, menù fissi per categoria, messaggio, stato | `390-modulo-chiaro.png`, `390-modulo-menu-chiaro.png`, `1280-modulo-chiaro.png` |
| Traduzione inglese aperta | Message con il suggerimento sul ripiego | `390-modulo-inglese-aperto-chiaro.png` |
| Nuovo giorno speciale, errori | Modulo vuoto; messaggi sotto i campi | `390-nuovo-chiaro.png`, `390-nuovo-errori-chiaro.png` |
| Sovrapposizione | Il messaggio del server sotto Ambito, appena data e ambito coincidono con un giorno attivo | `390-sovrapposizione-chiaro.png` |
| Data passata | Avviso non bloccante sotto la data | `390-data-passata-chiaro.png` |
| Elimina, eliminato | Conferma «Eliminare il giorno speciale di {data}?»; avviso «Giorno speciale eliminato» | `390-elimina-chiaro.png`, `390-eliminato-chiaro.png` |
| Errore dell'azione | Avviso rosso nel foglio che l'ha avviata; nulla cambia | `390-errore-azione-chiaro.png` |
| Caricamento, errore di caricamento, nessun giorno speciale | Come le altre liste | `390-caricamento-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-vuoto-chiaro.png` |

La conferma di ricompilazione è quella di `schermate/piatti/`. Non ci sono gli stati «filtri», «nessun risultato» ed «elenco parziale».

## 6. Testi

Tutti in italiano; `{…}` sono dinamici. Le date si mostrano «giovedì 31 dicembre 2026» (`it-IT`, giorno della settimana, giorno, mese per esteso, anno, con la prima lettera maiuscola in elenco).

| Dove | Testo |
|---|---|
| Titolo | Giorni speciali / Un giorno, o un solo servizio, con un menù che sostituisce l’offerta normale. / Nuovo giorno speciale · Ricompila il menù pubblico |
| Gruppi | «Prossimi» e «Passati», con «{1 giorno \| N giorni}»; «Nessun giorno speciale in programma.» se non ci sono giorni futuri |
| Colonne | Data, Ambito, Menù fissi, Attivo, (Azioni, solo per lo screen reader) |
| Riga | Data in lettere; etichetta «Oggi» se è oggi; badge «Disattivato»; sotto la data (in tabella) «Messaggio: {testo}» se c'è; ambito «Giornata intera \| Solo pranzo \| Solo cena»; menù fissi separati da virgole; su telefono «{ambito} · {menù}» |
| Stato | Nome accessibile dell'interruttore «Attivo: {data}, {ambito}»; etichetta visibile «Attivo» su telefono |
| Azioni di riga | «Modifica il giorno speciale di {data}» ed «Elimina il giorno speciale di {data}» (nomi accessibili, nessun testo visibile) |
| Avvisi rapidi | Giorno speciale attivato · Giorno speciale disattivato / «Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».» |
| Avvisi di salvataggio | Giorno speciale aggiunto · Giorno speciale salvato / «Per vederlo sul menù pubblico serve «Ricompila il menù pubblico».» |
| Elimina | «Eliminare il giorno speciale di {data}?» / «{Ambito}. Non si può annullare.» / Indietro, Elimina. Esito: «Giorno speciale eliminato» / «Per toglierlo dal menù pubblico serve «Ricompila il menù pubblico».» |
| Modulo, titolo | Nuovo giorno speciale («Compare nel menù pubblico dopo la ricompilazione.») · Modifica giorno speciale («{data}») |
| Modulo, riquadro | «Il giorno speciale sostituisce l’offerta normale (alla carta e menù fissi) per la data e l’ambito scelti.» |
| Modulo, Quando | Data (campo data nativo; avviso non bloccante se è passata: «La data è passata: il giorno speciale non avrà effetto.») · Ambito (segnaposto «Scegli»; «Giornata intera», «Solo pranzo», «Solo cena»; «La giornata intera sostituisce pranzo e cena; pranzo o cena lasciano l’altro servizio sul menù normale.») |
| Modulo, Menù fissi | Una casella per menù, raggruppati per categoria, con badge «Solo giorni speciali» e «Disabilitato» |
| Modulo, Messaggio | «Messaggio sul giorno speciale» («Facoltativo: un banner sul giorno speciale.») · «Traduzione inglese (facoltativa)» con «Manca» o «Presente», Message («Facoltativa. Se resta vuota, il menù mostra il testo italiano.») |
| Modulo, Stato | «Disattivato» («Assente a tempo indefinito: il giorno speciale non si applica e non conta per la sovrapposizione.») · Salva («Salvataggio…»), Annulla |
| Errori del modulo | Scegli una data. · Scegli un ambito. · Scegli almeno un menù fisso. · Sovrapposizione: «Esiste già un giorno speciale attivo per questa data e questo servizio. La giornata intera non può sovrapporsi a pranzo o cena, e viceversa.» (testo del server, `SPECIAL_DAY_OVERLAP_MESSAGE`, non si riscrive) |
| Errore dell'azione | Operazione non riuscita / Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore. |
| Errore di caricamento | Impossibile caricare i giorni speciali / Riprova tra qualche istante; se il problema continua, avvisa l’amministratore. / Riprova |
| Vuoto | Nessun giorno speciale. (+ «Nuovo giorno speciale») |

**Singolare e plurale**: «1 giorno» al singolare, negli altri casi «N giorni».

## 7. Comportamenti

1. **Attiva e disattiva con un tocco** (D9): l'interruttore «Attivo» salva subito, anche sulle righe disattivate; se fallisce nulla cambia e compare l'errore. L'avviso ricorda la ricompilazione.
2. **Prossimi e Passati**: la divisione si calcola con la data di oggi in Europe/Rome; un giorno di oggi sta nei «Prossimi» con l'etichetta «Oggi». Cambiando la data in un modulo il giorno cambia gruppo al salvataggio.
3. **Apertura del modulo** con la matita; la riga non è tappabile (D13). «Nuovo giorno speciale» apre il modulo con ambito «Solo cena» preselezionato (il caso tipico, come San Valentino) e gli altri campi vuoti.
4. **Elimina**: il cestino apre la conferma semplice; «Elimina» cancella e mostra l'avviso; l'errore resta nella finestra. Si possono eliminare anche i passati. Nessun testo suggerisce di disattivare.
5. **Data**: campo data nativo; l'App scrive `AAAA-MM-GG`. Una data passata è ammessa e dà l'avviso non bloccante.
6. **Sovrapposizione**: calcolata nel modulo con i giorni già caricati (i giorni disattivati non contano e il giorno che si sta modificando non confligge con se stesso); l'errore compare sotto Ambito, **blocca il salvataggio** e sparisce disattivando il giorno o cambiando data o ambito. Il server la verifica comunque.
7. **Menù fissi**: almeno uno, altrimenti «Scegli almeno un menù fisso.»; nessuna regola sulla compatibilità (un menù «Solo pranzo» in un giorno «Solo cena» non genera avvisi: `fase-6` non la prevede).
8. **Messaggio** (D10): area di testo facoltativa; traduzione inglese chiusa per default, si apre se esiste.
9. **Validazione e salvataggio**: data, ambito e almeno un menù obbligatori; con errori nessun salvataggio, messaggi sotto i campi, primo campo non valido in vista e con il focus. Salvataggio immediato (D9), con `Spinner` e «Salvataggio…».
10. **Ordine**: «Prossimi» per data crescente, «Passati» decrescente, a parità per ambito.
11. **Tema e tocco**: come D4 e D6.

## 8. Componenti da installare e da comporre

- **Da installare**: nessun componente oltre a quelli già richiesti dalle altre schermate del Menù (`checkbox`, `collapsible`, `alert-dialog`, `select`, `switch`, `table`, `textarea`).
- **Componenti di composizione** (`components/app/`, solo con componenti di `components/ui`): gruppo con tabella e schede (condiviso nello scheletro con gli altri elenchi), riga di giorno speciale, modulo con riquadro informativo e sezioni, caselle dei menù fissi raggruppate per categoria (condivise con il selettore dei servizi del menù fisso nello stile), conferma di eliminazione semplice, pulsante «Ricompila» condiviso.
- **Eccezioni alla regola UI** (`ui-check-allow`): nessuna.
- **Logica pura in `lib/`** (con test): divisione in prossimi e passati con la data di oggi in Europe/Rome (riusa `todayRomeAsSpecialDayDate`), formato della data in lettere, **anticipo del controllo di sovrapposizione** (riusa `specialDayScopesOverlap` e `SPECIAL_DAY_OVERLAP_MESSAGE`), testi con singolare e plurale.

## 9. Checklist di accettazione

Si verifica con Playwright. Controlli comuni **C1–C10** di `modello-specifica-schermata.md`. Specifici:

1. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px in tutte le viste. *Misurato nel prototipo il 2026-10-15 in elenco, nuovo, modulo ed eliminazione: nessuno.*
2. **Aree di tocco** a 390 px con tocco simulato (C2): nessun elemento sotto 44 px, comprese le caselle dei menù fissi. *Misurato nel prototipo nelle stesse viste: nessuno.*
3. **Colonna e elenco**: a 1280 px la colonna è larga 976 px; tabella da 768 px, schede sotto.
4. **Prossimi e Passati**: i giorni da oggi in poi stanno nei «Prossimi» in ordine crescente, gli altri nei «Passati» in ordine decrescente; un giorno di oggi ha l'etichetta «Oggi»; con dati di prova a cavallo della mezzanotte Roma il confine è corretto. *Provato nel prototipo con quattro prossimi e due passati.*
5. **Azioni di riga**: interruttore «Attivo», matita e cestino a 44 px, con i nomi accessibili della sezione 6; nessun menu «⋯».
6. **Attiva e disattiva**: un tocco cambia lo stato e compare l'avviso con il richiamo alla ricompilazione; nessuna scrittura su `disponibilita.json`.
7. **Modulo**: data, ambito e almeno un menù fisso obbligatori con i messaggi della sezione 6; focus sul primo campo non valido. *Provato nel prototipo: un modulo vuoto dà «Scegli una data.» e «Scegli almeno un menù fisso.» (l'ambito parte da «Solo cena»).*
8. **Sovrapposizione**: con il 14 febbraio 2027 «Solo cena» (già presente) e con «Giornata intera» compare il messaggio del server e il salvataggio è bloccato; con «Solo pranzo» no; disattivando il giorno il conflitto sparisce; modificando un giorno non confligge con se stesso; una richiesta diretta con una sovrapposizione torna con lo stesso messaggio. *Provato nel prototipo: tutto tranne la richiesta diretta.*
9. **Data passata**: l'avviso compare e non blocca il salvataggio. *Provato nel prototipo.*
10. **Data scritta**: il valore inviato è `AAAA-MM-GG` e la lettura dà lo stesso giorno di calendario (mezzogiorno UTC), anche vicino alla mezzanotte di Roma.
11. **Lingue**: traduzione chiusa per default e aperta se esiste; con l'inglese vuoto una lettura `locale=en` ricade sull'italiano per il messaggio.
12. **Eliminazione**: conferma semplice con la data e l'ambito; il giorno sparisce; compare «Giorno speciale eliminato»; la riga di registro esiste; consentita a manager (`appRole`), admin e super-admin, rifiutata a un utente senza ruolo. *Testo provato nel prototipo.*
13. **Persistenza e permessi**: nuovo e modifica si salvano con la sessione dell'utente (`overrideAccess: false`) e la rilettura (`depth=1`) dà gli stessi valori e gli stessi menù.
14. **Stati e testi**: come negli screenshot e nella sezione 6, singolare e plurale compresi.
15. **Temi, accesso, `pnpm ui:check`**: C3, C4 (`canAccessSection(user, 'menu')`), C9.
16. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro (C10).

## 10. Scelte confermate, assunzioni e debiti

**Scelte confermate da Mirko il 2026-10-15**
- **Prossimi e Passati** come due gruppi (dal più vicino; dal più recente).
- **Date nel passato ammesse**, con un avviso non bloccante.
- **Interruttore «Attivo»** (non «Disponibile»).
- Come le altre liste: matita, cestino, conferma, ricompilazione (D13, D14).

**Assunzioni confermate da Mirko il 2026-10-20** (il design le usa)
1. **Ambito**: un elenco a tendina con la spiegazione (non tre pulsanti), preselezionato su «Solo cena».
2. **Menù fissi**: tutti scegliibili, anche i disabilitati (con il badge, senza effetto) e anche quelli non «Solo giorni speciali».
3. **Nessun avviso di compatibilità** tra la visibilità del menù («Solo pranzo») e l'ambito del giorno («Solo cena»).
4. **La sovrapposizione blocca** il salvataggio già nel modulo (oltre al server).
5. **Passati sempre visibili**, senza nasconderli né raggrupparli per anno.
6. **Un messaggio per giorno** (campo unico `content.message`), non uno per servizio.
7. **«Nuovo giorno speciale»** preseleziona «Solo cena».

**Debiti futuri e punti aperti**
- **Nessun indicatore di «giorno in corso»** sulla pagina pubblica o nell'App oltre all'etichetta «Oggi».
- **Duplicare un giorno** (stesso menù per l'anno dopo, per esempio San Valentino): non previsto; si valuta dopo l'uso reale.
- **Anteprima di come appare il giorno speciale** sul menù pubblico: non prevista.
- **Esito della ricompilazione**: come in Piatti, la schermata dice solo «avviata» (6.5).
- **Pulizia dei passati**: nessuna cancellazione automatica; si eliminano a mano.
