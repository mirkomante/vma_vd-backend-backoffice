# Decisioni di design — Area App `(app)`

**Stato**: decisioni confermate da Mirko il 2026-10-10. Precede la regola UI di progetto, il modello di specifica per schermata e lo script `ui:check` (non ancora scritti).

**Riferimenti**: `docs/piano-sviluppo/fase-8-shell-app.md` (§8.2 e §8.5), `ADR-102`, `ADR-113`, `app/(app)/app-ui.css`, `components.json`.

**Perimetro**: solo il design UI/UX dell'Area App. L'Admin resta quello standard di Payload e non si disegna. La revisione del codice sta in un'altra chat. Il livello presentazionale lo scrive Cursor da mockup approvati; qui si decidono le regole che Cursor deve rispettare.

---

## 0. Requisito di base

Ogni funzione dell'App (leggere, modificare, aggiungere, cancellare) deve poter essere usata sia da telefono sia da notebook. Non esistono funzioni solo desktop o solo telefono. Cambia la forma, non l'insieme delle azioni. Dove un ADR prevede una cancellazione «soft» (es. menù: disabilita), il pulsante si chiama «Disabilita», ma l'azione c'è su entrambi i dispositivi.

## 1. Stile

- shadcn/ui, stile `base-nova`, tema neutro, font Geist. Nessun uso dei design system di vietnamonamour o villadoree.
- I colori e i font di brand sono **debito futuro**: quando si applicherà il brand si rivedranno insieme i colori chiari e scuri.
- Solo componenti standard di shadcn, installati in `components/ui`, solo colori semantici (token di `app-ui.css`).
- **Token modificati rispetto al tema shadcn** (da riportare in `app-ui.css`): `--destructive` in tema chiaro da `oklch(0.577 0.245 27.325)` a `oklch(0.505 0.21 22)` (rosso più scuro e meno arancio, più leggibile nei messaggi di errore; il tema scuro resta com'è); `--sidebar-primary` e `--sidebar-primary-foreground` in `.dark` (vedi D4).

## 2. Decisioni

### D1 — Navigazione (struttura del menu)

Componente `Sidebar` di shadcn, **layout «gruppi con tutte le destinazioni visibili»**: tre gruppi con etichetta, nessuna voce che si apre.

| Gruppo | Voci |
|---|---|
| Menù | Piatti, Vini, Bevande, Distillati, Menù fissi |
| Orari | Orari |
| Prenotazioni | Elenco, Eccezioni giorno, Impostazioni |

- **Telefono** (sotto 768 px): barra in alto con pulsante del menu, breadcrumb; il menu si apre in un pannello laterale (la `Sidebar` usa un `Sheet` da 18 rem). **Notebook** (da 768 px): barra laterale fissa da 16 rem, collassabile.
- Il passaggio telefono/schermo largo è **768 px, fisso nella `Sidebar` di shadcn**. Un tablet largo meno di 768 px (es. iPad mini in verticale, 744) vede il layout da telefono; da 768 px in su (es. iPad a 820) vede quello da notebook.
- Il blocco «Area App» in cima alla barra è il collegamento alla home (`/app`).
- Variante della barra: quella standard (non inset né floating). La variante è una proprietà del componente e si può cambiare in seguito senza toccare le schermate.
- **Nome della sottoarea «Menù fissi»** (non «Menù») per evitare la voce doppia.
- Le sottoaree del Menù sono ricavate da `ADR-113` §3. **Da verificare con `fase-6-menu-digitale.md`** (non letto in questa sessione). I nomi «Elenco», «Eccezioni giorno», «Impostazioni» sono quelli di `ADR-113`/`fase-8`; «Elenco» è provvisorio.
- Le voci mostrate passano da `canAccessSection(user, section)`.

### D2 — Contenuto di `/app`: home «Oggi»

Una scheda per ogni sezione consentita (Prenotazioni, Menù, Orari): icona, titolo, descrizione. Ogni scheda ha **una riga di stato opzionale, predisposta ma non attiva**.

**Regola di attivazione**: finché la query di una riga non esiste, la riga non compare e la scheda è quella semplice (titolo e descrizione). Quando la query è pronta si attiva la riga, senza cambiare la UI né il layout.

| Sezione | Riga di stato (testo di esempio, da confermare nella specifica) | Dati | Si attiva con |
|---|---|---|---|
| Prenotazioni | «Oggi N coperti · prossima alle HH:mm» | Prenotazioni del giorno | Sottofase 5.5 |
| Menù | «N piatti non disponibili» | Piatti con disponibilità falsa | Sottofase 6.6 |
| Orari | «Oggi: HH:mm–HH:mm e HH:mm–HH:mm» | `impostazioni-sistema`, tab Orari e chiusure (campi della 7.2), letta con la sessione dell'utente | Sottofase 8.5 |

**Cautela sulla riga Orari**: finché non esistono le Eccezioni giorno (chiusure per data, in Prenotazioni, `ADR-107` §2) la riga dice solo gli **orari previsti**, mai «aperto» o «chiuso». Dire «aperto» ignorando una chiusura per data sarebbe falso.

**Stati di ogni riga** (da definire nei dettagli nella specifica): caricamento con `Skeleton` alla stessa altezza della riga; errore → la riga non compare e la scheda resta navigabile; nessun dato → testo esplicito.

**Utente senza nessuna sezione consentita**: stato vuoto, da specificare.

### D3 — Collegamento a `/admin`

Voce **«Vai all'Admin»** nel menu utente (quello che si apre dal blocco con l'email in fondo alla barra), con icona di collegamento esterno. Visibile solo se `canAccessAdminPanel(user)`. Motivo: l'Admin è pensato soprattutto per l'uso da web e i contenuti dei siti, dopo l'inserimento iniziale, si aggiornano di rado.

