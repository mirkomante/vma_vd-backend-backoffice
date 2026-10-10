# Orari — specifica di schermata (`/app/hours`)

**Stato**: chiusa il 2026-10-10. Approvata da Mirko dopo la revisione (colonna stretta, rosso più scuro, anno più visibile, selezione dei giorni evidente); stati e scelte di dettaglio completati lo stesso giorno (sezioni 5 e 10). È la prima schermata del pacchetto di design; il suo formato diventerà il modello di specifica.

**Si implementa in**: `fase-8-shell-app.md` §8.5. Dipende da 8.2 (shell), 8.3 (guardia) e dalla Fase 7 (campi e permessi).

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1–D8), `fase-7-impostazioni-sistema.md` §§7.2 e 7.4, `ADR-109`, `ADR-113`, `globals/SystemSettings.ts`, `lib/systemSettings/`.

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato, stato iniziale), `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (stato iniziale, pagina intera), `390-errore-chiaro.png`, `390-salvato-chiaro.png`, `390-salvataggio-chiaro.png`, `390-errore-server-chiaro.png`, `390-non-configurato-chiaro.png`, `390-errore-caricamento-chiaro.png`, `390-uscita-chiaro.png`, `390-foglio-chiusura-chiaro.png`, `390-conferma-rimozione-chiaro.png` (stati). Negli screenshot data e ora hanno il formato italiano (`gg/mm/aaaa`, 24 ore): il controllo nativo segue la lingua del browser. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo e accesso

Il manager (e admin e super-admin) modifica gli orari di vietnamonamour.com: servizi del ristorante, giorni di riposo, chiusure annuali, check-in e check-out del B&B. Funziona da telefono e da notebook (requisito di base, sezione 0 di `decisioni-layout-app.md`).

- **Accesso**: `canAccessSection(user, 'hours')`. Chi non è autenticato va a `/app/login`. Una sezione non consentita non è raggiungibile nemmeno digitando l'URL (checklist di 8.2).
- **Fuori perimetro**: le chiusure per data (Eccezioni giorno) stanno in Prenotazioni (`ADR-107` §2). Questa schermata non ricompila il menù pubblico (`po-06`, pulsante della 6.5).

## 2. Collegamento ai dati

Lettura e scrittura del Global `impostazioni-sistema`, tab «Orari e chiusure», con la Local API **con la sessione dell'utente** (`overrideAccess: false`), così valgono i permessi di `ADR-113` (§7.4). Validazione e calcolo delle festività vengono da `lib/systemSettings/`, non si duplicano.

| Elemento della schermata | Campo | Note |
|---|---|---|
| Pranzo, Inizio / Fine | `services[]` con `name: 'lunch'`, `startTime` / `endTime` | Il campo è un `Input type="time"`: il valore è sempre `HH:mm` a 24 ore; il formato mostrato segue le impostazioni del dispositivo |
| Cena, Inizio / Fine | `services[]` con `name: 'dinner'`, `startTime` / `endTime` | Esattamente due righe: una per servizio |
| Giorni di riposo | `weeklyClosedDays` (`monday` … `sunday`) | Scelta multipla; nessuna scelta = nessun giorno di riposo |
| Chiusure annuali | `annualClosures[]` con `date` e `label` | `date` sempre a mezzogiorno UTC (`normalizeAnnualClosureDate`); visualizzata `gg/mm/aaaa` (`formatAnnualClosureDateUtc`); ordine per data (`sortAnnualClosuresByDate`) |
| Pulsanti delle festività | `mergeItalianPublicHolidays`, `removeItalianPublicHolidaysForYear` (`lib/systemSettings/italianPublicHolidays.ts`) | 13 festività (12 nazionali + Sant'Ambrogio) |
| Check-in / Check-out | `bnb.checkInTime` / `bnb.checkOutTime` | Testo `HH:mm` |

**Validazione** (`lib/systemSettings/timeOfDay.ts`): regex `^([01]\d|2[0-3]):[0-5]\d$`. Se `services` manca sul Global, gli orari sono **non configurati**: nessun default inventato (`fase-7` §7.2).

## 3. Albero blocchi → componenti → varianti

Ricavato dal mockup annotato. I blocchi sono `data-block`; i componenti sono quelli di `components/ui`; l'indicazione è `Componente (variante, dimensione)`.

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| `topbar` | Pulsante del menu, separatore, briciola «Orari» | `SidebarTrigger`, `Separator`, `Breadcrumb` |
| `contenitore-form` | Colonna del modulo (D8) | composizione, vedi sezione 8 |
| `intestazione-pagina` | Titolo e descrizione | testo (`h1`, `p`) |
| `servizi` | Scheda «Servizi del ristorante»: due gruppi Pranzo/Cena, ognuno con Inizio e Fine | `Card`, `FieldGroup`, `FieldSet`, `FieldLegend (label)`, `Field`, `FieldLabel`, `Input (type time)` ×4 |
| `giorni-riposo` | Scheda con sette voci | `Card`, `ToggleGroup (outline)`, `ToggleGroupItem (outline, default)` ×7 |
| `chiusure-annuali` | Scheda con festività, elenco e pulsante di aggiunta | `Card`, vedi sotto |
| `festivita` | Anno e due pulsanti | `FieldSet`, `FieldLegend (label)`, `FieldDescription`, `Field`, `FieldLabel`, `Input`, `Button (default, default)`, `Button (outline, default)` |
| `elenco-chiusure` | Righe per anno: etichetta, data, matita, cestino | testo, `Button (ghost, icon)` ×2 per riga; intestazione dell'anno (testo) |
| (in `chiusure-annuali`) | Pulsante «Aggiungi chiusura» | `Button (outline, default)` con icona |
| `bnb` | Scheda B&B: Check-in e Check-out | `Card`, `Field`, `FieldLabel`, `Input (type time)` ×2 |
| `barra-salvataggio` | Compare solo con modifiche (D7) | `Button (outline, lg)`, `Button (default, lg)`; slot della shell |
| (stato) | Avvisi in testa alla colonna | `Alert (default | destructive)`, `AlertTitle`, `AlertDescription` |
| (stato) | Modifica o aggiunta di una chiusura | `Sheet`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`, `Field`, `Input` ×2 (data nativa ed etichetta), `Button` ×2 |
| (stato) | Salvataggio in corso | `Spinner` nel pulsante; campi e pulsanti disabilitati (`fieldset` disabilitato) |
| (stato) | Errore del server, orari non configurati, errore di caricamento | `Alert (destructive | default)` con `AlertTitle`, `AlertDescription`; `Button (outline, default)` «Riprova» |
| (stato) | Uscita con modifiche non salvate | `AlertDialog`: `Cancel` «Resta qui», `Action (destructive)` «Esci senza salvare» |
| (stato) | Conferma «Rimuovi festività di un anno» | `AlertDialog` con `Header`, `Title`, `Description`, `Footer`, `Cancel`, `Action` |