### D4 — Tema chiaro, scuro, sistema

- Tre scelte nel menu utente: **Chiaro, Scuro, Sistema**, voci piatte con spunta (niente sottomenu, scomodi da toccare). Scelta iniziale: Sistema.
- La scelta vale **per dispositivo**, non per account (nessun campo in `users`, nessuna migrazione). Se in futuro servisse per account: campo in `users` e migrazione.
- Requisiti comportamentali: nessun lampo del tema sbagliato al caricamento della pagina; i controlli nativi del browser (ora, data, barre di scorrimento) seguono il tema scelto: in `app-ui.css` `:root { color-scheme: light }` e `.dark { color-scheme: dark }` (nel mockup mancava e il campo ora nativo lo ha reso visibile); ogni schermata va verificata in tutti e due i temi.
- Token: in `.dark`, `--sidebar-primary` oggi è un blu (`oklch(0.488 0.243 264.376)`), non neutro. Va portato al grigio di `--primary`: `--sidebar-primary: oklch(0.922 0 0)` e `--sidebar-primary-foreground: oklch(0.205 0 0)`.
- Oggi `app-ui.css` non imposta `color-scheme` e `/app` resta chiaro anche con il sistema in scuro (verificato con Playwright: nessuna differenza di pixel).

### D5 — Filtri delle liste su telefono

**Foglio dal basso.** Una riga: campo di ricerca + pulsante «Filtri» con il numero dei filtri attivi. I filtri si impostano in un `Sheet` dal basso con «Applica» e «Azzera». Sotto la riga compaiono **etichette rimovibili** dei filtri attivi (altrimenti da chiuso si vede solo il numero). Da 768 px in su: riga unica con i campi visibili. Stesso schema per tutte le liste (prenotazioni, piatti, vini…).

Da definire nella specifica della schermata: il filtro per **data** (probabile controllo principale delle prenotazioni) e quali filtri servono a ciascuna lista.

### D6 — Dimensioni di tocco

Ogni elemento interattivo ha un'area di tocco di almeno **44 × 44 px** sui dispositivi touch.

1. **La condizione è il puntatore, non la larghezza**: variante `pointer-coarse:` di Tailwind (verificata nella versione del progetto). Il layout cambia a 768 px; le dimensioni di tocco seguono il tipo di dispositivo. Verificato su sei casi: con la regola per larghezza un iPad a 820 px e un notebook touch restavano a 32 px.
2. **Tutto dentro `components/ui`.** Le schermate non possono scendere sotto i 44 px. `ui:check` non controlla i valori speciali dentro `components/ui`.
3. **Vale l'area cliccabile, non il riquadro visibile.** Casella di spunta, interruttore, pulsanti icona nelle righe: l'elemento resta piccolo, il componente estende l'area (shadcn lo fa già nella `Sidebar` con un'area nascosta che però toglie da 768 px: va agganciata al puntatore). La misura automatica verifica l'area cliccabile, non solo il riquadro.
4. **Esenti gli elementi non interattivi** (es. `Badge` di stato). Se diventa un filtro rimovibile, il componente che lo rende cliccabile porta i 44 px.
5. **Nessuna eccezione nelle schermate.** Un dettaglio che richiede una misura più compatta si decide centralmente e si registra qui sotto («Eccezioni»), non nel codice di una schermata.
6. **Registro delle deviazioni dai file di shadcn**: ogni componente installato viene adattato nello stesso passo e annotato; reinstallare o aggiornare un componente sovrascrive le modifiche.
7. **Verifica**: i controlli con Playwright simulano il tocco (`is_mobile`, `has_touch`), non solo la larghezza: una finestra stretta con il mouse darebbe misure da 32 px e falsi errori.