La shell (barra laterale, menu utente, tema) è quella di D1–D4 e non fa parte di questa specifica.

## 4. Layout e regole responsive

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Shell | Barra in alto con pulsante del menu; il menu è un pannello laterale | Barra laterale fissa da 16 rem |
| Colonna del modulo | Tutta la larghezza, margine 16 px | Centrata, larga al massimo 576 px (`max-w-xl`), margine 24 px |
| Orari (Inizio / Fine, Check-in / Check-out) | Due colonne uguali | Due colonne uguali |
| Giorni di riposo | Sette voci che riempiono la riga (47 px a 390 px) | Gruppo compatto da 392 px, voci da 56 px |
| Pulsanti delle festività | Uno sotto l'altro, a tutta larghezza | Affiancati |
| Barra di salvataggio | Testo sopra, due pulsanti affiancati; 97 px di altezza | Allineata alla colonna; testo a sinistra, pulsanti a destra |
| Foglio di modifica | Dal basso | Da destra |
| Dimensioni dei controlli | Dispositivo touch (`pointer-coarse`): ≥ 44 px (D6) | Con mouse: misure standard di Nova |

Nessuno scorrimento orizzontale a 360, 390 e 1280 px. La barra in alto e la barra di salvataggio restano agganciate durante lo scorrimento (richiede `overflow-x: clip` in `app-ui.css`, P1 di `decisioni-layout-app.md`).

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Iniziale | Nessuna barra di salvataggio, nessun avviso | `mockup.html`, `*-chiaro.png`, `*-scuro.png` |
| Modificato | Compare la barra: «Modifiche non salvate», «Annulla modifiche», «Salva modifiche» | `390-errore-chiaro.png` (barra visibile) |
| Errore di validazione | Avviso rosso in testa («Controlla i campi evidenziati»); campo con bordo e testo di errore; il primo campo non valido è in vista e ha il focus | `390-errore-chiaro.png` |
| Salvato | Avviso «Orari salvati»; la barra scompare | `390-salvato-chiaro.png` |
| Foglio chiusura | Foglio con Data ed Etichetta, «Applica», «Annulla» | `390-foglio-chiusura-chiaro.png` |
| Conferma rimozione festività | Finestra di conferma con il numero di chiusure | `390-conferma-rimozione-chiaro.png` |
| Avvisi delle festività | Avviso informativo (aggiunte, già presenti, nessuna da rimuovere, rimosse) o di errore (anno non valido) | testi nella sezione 6 |
| Elenco chiusure vuoto | «Nessuna chiusura annuale.» | testo |
| Salvataggio in corso | Campi e giorni disabilitati (grigi); barra: «Salvataggio in corso…», «Annulla modifiche» disabilitato, «Salvataggio…» con spinner disabilitato | `390-salvataggio-chiaro.png` |
| Errore del server | Avviso rosso «Salvataggio non riuscito»; il modulo conserva le modifiche e la barra resta | `390-errore-server-chiaro.png` |
| Orari non configurati | Avviso informativo in testa; i quattro campi dei servizi vuoti (`--:--`); nessun valore inventato | `390-non-configurato-chiaro.png` |
| Errore di caricamento | Solo avviso rosso con «Riprova»; nessun modulo | `390-errore-caricamento-chiaro.png` |
| Uscita con modifiche | Finestra di conferma «Uscire senza salvare?» | `390-uscita-chiaro.png` |