**Misure dei componenti standard di Nova a 390 px (prima dell'adattamento)**: pulsante `lg` 36, pulsante di default 32, `Input` e `Select` 32, voci della `Sidebar` 32, schede (`Tabs`) 25, pulsante icona piccolo del `SidebarTrigger` 28, voci del menu a tendina 28. Il `Select` fissa l'altezza con `data-[size=default]:h-8`, quindi non si corregge con una classe nella schermata.

**Registro delle deviazioni dai file di shadcn** (applicate e provate sul mockup di Orari; da riportare nei file veri quando si installano i componenti):

| Componente | Deviazione (aggiunta alle classi originali) | Motivo |
|---|---|---|
| `button` | `pointer-coarse:h-11` su `default`, `xs`, `sm`, `lg`; `pointer-coarse:size-11` su `icon`, `icon-xs`, `icon-sm`, `icon-lg` | Area di tocco 44 px (D6); copre anche chiusura del `Sheet`, `AlertDialog`, `SidebarTrigger` |
| `input` | `pointer-coarse:h-11` | D6 |
| `select` | `pointer-coarse:data-[size=default]:h-11` e `...[size=sm]:h-11` sul trigger; `pointer-coarse:py-3` sulle voci | D6 |
| `toggle` | `pointer-coarse:h-11` e `pointer-coarse:min-w-11` su tutte le dimensioni (anche per `toggle-group`) | D6 |
| `toggle` | Stato selezionato con `bg-primary text-primary-foreground` (anche in hover) al posto di `bg-muted` | Il grigio chiaro di shadcn non si distingue dal non selezionato (giorni di riposo) |
| `sidebar` | `pointer-coarse:h-11` su `SidebarMenuButton` (`default`, `sm`), sulla sotto-voce e su `SidebarInput` | D6 |
| `dropdown-menu` | `pointer-coarse:py-3` su voci, voci con spunta, voci radio e sotto-menu | D6 |
| `tabs` | Lista `pointer-coarse:group-data-horizontal/tabs:h-auto`; scheda `pointer-coarse:h-11` | D6 (la scheda era alta 37 px) |
| `breadcrumb` | `BreadcrumbLink`: area di tocco estesa (`pointer-coarse:relative pointer-coarse:after:absolute pointer-coarse:after:-inset-3.5`) | D6 (il collegamento era alto 20 px e, se corto, largo 36) |
| `sheet` | Contenuto: `overflow-y-auto` e `data-[side=bottom]:max-h-[90svh]`. `SheetFooter`: `sticky bottom-0 border-t bg-popover` | I moduli più alti dello schermo scorrono e i pulsanti restano in vista |
| `checkbox` | `relative` e `pointer-coarse:after:absolute pointer-coarse:after:-inset-4` | D6: casella da 16 px con area di tocco da 46 px (l'estensione parte dal bordo interno: `-inset-3.5` dava solo 42 px) |
| `sidebar`, `sheet`, `breadcrumb` (testi) | Testi per lo screen reader in italiano (T1): «Toggle Sidebar» → «Apri o chiudi il menu» (pulsante e margine), «Sidebar» → «Menu», «Displays the mobile sidebar.» → «Menu di navigazione dell’Area App.», «Close» → «Chiudi», `aria-label="breadcrumb"` → «Percorso», «More» → «Altro» | L'interfaccia è solo in italiano, anche per lo screen reader; `ui:check` segnala i testi inglesi (T1) |
| `switch` | `pointer-coarse:after:-inset-y-3.5` (si aggiunge a `after:-inset-x-3 after:-inset-y-2`) | D6: area di tocco da 54 × 44 px |

Non ancora adattati perché non usati finora: radio, calendario, paginazione, link nel testo. Si adattano nello stesso passo in cui si installano.

**Eccezioni** (da compilare solo con decisione esplicita): nessuna.

### D7 — Modello di salvataggio delle schermate di modifica

**Una barra «Salva modifiche» per pagina.** Si salva tutto in una volta: il Global è un unico documento e la validazione tra campi (es. i due servizi) è sull'insieme.

- La barra compare solo quando ci sono modifiche non salvate: testo «Modifiche non salvate», pulsanti «Annulla modifiche» (ripristina l'ultimo salvato) e «Salva modifiche». Resta agganciata al fondo della finestra. Su telefono i due pulsanti stanno affiancati (97 px di altezza in totale).
- È uno **slot della shell, fuori dal contenitore con il padding** (vedi P2 nella sezione 3): dentro il contenitore non si aggancia in modo affidabile. Il suo contenuto è allineato alla colonna del modulo (D8).
- Gli elementi modificati in un foglio (es. una chiusura annuale) hanno «Applica», che modifica solo il modulo; la persistenza avviene con «Salva modifiche». Il testo del foglio lo dice.
- **Errore di validazione**: nessun salvataggio; banner in testa («Controlla i campi evidenziati»), campo con errore evidenziato con il suo messaggio, e il primo campo non valido viene portato in vista e riceve il focus.
- **Esito**: messaggio «… salvati» in pagina con `Alert`, non il `Toaster` di shadcn (A6 risolto per ora: nessuna dipendenza da `next-themes`).
- **Salvataggio in corso**: l'intero modulo è disabilitato, la barra dice «Salvataggio in corso…», il pulsante ha lo `Spinner`.
- **Errore del server**: avviso rosso generico, le modifiche restano e la barra resta, per riprovare.
- **Uscita con modifiche non salvate**: conferma «Uscire senza salvare?» con «Resta qui» e «Esci senza salvare»; chiusura o ricaricamento con l'avviso nativo del browser.

### D8 — Larghezza del contenuto

- **Pagine-modulo** (Orari, modifica di un piatto, impostazioni): colonna centrata larga al massimo `max-w-xl` (576 px). Su schermo largo le righe del modulo restano leggibili (con la larghezza piena, etichetta e icone di una riga si trovavano a oltre 800 px di distanza). Su telefono la colonna occupa tutta la larghezza.
- **Gruppi di scelta** (giorni di riposo): su schermo largo voci compatte da 56 px (`sm:w-14`, gruppo di 392 px); su telefono occupano la riga.
- **Pagine con tabelle** (elenco prenotazioni): colonna centrata larga al massimo `max-w-5xl` (64 rem; a 1280 px è 976 px, oltre i 1280 px si ferma a 1024 px). Su telefono tutta la larghezza, con schede al posto della tabella.
- La barra di salvataggio e il banner seguono la stessa colonna.

### D9 — Elenchi di record: ogni azione si salva subito

Il salvataggio con barra unica (D7) vale per le **pagine-modulo** (Orari, impostazioni). Per gli **elenchi di record** (prenotazioni, e in seguito piatti e simili) ogni azione si salva subito.

- **Dettaglio e modulo in un foglio** (dal basso sotto 768 px, da destra da 768 px): un tocco sulla riga, o il nome su notebook, apre il dettaglio con le azioni dello stato; «Modifica» e «Nuova» usano lo stesso modulo nel foglio, con «Salva» e «Annulla».
- **Azioni irreversibili** (cancella, rifiuta, segna no-show, anonimizza): finestra di conferma con la frase «Non si può annullare.» e, dove previsto, un motivo facoltativo. Le azioni positive (conferma) sono immediate.
- **Esito**: avviso in pagina con il nome e la data; resta fino alla prossima azione.
- **Errore dell'azione**: avviso rosso nel punto da cui è partita (finestra o foglio), nessuna modifica, si può riprovare. Mentre si salva: pulsanti disabilitati, `Spinner`, «Salvataggio…».
- **Scorciatoie su notebook**: menu «⋯» di riga con le stesse azioni del dettaglio.
- **Cose che richiedono attenzione** (es. prenotazioni da confermare) hanno una scheda propria con il conteggio e le azioni in vista, invece di restare sparse nell'elenco.
- **Righe non attive** attenuate e escluse dai totali; **righe anonimizzate** con «Dati anonimizzati» in corsivo e senza azioni.
- **Ordine delle liste**: per nome, come il contratto del menù pubblico (`ADR-112` §1), finché non esiste un campo di ordinamento esplicito; ricerca, filtri e ordine si applicano nella richiesta, non nel browser.
- **Azioni rapide dall'elenco** (piatti: «Terminato» con un interruttore, abilita/disabilita dal menu «⋯»): un tocco, effetto immediato, avviso con il testo di che cosa succede sul menù pubblico.
- **Foglio con modulo lungo**: i pulsanti restano agganciati in fondo (bordo superiore, sfondo pieno) e, se sono due, affiancati (77 px di altezza invece di 130). Vale per tutti i fogli (`SheetFooter`).
- **Azione di pagina principale in alto su telefono**: nelle intestazioni con più pulsanti, «Nuovo …» sta sopra l'azione secondaria (su notebook l'azione principale è a destra).

### D10 — Due lingue nei moduli: italiano sempre in vista, inglese a scomparsa

Per i campi localizzati (oggi nome e descrizione dei piatti; poi vini, bevande, menù fissi) il modulo mostra sempre i campi italiani, obbligatori; sotto, una riga «Traduzione inglese (facoltativa)» con un badge «Manca» o «Presente» che si apre per scrivere in inglese. Si apre da sola se la traduzione esiste. Se l'inglese resta vuoto, il menù pubblico usa l'italiano (ripiego di `fase-6` §6.6). Scelta di Mirko tra tre alternative (schede, inglese a scomparsa, tutti i campi in vista).

### D11 — Pagine di accesso

Le quattro pagine (`login`, `forgot`, `reset`, `verify`) restano **fuori dalla shell** e non cambiano flussi, rotte, campi né messaggi (invariante dell'autenticazione). Disegno: colonna centrata larga al massimo `max-w-sm`; sopra, un quadrato con l'icona dell'App, il titolo e la descrizione; una scheda con avvisi e modulo; sotto, i collegamenti sottolineati. **«Accedi con Google» è il pulsante principale** (Google è l'accesso principale; l'accesso con email e password potrà essere tolto in futuro) e «Accedi» con email il secondario. I moduli restano form nativi con POST (nessuno stato «invio in corso»). I messaggi sono le costanti di `lib/auth/**`. Il tema segue la scelta del dispositivo anche qui. Specifica in `schermate/accesso/`.

### D12 — Utente e ruolo nella shell

L'utente nella barra laterale si mostra con l'**email** e le **iniziali** ricavate dall'email: la collection `users` non ha un campo nome. Il ruolo sta sotto «Area App» in cima alla barra: «Super-admin», «Admin» o «Manager» (con `adminRole` che prevale su `appRole`). Voci del menu non ancora abilitate (la cui schermata non esiste) non si mostrano. Specifica in `schermate/shell/`.

## 3. Prova su Orari (§8.5), 2026-10-10

Mockup funzionante costruito con i componenti reali, le dimensioni di tocco di D6 applicate dentro i componenti, i campi e i testi del Global `impostazioni-sistema` (`globals/SystemSettings.ts`, `lib/systemSettings/`). Struttura: quattro schede (Servizi del ristorante, Giorni di riposo settimanali, Chiusure annuali con le festività, B&B), una barra di salvataggio che compare solo con modifiche non salvate, un foglio per modificare o aggiungere una chiusura, una conferma per «Rimuovi festività di un anno».

**Misure** (Playwright, tocco simulato): a 390 e a 360 px nessuno dei 30–32 elementi interattivi è sotto i 44 px; nessun elemento esce a destra a 360 px; con mouse a 1280 px le altezze restano compatte (28–48 px). Con «Sistema» e sistema in scuro la pagina è scura.

**Correzioni dopo la prima revisione (Mirko, 2026-10-10)**: colonna del modulo ristretta a 576 px (D8); giorni di riposo compatti; intestazione dell'anno nelle chiusure a 16 px semibold con colore pieno; stato selezionato dei giorni in `bg-primary` (registro D6); `--destructive` più scuro (sezione 1). Rimisurato: nessun elemento sotto 44 px a 390 px (30 elementi), nessuno scorrimento orizzontale.

**Rilievi**
- **P1 — `app-ui.css`: `html, body { overflow-x: hidden }` rompe `position: sticky`.** Con `overflow` impostato su entrambi, il `body` diventa un contenitore di scorrimento: dopo aver scorso di 600 px la barra in alto era a −600 (scorre via) e la barra di salvataggio non si agganciava. Con `overflow-x: clip` entrambe funzionano (barra in alto a 0, barra di salvataggio al fondo della finestra). Correzione: sostituire `hidden` con `clip` (riga di `@layer base` aggiunta in 8.1c). Da applicare nella 8.2.
- **P2 — Serve un secondo livello di componenti: quelli di composizione.** La barra di salvataggio non è un componente shadcn e, per agganciarsi, deve stare fuori dal contenitore con il padding (un margine negativo l'ha rotta): è uno slot della shell. Lo stesso vale per intestazione di pagina, scheda di sezione, riga di elenco con azioni. La regola «solo componenti da `components/ui`» da sola costringerebbe Composer a fermarsi a ogni passo. Proposta per la regola UI: componenti di composizione di progetto in `components/app/`, costruiti solo con componenti di `components/ui` e progettati nei mockup, elencati nella specifica.
- **A1 — Dopo un errore di validazione** la pagina deve portare il campo con errore in vista e dargli il focus: chi preme «Salva» dal fondo non vede altrimenti nulla cambiare, perché banner ed errore sono più in alto. Nel mockup è fatto; va nella specifica come comportamento.
- **A2 — Barra di salvataggio:** su telefono, con i due pulsanti affiancati, occupa 97 px (129 con i pulsanti uno sopra l'altro).
- **A3 — Salvataggio a due livelli:** il foglio di una chiusura ha «Applica» (modifica il modulo) e la pagina ha «Salva modifiche» (salva). Deciso in D7; il testo del foglio lo spiega. Resta un punto da verificare con persone reali.
- **A4 — Orari: deciso `Input type="time"`** (il valore resta `HH:mm` a 24 ore; il formato mostrato segue il dispositivo). Su iOS la tastiera numerica non dà i due punti (comportamento noto, non verificato qui), quindi un campo di testo sarebbe stato scomodo da telefono.
- **A5 — Festività:** l'Admin ha due campi anno («aggiungi» e «rimuovi»); nel mockup ce n'è uno solo, con due pulsanti. Il comportamento resta quello delle funzioni di `lib/systemSettings/`; la checklist di §8.5 («le righe del pulsante festività corrispondono a quelle dell'Admin») resta valida.
- **A6 — Notifiche di conferma:** il wrapper `Sonner` di shadcn importa `next-themes`. Per Orari si usa un avviso in pagina (`Alert`), senza dipendenze. Resta aperto per le altre schermate se serviranno notifiche temporanee.
- **A7 — Orari non configurati:** risolto: avviso informativo e campi vuoti (specifica di Orari, comportamento 13).
- **A8 — Elenco lungo:** con più anni le chiusure crescono di 13 righe all'anno. Il mockup le raggruppa per anno; da verificare con molti dati.
- **A9 — Stati completati (2026-10-10):** salvataggio in corso, errore del server, orari non configurati, errore di caricamento e uscita con modifiche non salvate sono ora nel mockup e nella specifica di Orari. Punto tecnico aperto: intercettare i collegamenti con l'App Router per la conferma di uscita (fallback: solo `beforeunload`).

## 4. Prove sull'elenco prenotazioni (§5.5) e sui piatti (§6.6), 2026-10-10

Prototipo con i componenti reali, dati di esempio, le regole di `ADR-106` e `ADR-107`, due schede (Giorno, Da confermare; struttura confermata da Mirko), foglio per filtri, dettaglio e modulo, conferme, e gli stati di caricamento, errore, vuoto, nessun risultato e anonimizzate. Specifica e screenshot: `schermate/prenotazioni/`.

### Prenotazioni

**Rilievi**
- **P3 — Due elementi interattivi sotto 44 px, mai emersi in Orari perché lì non c'erano**: la scheda di `Tabs` (37 px) e il collegamento della briciola di pane (20 px). Corretti nei componenti (registro D6). La misura va fatta sull'**area cliccabile reale** (si campionano punti intorno al centro con `elementFromPoint`), non solo sul riquadro, escludendo gli elementi coperti dal velo di un foglio o di una finestra.
- **A10 — Singolare e plurale**: nel prototipo comparivano «1 persone» e «1 coperti». Corretti; la regola è nella specifica. Con la «1 chiusura» di Orari è il secondo caso: i testi con numeri vanno sempre al singolare con 1.
- **A11 — Etichetta delle righe anonimizzate**: «Prenotazione anonimizzata» si troncava a 390 px; ora «Dati anonimizzati».
- **A12 — Casella di spunta di base-ui**: l'`id` va sull'input nativo nascosto; nei test si clicca l'etichetta, come fa l'utente.
- **A13 — Assunzioni sul dominio** (modifica solo su Confermata e In attesa, canali dell'inserimento manuale, casella dell'informativa, capienza e soglia nell'inserimento manuale, prenotazioni in attesa con data passata): elencate in `schermate/prenotazioni/spec.md`, sezione 10; **confermate da Mirko il 2026-10-10**.

**Misure**: nessuno scorrimento orizzontale a 390 px; aree di tocco a posto in tutte le viste (giorno, da confermare, filtri, dettaglio, modulo, conferme); mockup statico identico al prototipo a 1280 px (0,0 % in chiaro e in scuro).

### Piatti (elenco e modulo)

Prototipo con elenco per categoria (in ordine per nome), interruttore «Terminato», menu «⋯», filtri, modulo con traduzione a scomparsa, allergeni a scelta multipla, caratteristiche e disponibilità, ricompilazione del menù pubblico, e gli stati di caricamento, errore, vuoto e nessun risultato. Specifica e screenshot: `schermate/piatti/`. Il piatto non ha varianti (`riepilogo-sessione-varianti-porzione-piatto.md`): la quantità vive nella composizione del menu fisso.

- **P4 — Due difetti reali nelle aree di tocco, trovati con una misura più severa**: la casella di spunta aveva un'area di 42 × 42 px, non 44 (l'estensione parte dal bordo interno e il bordo di 1 px per lato ne toglie due), e il collegamento corto della briciola di pane era largo 36 px. Corretti (`-inset-4` per la casella, `-inset-3.5` su tutti i lati per il collegamento; registro D6). La misura ora prova a 21,5 px dal centro nelle quattro direzioni, porta ogni elemento al centro dello schermo e salta quelli coperti dal velo.
- **P5 — Pulsanti di un modulo lungo fuori vista**: nel modulo del piatto «Salva» era a oltre 1800 px da scorrere. Ora il footer del foglio è agganciato in fondo, per tutti i fogli (D9). Con i due pulsanti affiancati occupa 77 px invece di 130. Gli screenshot di Orari (foglio della chiusura) e di Prenotazioni (fogli) sono stati rigenerati.
- **A14 — Stato «Disponibile»**: con quasi tutti i piatti disponibili, un badge scuro su ciascuno nascondeva le eccezioni. Ora Disponibile è un testo discreto (nessun badge su telefono) e il badge resta per Terminato e Disabilitato.
- **A15 — Ordine dei pulsanti su telefono**: nell'intestazione, l'azione principale va sopra la secondaria. L'ordine visivo e quello della tastiera sono invertiti su telefono (accettato).
- **P6 — Assunzione sbagliata sull'ordine dell'elenco**: avevo scritto «ordine di inserimento» senza aver letto `ADR-112`, che prescrive l'ordine per nome (come il menù pubblico). Trovato rileggendo gli ADR su richiesta di Mirko e corretto: categorie e piatti per nome, e ricerca, filtri e ordine nella richiesta, non nel browser.
- **A16 — Reset di «terminato»** (risolto): vale per il servizio in cui è segnato e si azzera tra la fine di quel servizio e l'inizio del successivo; il momento esatto e il caso «segnato fuori da un servizio» restano alla 6.4.
- **A17 — Paginazione, piatto disabilitato nei menù fissi, `soloMenuFissi`** (risolti il 2026-10-10): la paginazione è un debito futuro (con la richiesta già predisposta e l'avviso «Mostrati 100 piatti su N» per non troncare in silenzio); un piatto disabilitato (e anche uno terminato) lo è ovunque; `soloMenuFissi` non si aggiunge ora.
- **A18 — «Tris di nem»** (mix di tre tipi): è un piatto a sé; la quantità di un piatto base in un menu fisso resta `portion`.

**Misure**: nessuno scorrimento orizzontale a 390 px; nessun elemento sotto 44 px in elenco, filtri, modulo, nuovo piatto e conferma; mockup statico identico al prototipo a 1280 px (0,0 % in chiaro e in scuro).

### Shell, accesso e home (§8.2)

Prototipo della shell (barra laterale, menu utente, tema), della home con e senza righe di stato e dello stato senza sezioni, e delle quattro pagine di accesso con tutti gli stati. Specifiche e screenshot: `schermate/shell/` e `schermate/accesso/`.

- **P7 — Il blocco utente mostrava un nome che il dato non ha**: nei primi mockup il menu utente diceva «Marco Rossi», ma la collection `users` ha solo l'email (nessun campo nome, `collections/Users.ts`). Corretto in tutto il design (D12): email e iniziali dall'email. Per questo ho rigenerato mockup statici e screenshot di Orari, Prenotazioni e Piatti.
- **P8 — Testi inglesi nei componenti**: shadcn contiene testi di default in inglese per lo screen reader («Toggle Sidebar», «Close», «breadcrumb», «More», il titolo del pannello «Sidebar»). Con l'interfaccia solo in italiano vanno tradotti: nuova deviazione T1 nel registro e controllo T1 in `ui:check`.
- **A19 — Collegamenti non riconoscibili**: il `Button` di tipo link non è sottolineato finché non ci si passa sopra. Nelle pagine di accesso i collegamenti sono sottolineati sempre.
- **A20 — «Esci» non esiste ancora nel repo**: il menu utente lo prevede; va implementato in 8.2 (strada proposta: logout REST di Payload da un modulo), verificando che chiuda anche la sessione dell'Admin.
- **A21 — Voci del menu con schermata non ancora esistente**: nascoste finché la rotta non esiste (flag `enabled` nella tabella di navigazione), per non portare a un 404.
- **Scelte confermate da Mirko il 2026-10-10** per shell e accesso: solo email e iniziali nel blocco utente con il ruolo sotto «Area App»; utente senza accesso all'App verso `/app/login?authFailed=1` e sezione non consentita verso `/app`; «Accedi con Google» principale e «Accedi» con email secondario, scheda centrata, collegamenti sottolineati; titolo «Area App» finché nessuna riga di stato è attiva; ordine delle schede Prenotazioni, Menù, Orari; voci non ancora abilitate nascoste.
- **Verificato**: i marcatori D6 e T1 di `ui:check` passano sui venti componenti modificati del prototipo e falliscono su quelli stock; mockup statici identici ai prototipi a 1280 px (0,0 % in chiaro e in scuro) per tutte le sei schermate; nessuno scorrimento orizzontale e nessun elemento sotto 44 px nelle dieci pagine di accesso.

## 5. Verifiche tecniche fatte in questa sessione

- Sorgenti dei componenti: repository `shadcn-ui/ui`, commit `2d3f1cd` (2026-10-09), cartelle `apps/v4/registry/bases/base/ui` e `styles/style-nova.css`. **`base-nova` poggia su `@base-ui/react`, non su Radix.** Le classi `cn-*` dei componenti si risolvono con `style-nova.css`: 422 blocchi, tutti `@apply` semplici.
- Mockup costruiti con i componenti reali (non con HTML che li imita) e i token di `app-ui.css`; Playwright e Chromium funzionano sui componenti shadcn veri (screenshot a 390 e 1280 px, misure di altezza e di scorrimento orizzontale a 360 px).
- **Confronto visivo**: su telefono due acquisizioni a pagina intera dello stesso prototipo differiscono del 6,6 % (rumore di rendering dell'emulazione mobile); su notebook la differenza è 0,0 %. Il confronto con le implementazioni si fa quindi con misure geometriche (`getBoundingClientRect`, dimensioni, posizioni), non con la differenza di pixel; le misure del mockup statico coincidono con quelle del prototipo al decimo di pixel.
- Nessuno scorrimento orizzontale a 360 px (con tocco simulato) su elenco prenotazioni nel layout scelto, filtri a foglio e home «Oggi». Da ripetere sulle schermate vere.

## 6. Punti aperti

- Verifica delle sottoaree del Menù con `fase-6-menu-digitale.md`; nome definitivo di «Elenco».
- Filtro per data e filtri di ogni lista (specifica per schermata).
- Stato vuoto della home per un utente senza sezioni.
- Testi definitivi delle righe di stato della home (con le sottofasi 5.5, 6.6, 8.5).
- Tabelle su tablet touch: righe con azioni a 44 px, quindi meno righe visibili che con il mouse. Da verificare nelle schermate di dettaglio.
- Selettore di data (celle del calendario a 44 px su touch): da adattare quando si installa.
- Se la scelta del tema debba valere per account invece che per dispositivo.
- Componenti di composizione di progetto (P2): la convenzione è fissata dalla regola UI (`components/app/`, solo con componenti di `components/ui`, dichiarati nella sezione 8 di ogni specifica); l'elenco completo si forma con le schermate.
- Come gestire il tema rispetto a `next-themes` e al `Toaster` (A6).
- **Debito: paginazione delle liste oltre 100 voci** (oggi i piatti sono 44). Predisposta: ricerca, filtri e ordine nella richiesta, avviso di elenco parziale; da aggiungere «Mostra altri piatti» quando serve.
- **Debito: casella «solo per menu fisso» sui piatti** (`soloMenuFissi`): migrazione additiva, da aggiungere quando il frontend pubblico la leggerà e se esisterà un piatto che non va alla carta.
- **Uscita («Esci»)** da implementare in 8.2, con la verifica sulla sessione dell'Admin.
- **Utente già autenticato su `/app/login`**: oggi vede la pagina; si può reindirizzare a `/app`. Non deciso.
- **Percorsi delle sottovoci del menu**: da fissare con le sottofasi 5.5 e 6.6.

## 7. Impatto sul piano

I tre «passaggi da confermare» di `fase-8-shell-app.md` §8.2 sono risolti da D1, D2 e D3. Questo documento non modifica la fase 8: la voce di §8.2 e la sua checklist (navigazione e home verificate su telefono e desktop per ogni ruolo) vanno allineate quando si prepara l'implementazione. Aggiunte di cui la 8.2 dovrà tener conto: tema (D4), dimensioni di tocco (D6), slot della barra di salvataggio nella shell (D7), larghezza della colonna (D8) il modello degli elenchi di record (D9) e la gestione delle due lingue nei moduli (D10).

## 8. Prossimi passi

**Fatto il 2026-10-10**
1. Prove su tre schermate, confezionate in `schermate/orari/`, `schermate/prenotazioni/` e `schermate/piatti/`.
2. Regola UI di progetto `.cursor/rules/ui/01-ui-app-invarianti.mdc` (`stato: da validare`), `modello-specifica-schermata.md`, `scripts/ui-check.mjs`, `patch-app-ui-css.md`, `installazione-componenti-ui.md`.
3. Pacchetti di **shell e home** (`schermate/shell/`) e di **accesso** (`schermate/accesso/`) per la 8.2.

**Da fare**
4. Le altre schermate quando arriva la loro fase: Eccezioni giorno e Impostazioni (5.x); Vini, Bevande, Distillati, Menù fissi, Servizi, Giorni speciali e Messaggio globale (6.6).
5. Verifica visiva delle implementazioni di Cursor a 390 e 1280 px, in tutti e due i temi, con i controlli comuni del modello di specifica.