## 6. Testi

Tutti in italiano. I testi con `{…}` sono dinamici. I messaggi marcati (lib) vengono dal codice esistente e non si riscrivono.

| Dove | Testo |
|---|---|
| Titolo | Orari |
| Descrizione | Orari di vietnamonamour.com: ristorante e B&B. |
| Scheda 1 | Servizi del ristorante / Orario di inizio e fine di Pranzo e Cena (HH:mm, 24 ore). |
| Gruppi e campi | Pranzo, Cena; Inizio, Fine (nessun segnaposto: il controllo dell'ora ha il suo) |
| Scheda 2 | Giorni di riposo settimanali / Giorni della settimana in cui il ristorante è chiuso. |
| Giorni | Lun, Mar, Mer, Gio, Ven, Sab, Dom; nome accessibile esteso (Lunedì … Domenica) |
| Scheda 3 | Chiusure annuali / Giorni di chiusura eccezionali (festività, ferie, ecc.). |
| Festività | Festività predefinite / 13 festività: nazionali e Sant’Ambrogio. / Anno / Aggiungi festività / Rimuovi festività di un anno |
| Righe | Etichetta e data `gg/mm/aaaa`; nomi accessibili «Modifica chiusura {etichetta}» e «Elimina chiusura {etichetta}»; intestazione per anno (es. 2026) quando ci sono più anni |
| Aggiunta | Aggiungi chiusura |
| Scheda 4 | B&B (vietnamonamour.com) / Orari di check-in e check-out. L’indicazione sulla colazione è contenuto del sito. / Check-in, Check-out |
| Barra | Modifiche non salvate / Annulla modifiche / Salva modifiche |
| Esito | Orari salvati |
| Errore (avviso) | Controlla i campi evidenziati / Alcuni orari non sono validi: non è stato salvato nulla. |
| Errore (campo, lib) | Orario obbligatorio. (campo vuoto). Formato non valido: usa HH:mm in 24 ore (es. 09:30). (solo dal server: il controllo nativo non produce altri formati) |
| Salvataggio in corso | Salvataggio in corso… (barra) · Salvataggio… (pulsante) |
| Errore del server | Salvataggio non riuscito / Non è stato salvato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore. |
| Non configurato | Orari non configurati / Pranzo e Cena non hanno ancora orari: compila i quattro campi e salva. |
| Errore di caricamento | Impossibile caricare gli orari / Riprova tra qualche istante; se il problema continua, avvisa l’amministratore. / Riprova |
| Uscita | Uscire senza salvare? / Hai modifiche non salvate: se esci le perdi. / Resta qui, Esci senza salvare |
| Anno non valido | Inserisci un anno valido (1900–2100). |
| Festività aggiunte | Aggiunte {n} festività del {anno} (con n = 1: Aggiunta 1 festività del {anno}) / Salva le modifiche per renderle effettive. |
| Già presenti | Le festività del {anno} sono già tutte presenti. |
| Nessuna da rimuovere | Nessuna festività predefinita da rimuovere per il {anno}. |
| Festività rimosse | Rimosse {n} festività del {anno} (con n = 1: Rimossa 1 festività del {anno}) / Salva le modifiche per renderle effettive. |
| Foglio | Nuova chiusura o Modifica chiusura / Poi premi «Salva modifiche» nella pagina per renderla effettiva. / Data, Etichetta / Applica, Annulla |
| Conferma | Rimuovere le festività del {anno}? / {Verrà tolta 1 chiusura \| Verranno tolte N chiusure} con data uguale a una festività predefinita del {anno}, anche se ne hai cambiato l’etichetta. Poi premi «Salva modifiche». / Annulla, Rimuovi |

**Singolare e plurale**: i testi con numeri vanno al singolare con 1 («1 chiusura», «Verrà tolta») e al plurale altrimenti. Verificato nel mockup.

## 7. Comportamenti

1. **Modifiche non salvate**: il modulo si confronta con l'ultimo stato salvato. La barra compare con almeno una differenza e scompare quando il modulo torna uguale.
2. **Annulla modifiche**: ripristina l'ultimo stato salvato (comprese le chiusure eliminate), chiude errori e avvisi.
3. **Salva modifiche**: se un orario non è valido (nel mockup: campo vuoto) non parte nessun salvataggio; compaiono l'avviso e il messaggio sul campo, e il primo campo non valido (nell'ordine della pagina) viene portato al centro dello schermo e riceve il focus. Se tutto è valido si salva, lo stato salvato si aggiorna, la barra scompare e compare «Orari salvati».
4. **Validazione del server**: è la rete di sicurezza e usa gli stessi messaggi (`lib`). Un errore con percorso di campo (`services.N.startTime`) si mostra sul campo; altrimenti nell'avviso in testa.
5. **Giorni di riposo**: ogni voce si attiva e disattiva da sola; la selezione si vede subito (sfondo `primary`).
6. **Chiusure annuali**: ordinate per data crescente; con più anni compare l'intestazione di ciascun anno. «Aggiungi chiusura» e la matita aprono il foglio (dal basso sotto 768 px, da destra da 768 px). «Applica» è attivo solo con data ed etichetta compilate; aggiorna il modulo e riordina. Il cestino elimina la riga dal modulo **senza conferma**: finché non si salva, «Annulla modifiche» la ripristina.
7. **Festività**: il campo Anno vale se ha quattro cifre tra 1900 e 2100. «Aggiungi festività» aggiunge al modulo le sole righe mancanti tra le 13 predefinite dell'anno e dice quante; se sono già tutte presenti lo dice. «Rimuovi festività di un anno» chiede conferma con il numero di chiusure e toglie quelle la cui **data** coincide con una delle 13 predefinite di quell'anno, anche se l'etichetta è stata cambiata; le altre restano. Entrambi agiscono solo sul modulo (poi si salva) e riordinano per data. Stessa logica dei pulsanti dell'Admin (`lib/systemSettings/`).
8. **Avvisi**: uno alla volta, in testa alla colonna, annunciati da un'area `status`; restano fino alla prossima azione.
9. **Barra di salvataggio**: slot della shell, agganciato al fondo della finestra, allineato alla colonna (D7, D8).
10. **Tema e tocco**: come D4 e D6; nessuna regola particolare di questa schermata.
11. **Salvataggio in corso**: mentre dura, l'intero modulo è disabilitato (un `fieldset` disabilitato, `aria-busy`), la barra mostra «Salvataggio in corso…» e i suoi due pulsanti sono disabilitati; il pulsante di salvataggio ha lo `Spinner`. Terminato, si passa a «Salvato» o a «Errore del server».
12. **Errore del server**: avviso rosso in testa con il testo generico (nessun dettaglio tecnico); le modifiche restano nel modulo e la barra resta, così si può riprovare. Un errore di validazione con percorso di campo (comportamento 4) si mostra sul campo.
13. **Orari non configurati** (`services` assente sul Global): avviso informativo in testa, quattro campi dei servizi vuoti, nessun valore proposto. Il modulo si compila e si salva come di consueto; serve che tutti e quattro gli orari siano validi.
14. **Errore di caricamento**: se la lettura del Global fallisce non compare il modulo, solo l'avviso rosso con «Riprova», che ripete la lettura.
15. **Uscita con modifiche non salvate**: se ci sono modifiche, il clic su un collegamento che porta fuori dalla pagina (menu, home, «Vai all'Admin») apre «Uscire senza salvare?»: «Resta qui» chiude e non cambia nulla; «Esci senza salvare» scarta le modifiche e prosegue. Chiusura o ricaricamento della scheda: avviso nativo del browser (`beforeunload`). Su telefono l'azione sta sopra e l'annulla sotto, come nell'ordine standard di shadcn.

## 8. Componenti da installare e da comporre

- **Da installare** (oltre a quelli della shell): `card`, `field`, `input`, `toggle` e `toggle-group`, `button`, `alert`, `sheet`, `alert-dialog`, `breadcrumb`, `separator`. Ognuno con le deviazioni del registro di `decisioni-layout-app.md` (D6).
- **Componenti di composizione di progetto** (`components/app/`, costruiti solo con componenti di `components/ui`; da definire nella regola UI, rilievo P2): colonna del modulo (`max-w-xl`, centrata), slot della barra di salvataggio nella shell, riga di chiusura (etichetta, data, due azioni).

## 9. Checklist di accettazione

I controlli 1–22 valgono nei due temi e in tutti gli stati dove sensato. Si verifica con Playwright (viewport e, per il tocco, `is_mobile` e `has_touch`) salvo dove indicato. Sul telefono i confronti si fanno con **misure geometriche**, non con la differenza di pixel (vedi `decisioni-layout-app.md`, sezione 5).

1. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px: larghezza del documento uguale a quella della finestra e nessun elemento oltre il bordo destro.
2. **Aree di tocco** a 390 px con tocco simulato: nessun elemento interattivo con lato minore sotto 44 px, in tutti gli stati (iniziale: 30 elementi).
3. **Colonna a 1280 px**: `contenitore-form` largo 576 px e centrato; gruppo dei giorni largo 392 px, voci da 56 px; a 390 px il gruppo occupa la riga.
4. **Giorno selezionato**: sfondo uguale al token `--primary` e testo `--primary-foreground`, in tema chiaro e scuro.
5. **Intestazione dell'anno** nelle chiusure: 16 px, peso 600, colore di testo pieno.
6. **Errore**: dopo un salvataggio con un orario vuoto nessun salvataggio; il primo campo non valido è in vista e ha il focus; i colori di errore usano `--destructive` (`oklch(0.505 0.21 22)` in tema chiaro).
7. **Barre agganciate**: dopo uno scorrimento di 600 px la barra in alto ha `top = 0` e, con modifiche, la barra di salvataggio ha `bottom` uguale all'altezza della finestra.
8. **Barra di salvataggio** a 390 px: altezza non superiore a 97 px, pulsanti affiancati da 44 px di altezza; compare solo con modifiche.
9. **Dati**: salvando valori validi, rileggendo il Global con la Local API si trovano gli stessi `services` (lunch e dinner), `weeklyClosedDays`, `annualClosures` ordinate e con data a mezzogiorno UTC, `bnb`; dopo il ricaricamento la pagina mostra gli stessi valori. Provato con manager (`appRole`), admin e super-admin; un utente senza ruolo è rifiutato.
10. **Validazione server**: un valore non `HH:mm` (es. `25:99`, `9:30`) inviato direttamente al Global viene rifiutato con i messaggi di `lib`.
11. **Festività**: per un anno, «Aggiungi» porta a 13 righe senza duplicati e un secondo premere dice «già tutte presenti»; «Rimuovi» toglie solo le righe con data uguale a una predefinita; i risultati coincidono con quelli dei pulsanti dell'Admin.
12. **Annulla modifiche** ripristina lo stato salvato, comprese le righe eliminate.
13. **Testi**: coincidono con la sezione 6, singolare e plurale compresi.
14. **Temi**: chiaro, scuro e Sistema; con sistema scuro e Sistema la pagina è scura.
15. **Accesso**: `canAccessSection(user, 'hours')` falsa → sezione non raggiungibile dall'URL.
16. **`pnpm ui:check`** passa (nessun colore letterale, nessun valore arbitrario, nessun controllo nativo fuori da `components/ui`).
17. **Salvataggio in corso**: durante il salvataggio campi, giorni, pulsanti delle righe e i due pulsanti della barra sono `:disabled`; la barra dice «Salvataggio in corso…».
18. **Errore del server** (simulato): compare «Salvataggio non riuscito», le modifiche restano nel modulo, la barra resta e un nuovo salvataggio è possibile.
19. **Orari non configurati**: con `services` assente i quattro campi sono vuoti e compare l'avviso informativo; dopo aver salvato valori validi l'avviso scompare.
20. **Errore di caricamento** (simulato): compaiono solo l'avviso e «Riprova»; nessun campo.
21. **Uscita**: con modifiche, il clic su un collegamento del menu apre la conferma; «Resta qui» non cambia nulla, «Esci senza salvare» scarta le modifiche.
22. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro: rilievi etichettati P e A.

## 10. Decisioni di dettaglio e punti per l'implementazione

**Decisioni prese per chiudere la schermata (2026-10-10; Mirko ha approvato la schermata, queste scelte sono parte dell'approvazione)**

- **Campo dell'ora**: `Input type="time"`, non testo. Il valore salvato resta `HH:mm` a 24 ore; sui telefoni dà il selettore nativo. Un campo di testo con tastiera numerica su iOS non permetterebbe di scrivere i due punti (comportamento noto di iOS, non verificato qui).
- **Anno iniziale del campo delle festività**: l'anno corrente.
- **Chiusure con la stessa data**: consentite, come nell'Admin (oggi si deduplicano solo le festività predefinite).
- **Selettore di data del foglio**: controllo nativo (nessuna dipendenza, adatto al tocco); il formato mostrato segue il browser.
- **Notifica dell'esito**: avviso in pagina (`Alert`), non il `Toaster` di shadcn: nessuna dipendenza da `next-themes` per questa schermata.

**Da verificare in implementazione** (se non è fattibile, ci si ferma e si chiede):
- **Intercettare i collegamenti con l'App Router** per mostrare la conferma di uscita (comportamento 15): il router di Next non offre un'API ufficiale per bloccare la navigazione. Se non è fattibile in modo affidabile, il minimo accettabile è `beforeunload` per chiusura e ricaricamento.
- **Mappatura degli errori del server sui campi** (comportamento 4): dipende dal formato dell'errore restituito dalla Local API.
- **Aggiornamento dello stato dopo il salvataggio**: rileggere il Global dal server (non fidarsi dello stato locale).
