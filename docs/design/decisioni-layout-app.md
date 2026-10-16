# Decisioni di design — Area App `(app)`

**Stato**: decisioni confermate da Mirko il 2026-10-10. Precede la regola UI di progetto, il modello di specifica per schermata e lo script `ui:check` (non ancora scritti).

**Riferimenti**: `docs/piano-sviluppo/fase-8-shell-app.md` (§8.2 e §8.5), `ADR-102`, `ADR-113`, `app/(app)/app-ui.css`, `components.json`.

**Perimetro**: solo il design UI/UX dell'Area App. L'Admin resta quello standard di Payload e non si disegna. La revisione del codice sta in un'altra chat. Il livello presentazionale lo scrive Cursor da mockup approvati; qui si decidono le regole che Cursor deve rispettare.

---

## 0. Requisito di base

Ogni funzione dell'App (leggere, modificare, aggiungere, cancellare) deve poter essere usata sia da telefono sia da notebook. Non esistono funzioni solo desktop o solo telefono. Cambia la forma, non l'insieme delle azioni. Dove un ADR prevede una cancellazione «soft» (es. categorie dei menù fissi: disabilita), il pulsante si chiama «Disabilita», ma l'azione c'è su entrambi i dispositivi. Dal 2026-10-14 il manager può anche eliminare sette tipi di contenuto del menù (D14): il cestino c'è su telefono e su notebook.

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
| Menù | Piatti, Vini, Bevande, Distillati, Menù fissi, Servizi, Giorni speciali, Messaggio globale |
| Orari | Orari |
| Prenotazioni | Elenco, Eccezioni giorno, Impostazioni |

- **Telefono** (sotto 768 px): barra in alto con pulsante del menu, breadcrumb; il menu si apre in un pannello laterale (la `Sidebar` usa un `Sheet` da 18 rem). **Notebook** (da 768 px): barra laterale fissa da 16 rem, collassabile.
- Il passaggio telefono/schermo largo è **768 px, fisso nella `Sidebar` di shadcn**. Un tablet largo meno di 768 px (es. iPad mini in verticale, 744) vede il layout da telefono; da 768 px in su (es. iPad a 820) vede quello da notebook.
- Il blocco «Area App» in cima alla barra è il collegamento alla home (`/app`).
- Variante della barra: quella standard (non inset né floating). La variante è una proprietà del componente e si può cambiare in seguito senza toccare le schermate.
- **Nome della sottoarea «Menù fissi»** (non «Menù») per evitare la voce doppia.
- **Menù: otto voci** (Mirko, 2026-10-14, dopo la prova su prototipo): le cinque originali nell'ordine di D1 più **Servizi, Giorni speciali e Messaggio globale**, tutte visibili, nessuna a scomparsa e nessun sottogruppo (i gruppi restano tre). Icone: Piatti `utensils-crossed`, Vini `wine`, Bevande `cup-soda`, **Menù fissi `book-open`** (nel codice oggi `list`); **Distillati `martini`** (non più `beer`: la birra è una Bevanda); Servizi `concierge-bell`; Giorni speciali `calendar-heart`; Messaggio globale `megaphone` (presenti in `lucide-react`; vanno aggiunte ad `AppNavIconKey`). Percorsi proposti: `/app/menu/services`, `/app/menu/special-days`, `/app/menu/message`, da confermare con la 6.6. Le **categorie dei menù fissi** non sono una voce: sono la scheda «Categorie» dentro «Menù fissi». **Misura** (prototipo, 390 px): il pannello ha 716 px di contenuto; a 844 px di altezza entra tutto, a 667 px le voci scorrono e restano fissi il blocco «Area App» in cima e il blocco utente. Non provato su un iPhone vero. La descrizione della scheda «Menù» in home è «Piatti, vini, bevande, menù fissi e altro» (integrazione, 2026-10-15). **Voce attiva e briciole** usano il percorso più lungo che combacia (`schermate/integrazione/spec.md`).
- Le sottoaree di Prenotazioni sono quelle di `ADR-113`/`fase-8`; «Elenco» è provvisorio.
- Le voci mostrate passano da `canAccessSection(user, section)`.

### D2 — Contenuto di `/app`: home «Oggi»

Una scheda per ogni sezione consentita (Prenotazioni, Menù, Orari): icona, titolo, descrizione. Ogni scheda ha **una riga di stato opzionale, predisposta ma non attiva**.

**Regola di attivazione**: finché la query di una riga non esiste, la riga non compare e la scheda è quella semplice (titolo e descrizione). Quando la query è pronta si attiva la riga, senza cambiare la UI né il layout.

| Sezione | Riga di stato (testo di esempio, da confermare nella specifica) | Dati | Si attiva con |
|---|---|---|---|
| Prenotazioni | «Oggi N coperti · prossima alle HH:mm» | Prenotazioni del giorno | Sottofase 5.5 |
| Menù | «{N} piatti terminati» / «Nessun piatto terminato» (scelta di Mirko, 2026-10-15: contano i `soldOut`, non i disabilitati) | Piatti con `soldOut` vero, letti con la sessione dell'utente | Sottofase 6.6 |
| Orari | «Oggi: HH:mm–HH:mm e HH:mm–HH:mm» | `impostazioni-sistema`, tab Orari e chiusure (campi della 7.2), letta con la sessione dell'utente | Sottofase 8.5 |

**Cautela sulla riga Orari**: finché non esistono le Eccezioni giorno (chiusure per data, in Prenotazioni, `ADR-107` §2) la riga dice solo gli **orari previsti**, mai «aperto» o «chiuso». Dire «aperto» ignorando una chiusura per data sarebbe falso.

**Stati di ogni riga** (da definire nei dettagli nella specifica): caricamento con `Skeleton` alla stessa altezza della riga; errore → la riga non compare e la scheda resta navigabile; nessun dato → testo esplicito.

**Utente senza nessuna sezione consentita**: stato vuoto, da specificare.

### D3 — Collegamento a `/admin`

Voce **«Vai all'Admin»** nel menu utente (quello che si apre dal blocco con l'email in fondo alla barra), con icona di collegamento esterno. Visibile solo se `canAccessAdminPanel(user)`. **Si apre in una nuova scheda** (`target="_blank"`, `rel="noopener"`; scelta di Mirko, 2026-10-11): l'App resta aperta con quello che c'è dentro (nessuna conferma di uscita con modifiche non salvate) e l'Admin è un'altra applicazione. Motivo: l'Admin è pensato soprattutto per l'uso da web e i contenuti dei siti, dopo l'inserimento iniziale, si aggiornano di rado.

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
| `sidebar` | Nel `SheetContent` mobile: `data-[side=left]:w-(--sidebar-width) data-[side=left]:sm:max-w-(--sidebar-width)` (oltre a `w-(--sidebar-width)` e `--sidebar-width: 18rem`) | Il `sheet` impone al lato sinistro `w-3/4` e `sm:max-w-sm` (384 px): il pannello menu resta 18 rem (288 px) su tutta la fascia mobile |
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
- **Home `/app`** (A26, deciso il 2026-10-12): colonna centrata larga al massimo `max-w-5xl`, come le pagine con tabelle, così su schermi molto larghi le schede non si allargano oltre 1024 px. Su telefono e fino a 1024 px non cambia nulla.

### D9 — Elenchi di record: ogni azione si salva subito

Il salvataggio con barra unica (D7) vale per le **pagine-modulo** (Orari, impostazioni). Per gli **elenchi di record** (prenotazioni, e in seguito piatti e simili) ogni azione si salva subito.

- **Dettaglio e modulo in un foglio** (dal basso sotto 768 px, da destra da 768 px): un tocco sulla riga, o il nome su notebook, apre il dettaglio con le azioni dello stato; «Modifica» e «Nuova» usano lo stesso modulo nel foglio, con «Salva» e «Annulla».
- **Azioni irreversibili** (cancella, rifiuta, segna no-show, anonimizza): finestra di conferma con la frase «Non si può annullare.» e, dove previsto, un motivo facoltativo. Le azioni positive (conferma) sono immediate.
- **Esito**: avviso in pagina con il nome e la data; resta fino alla prossima azione.
- **Errore dell'azione**: avviso rosso nel punto da cui è partita (finestra o foglio), nessuna modifica, si può riprovare. Mentre si salva: pulsanti disabilitati, `Spinner`, «Salvataggio…».
- **Scorciatoie su notebook**: menu «⋯» di riga con le stesse azioni del dettaglio. Vale per le prenotazioni, che hanno tre o più azioni per stato; per gli elenchi di contenuto del menù vale D13.
- **Cose che richiedono attenzione** (es. prenotazioni da confermare) hanno una scheda propria con il conteggio e le azioni in vista, invece di restare sparse nell'elenco.
- **Righe non attive** attenuate e escluse dai totali; **righe anonimizzate** con «Dati anonimizzati» in corsivo e senza azioni.
- **Ordine delle liste**: per nome, come il contratto del menù pubblico (`ADR-112` §1), finché non esiste un campo di ordinamento esplicito; ricerca, filtri e ordine si applicano nella richiesta, non nel browser.
- **Azioni rapide dall'elenco** (piatti: «Terminato» con un interruttore, abilita/disabilita con l'occhio, D13): un tocco, effetto immediato, avviso con il testo di che cosa succede sul menù pubblico.
- **Foglio con modulo lungo**: i pulsanti restano agganciati in fondo (bordo superiore, sfondo pieno) e, se sono due, affiancati (77 px di altezza invece di 130). Vale per tutti i fogli (`SheetFooter`).
- **Azione di pagina principale in alto su telefono**: nelle intestazioni con più pulsanti, «Nuovo …» sta sopra l'azione secondaria (su notebook l'azione principale è a destra).

### D10 — Due lingue nei moduli: italiano sempre in vista, inglese a scomparsa

Per i campi localizzati (oggi nome e descrizione dei piatti; poi vini, bevande, menù fissi) il modulo mostra sempre i campi italiani, obbligatori; sotto, una riga «Traduzione inglese (facoltativa)» con un badge «Manca» o «Presente» che si apre per scrivere in inglese. Si apre da sola se la traduzione esiste. Se l'inglese resta vuoto, il menù pubblico usa l'italiano (ripiego di `fase-6` §6.6). Scelta di Mirko tra tre alternative (schede, inglese a scomparsa, tutti i campi in vista).

### D11 — Pagine di accesso

Le quattro pagine (`login`, `forgot`, `reset`, `verify`) restano **fuori dalla shell** e non cambiano flussi, rotte, campi né messaggi (invariante dell'autenticazione). Disegno: colonna centrata larga al massimo `max-w-sm`; sopra, un quadrato con l'icona dell'App, il titolo e la descrizione; una scheda con avvisi e modulo; sotto, i collegamenti sottolineati. **«Accedi con Google» è il pulsante principale** (Google è l'accesso principale; l'accesso con email e password potrà essere tolto in futuro) e «Accedi» con email il secondario. I moduli restano form nativi con POST (nessuno stato «invio in corso»). I messaggi sono le costanti di `lib/auth/**`. Il tema segue la scelta del dispositivo anche qui. Specifica in `schermate/accesso/`.

### D12 — Utente e ruolo nella shell

L'utente nella barra laterale si mostra con l'**email** e le **iniziali** ricavate dall'email: la collection `users` non ha un campo nome. Il ruolo sta sotto «Area App» in cima alla barra: «Super-admin», «Admin» o «Manager» (con `adminRole` che prevale su `appRole`). Voci del menu non ancora abilitate (la cui pagina non esiste) non si mostrano: nella 8.2 sono tre (Piatti, Orari, Elenco), ciascuna con una pagina segnaposto. Specifica in `schermate/shell/`.

### D13 — Azioni di riga negli elenchi di contenuto: icone visibili, niente «⋯»

Deciso da Mirko il 2026-10-14, dopo aver visto le bozze di Piatti, Vini e Categorie dei menù fissi. Vale per gli elenchi di contenuto del menù (piatti, vini, distillati, bevande, servizi, categorie dei menù fissi, menù fissi, giorni speciali); le prenotazioni restano con il menu «⋯» di D9, perché hanno tre o più azioni per stato.

- **Modifica**: sempre la matita (`Pencil`), come nelle chiusure annuali di Orari. Il nome non è un collegamento e la scheda non è tappabile: un solo modo per aprire il modulo.
- **Abilita e disabilita**: dove la riga ha già un interruttore di disponibilità (vini, distillati, bevande, servizi, giorni speciali) è l'**interruttore** l'azione (etichetta «Disponibile»; per le categorie dei menù fissi «Attiva»; per i giorni speciali «Attivo») e non c'è un'altra icona. Dove l'interruttore ha un altro significato (piatti: «Terminato») ci sono l'**occhio barrato** («Disabilita {nome}») e l'occhio aperto («Abilita {nome}», sulle righe disabilitate). L'icona indica l'azione, non lo stato; il nome accessibile la dice per esteso.
- **Elimina**: il **cestino** (`Trash2`) nelle righe dei sette tipi di contenuto di D14, con la conferma di D14. Non c'è sulle categorie dei menù fissi, che si disabilitano soltanto. Il cestino è un'azione diversa dall'occhio: l'occhio toglie dal menù e si può rimettere, il cestino cancella.
- **Tocco**: ogni icona è un `Button (ghost, icon)` da 44 × 44 px con tocco (D6); misurato nel prototipo a 390 px.
- **Costo accettato**: nelle schede dei piatti su telefono, con interruttore, matita, occhio e cestino, il nome ha circa 137 px su 358 (misurato): i nomi lunghi si troncano con i puntini e il nome intero si legge nel modulo. Con interruttore, matita e cestino (vini e simili) i nomi hanno circa 172 px.
- **Scelta tra le alternative**: tra quattro controlli e tre (occhio spostato nel modulo, nome a 181 px) Mirko ha scelto i quattro.
- **Quando il «⋯» è giusto**: tre o più azioni, o azioni rare. Nessuna schermata del menù lo richiede.

### D14 — Cancellazione dei contenuti del menù da parte del manager

Deciso da Mirko il 2026-10-14. Emenda `ADR-113` §3 e `ADR-108` §9 («cancellazione sempre soft»); vedi gli emendamenti negli ADR.

- **Il manager elimina**: piatti, vini, distillati, bevande, servizi, menù fissi e giorni speciali. **Non** elimina le categorie dei menù fissi (il menu fisso ne ha una obbligatoria) né alcuna tassonomia (categorie dei piatti, allergeni, tipologie, paesi, regioni, denominazioni, classificazioni): restano all'admin, nell'Admin. Disabilitare resta possibile per tutti.
- **Cosa succede alle voci collegate** (verificato nelle migrazioni; `ADR-108`, nota del 2026-10-13): vini, distillati e bevande non sono usati da nessuno. Un **servizio** eliminato sparisce in silenzio dai menù fissi; un **menu fisso** eliminato sparisce dai giorni speciali, che possono restare senza menù (`ADR-112`: un giorno speciale senza menù attivi non si applica); un **giorno speciale** non è usato da nessuno. Per queste due voci vale il cascade accettato per l'admin il 2026-10-13 e la finestra di conferma lo dice prima di «Non si può annullare.» («Verrà tolto anche da {N} menù fissi: {nomi}. Non si può annullare.», nomi al massimo tre, poi «e altri {N}»; per i servizi il testo è in `servizi/spec.md`, per i menù fissi («… dai giorni speciali: {date}.») si fissa con la loro schermata).
- **Il piatto è un caso a parte**: se è in un menù fisso il database rifiuta la cancellazione (`fixed_menus_dishes.dish_id` è `NOT NULL` con `ON DELETE set null`). L'App lo sa prima di mostrare la finestra: legge i menù fissi che contengono il piatto e, se ce n'è uno, mostra «Non si può eliminare {nome}» con l'elenco e il solo pulsante «Chiudi». Il rifiuto del database resta come rete di sicurezza (messaggio generico di errore).
- **Conferma** (D9, azione irreversibile): «Eliminare {nome}?», «Non si può annullare.», «Indietro» ed «Elimina» (`AlertDialog`). La finestra non suggerisce di disabilitare: l'occhio è nella riga.
- **Registro attività**: ogni cancellazione di queste collection lascia una riga (`eventType: delete`, `area`, collection, identificativo, nome e numero di riferimenti, nessun dato personale), anche se fatta dall'Admin, perché è un hook di collection (`ADR-115`, nota del 2026-10-14). Nessuna migrazione: il valore `delete` esiste. L'avviso nell'Admin di `po-13` resta non pianificato.
- **Dopo l'eliminazione**: avviso «{Tipo} eliminato» con il richiamo alla ricompilazione; `disponibilita.json` si riscrive subito.

### D15 — Campi con valori uniformi: a scelta o validati, e imposti dal server

Deciso da Mirko il 2026-10-14, per i vini, i distillati e le bevande. **Distillati**: grado a scelta da 30% a 45% e invecchiamento a scelta (5, 7, 10, 12, 18, 24 anni); la capacità non si gestisce nell'App (i distillati si servono solo al bicchiere, il prezzo è unico). **Bevande**: capacità a scelta (25, 33, 50, 75 cl); grado a scelta da 3% a 12% a passi di 0,5 (prima proposto come campo numerico; Mirko ha chiesto il select per uniformarlo al resto); allergeni non gestiti nell'App. **Il grado è quindi un select in tutte e tre le schermate**: vini 5%–20% a passi di 0,5, distillati 30%–45% a passi di 1, bevande 3%–12% a passi di 0,5; l'unico campo validato è l'anno dei vini.

- **Insiemi chiusi → select.** Capacità e grado sono elenchi. Capacità dei vini: 25, 33, 37,5, 50, 75 e 150 cl. Grado: da 5% a 20% a passi di 0,5 («13%», «13,5%»). Il campo facoltativo ha come prima voce «Non indicata» o «Non indicato».
- **Valori continui → campo validato.** L'anno è un campo numerico (solo cifre, quattro al massimo) tra 1900 e l'anno corrente, con la casella «Senza annata (NV)» che salva «NV». Un select con 78 voci sarebbe lungo da scorrere su telefono e non dà più uniformità di una validazione.
- **Il server impone la forma**: funzioni `validate` sui campi `year`, `volume`, `abv` (il tipo resta testo: contratto congelato in 6.2, nessuna migrazione), quindi vale anche per Admin e REST. Un valore salvato e non modificato non blocca il salvataggio (da provare in Parte A).
- **L'import** normalizza anche anno e grado (oggi solo la capacità) e il report a secco elenca le forme distinte, per fissare gli elenchi sui dati reali prima dell'import di produzione.
- **Valore salvato fuori elenco**: resta visibile e salvabile finché non lo si cambia.
- **Ogni select facoltativo** (anche regione, denominazione e classificazione) ha come prima voce «Nessuna …» o «Non indicato» per svuotarlo: senza, un valore scelto non si poteva più togliere.

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

Prototipo con elenco per categoria (in ordine per nome), interruttore «Terminato», menu «⋯», filtri, modulo con traduzione a scomparsa, allergeni a scelta multipla, caratteristiche e disponibilità, ricompilazione del menù pubblico, e gli stati di caricamento, errore, vuoto e nessun risultato. Specifica e screenshot: `schermate/piatti/`. Il piatto non ha varianti (`riepilogo-sessione-varianti-porzione-piatto.md`): la quantità vive nella composizione del menu fisso. **Rivisto il 2026-10-14**: azioni di riga in D13 e D14 (matita, occhio, cestino al posto del menu «⋯»), reset di «terminato» in A16.

- **P4 — Due difetti reali nelle aree di tocco, trovati con una misura più severa**: la casella di spunta aveva un'area di 42 × 42 px, non 44 (l'estensione parte dal bordo interno e il bordo di 1 px per lato ne toglie due), e il collegamento corto della briciola di pane era largo 36 px. Corretti (`-inset-4` per la casella, `-inset-3.5` su tutti i lati per il collegamento; registro D6). La misura ora prova a 21,5 px dal centro nelle quattro direzioni, porta ogni elemento al centro dello schermo e salta quelli coperti dal velo.
- **P5 — Pulsanti di un modulo lungo fuori vista**: nel modulo del piatto «Salva» era a oltre 1800 px da scorrere. Ora il footer del foglio è agganciato in fondo, per tutti i fogli (D9). Con i due pulsanti affiancati occupa 77 px invece di 130. Gli screenshot di Orari (foglio della chiusura) e di Prenotazioni (fogli) sono stati rigenerati.
- **A14 — Stato «Disponibile»**: con quasi tutti i piatti disponibili, un badge scuro su ciascuno nascondeva le eccezioni. Ora Disponibile è un testo discreto (nessun badge su telefono) e il badge resta per Terminato e Disabilitato.
- **A15 — Ordine dei pulsanti su telefono**: nell'intestazione, l'azione principale va sopra la secondaria. L'ordine visivo e quello della tastiera sono invertiti su telefono (accettato).
- **P6 — Assunzione sbagliata sull'ordine dell'elenco**: avevo scritto «ordine di inserimento» senza aver letto `ADR-112`, che prescrive l'ordine per nome (come il menù pubblico). Trovato rileggendo gli ADR su richiesta di Mirko e corretto: categorie e piatti per nome, e ricerca, filtri e ordine nella richiesta, non nel browser.
- **A16 — Reset di «terminato»** (riscritto il 2026-10-14 dopo la decisione di Mirko del 2026-10-12): «terminato» si azzera all'**inizio del servizio successivo** (`startTime` di pranzo e cena in Impostazioni di sistema; `fase-6` §6.4). Un «terminato» segnato tra i due servizi, o la sera per il pranzo del giorno dopo, sparisce all'apertura: conseguenza accettata, «da verificare con l'uso se cambiare». Il design la rende visibile con la riga «fino all’apertura della cena» (senza l'orario, scelta di Mirko del 2026-10-14), calcolata dagli orari. La versione del 2026-10-10 («si azzera tra la fine di quel servizio e l'inizio del successivo») è superata.
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
- **P9 — Mancava la pagina segnaposto delle sezioni**: nella 8.2 nessuna schermata di sezione esiste, ma il piano prevede già le rotte `/app/menu`, `/app/hours`, `/app/reservations` protette da `canAccessSection`. Con la regola «le voci senza schermata sono nascoste» il menu della 8.2 sarebbe stato vuoto e la guardia per URL non verificabile. Trovato scrivendo il prompt per Cursor. Aggiunto lo stato «segnaposto» (titolo e «Questa sezione sarà disponibile a breve.») e, nella 8.2, un menu di tre voci. Rigenerati mockup statico e screenshot della shell.
- **A22 — Descrizioni delle schede della home**: parlano anche di sottovoci non ancora abilitate; restano quelle definitive.
- **Verificato**: i marcatori D6 e T1 di `ui:check` passano sui venti componenti modificati del prototipo e falliscono su quelli stock; mockup statici identici ai prototipi a 1280 px (0,0 % in chiaro e in scuro) per tutte le sei schermate; nessuno scorrimento orizzontale e nessun elemento sotto 44 px nelle dieci pagine di accesso.

### Stato dei rilievi al 2026-10-12 (fine della 8.5)

| Rilievo | Stato |
|---|---|
| P10 (`LoginFailureNotice` serve all'Admin) | Chiuso: specifica corretta |
| P11 (icona, spazi e padding dell'accesso) | Chiuso, verificato su build di produzione (160 su 160) e su Cloud Run |
| P12 (reset con link scaduto: avviso e modulo) | Chiuso e verificato |
| P13 («Esci» verso `0.0.0.0`) | Chiuso: reindirizzamento relativo; verificato da te su Cloud Run |
| P14 (cartella del prototipo nel repo) | Chiuso: nel repo c'è lo zip |
| P15 (pannello del menu su telefono) | Chiuso: 288 px misurati a 767, 430 e 390 px |
| P16 (barra di salvataggio a 97 px) | Chiuso (8.5) |
| P17 (chiavi delle chiusure univoche) | Chiuso (8.5) |
| P18 (slot della barra sempre disegnato) | Chiuso (8.5) |
| P19 (campi orario su iPhone) | **Chiuso il 2026-10-12**: corretto in `77f23a2` e provato da Mirko su iPhone reale (Orari online, campi del ristorante e del B&B). Playwright (WebKit 4 su 4) da solo non l'avrebbe dimostrato |
| A23 (tema «Sistema» senza ascolto) | Chiuso, verificato |
| A24 (menu utente diverso dal mockup) | **Chiuso il 2026-10-12**: allineato al mockup in `77f23a2`; verificato negli screenshot a 390 e a 1280 px (nessuna riga utente, icone sole, luna e schermo, un solo separatore). Le due icone di «Vai all'Admin»: **provate da Mirko il 2026-10-12, OK** (con un utente che ha accesso all'Admin) |
| A25 (CHANGELOG sul tema) | Chiuso |
| A26 (home senza larghezza massima) | **Chiuso il 2026-10-12**: verificato a 1920 px (colonna di 1024 px centrata nell'area del contenuto) |
| A27 («Torna al sito») | **Chiuso il 2026-10-12**: `login-testi` e `login-link-destinazioni` 16 su 16, il collegamento non c'è più |
| A28–A32 (icona «salvato», ordine dei pulsanti del foglio, «Rimuovi» primario, titolo e «Riprova» nell'errore di caricamento) | Chiusi e verificati |

**P19 — I campi orario escono dalla scheda su iPhone** (rilievo di Mirko su dispositivo reale, 2026-10-12, schermata di Orari in scuro). I due campi «Inizio» e «Fine» di Pranzo e di Cena, e così i due del B&B, si sovrappongono e quello di destra esce dalla scheda. Non si vede in Chromium né nel WebKit di Playwright. Ipotesi, non verificata su iPhone: su iOS `<input type="time">` ha una larghezza intrinseca grande; l'elemento della griglia (`Field` dentro `grid grid-cols-2`) ha `min-width: auto` e non si restringe sotto quella larghezza, anche se la colonna è `minmax(0, 1fr)`. Correzione proposta: `min-w-0` sui `Field` della griglia, e in `app-ui.css` una regola per `input[type="time"]` con `appearance: none`, `min-width: 0`, `max-width: 100%` e testo allineato a sinistra. Se non basta, una sola colonna sotto `sm`. Va riprovata da Mirko su iPhone (livello 3): il lanciatore non vede questa classe di difetti. **Esito (2026-10-12)**: Mirko ha provato la correzione su iPhone reale, online, con esito positivo; il rilievo è chiuso.

### Verifica visiva della 8.2 (2026-10-11)

Screenshot di Mirko sulla versione su Cloud Run (revisione `vma-vd-backend-backoffice-git-00086-ndp`, commit `27227a7`), Safari su Mac in modalità responsive (iPhone) e in finestra normale, più i log del server. Confronto a coppie con i PNG di `schermate/shell/` e `schermate/accesso/`, e lettura del codice (classi dei componenti, sorgente di Payload 3.90.2). L'app non è stata eseguita nella chat di design.

**Cosa gli screenshot non dimostrano**
- **D6 (aree di tocco)**: i controlli risultano alti circa 32 px, il valore che hanno senza `pointer-coarse:`. Non è provato che la modalità responsive di Safari su Mac non simuli il puntatore touch, ma il risultato è quello atteso senza di esso. Né conferma né smentisce D6: serve un iPhone vero.
- **Larghezza «1280»**: le finestre sono molto più larghe di 1280 px (stima dalla scheda di accesso, larga al massimo 384 px ma resa circa 217 px nell'immagine: circa 2300 px di larghezza CSS). D8 e il passaggio a 768 px non sono verificati a 1280.
- **Non verificati**: assenza di lampo del tema, console del browser (i log caricati sono del server), riga `logout` nel registro attività, sessione dell'Admin dopo «Esci».
- **Screenshot mancanti**: segnaposto `/app/menu`, forgot «inviata», verify riuscita, menu aperto scuro a 1280.

**Verificato in linea con il mockup**: login (chiaro e scuro, 390 e 1280), con errore e con «Password aggiornata»; forgot; reset iniziale e senza token; verify con e senza token; home e menu a 390 (chiaro e scuro); home e menu utente a 1280. Struttura, testi, ordine, ruolo e iniziali sono quelli previsti. I log del server non hanno errori né avvisi (solo righe `INFO` e l'avvio di Next).

**Da correggere (P)**
- **P10 — Errore nella specifica dell'accesso**: dava `LoginFailureNotice` da eliminare, ma lo importano `AdminGoogleLoginBefore.tsx` e `app/(payload)/admin/login/local/page.tsx` (Admin). Cursor lo ha tenuto, giustamente. Specifica corretta.
- **P11 — `AppAuthPage` si discosta dal mockup** (`components/app/auth/app-auth-page.tsx` contro `prototipo-sorgenti/src/accesso.tsx`): icona `size-12` con glifo `size-6` invece di `size-10` e `size-5`; `gap-6` invece di `gap-4` tra intestazione, scheda e collegamenti; `CardContent` con `pt-6` che si somma a `--card-spacing` (16 px): 40 px sopra il primo elemento della scheda invece di 16. Si vede in tutte le pagine di accesso (circa 22 px in più sopra «Accedi con Google»). Le misure sono ora nella specifica dell'accesso (sezione 8).
- **P12 — Reset: con `resetFailed=1` e token il modulo sparisce.** Nel codice la pagina mostra solo l'avviso; la versione precedente alla 8.2 (`de5a7fd^`) e la specifica (`390-reset-fallito-chiaro.png`) mostrano avviso e modulo. `resetFailed=1` con il token non vuol dire solo «link scaduto»: `lib/auth/localEmail/resetPasswordEndpoint.ts` reindirizza così anche quando la password non rispetta la regola (maiuscola, minuscola, cifra) e il link è ancora valido. Senza modulo, chi sbaglia la password non può riprovare. Esito: è una regressione, non una scelta di design (D11: i flussi non cambiano); si ripristina il modulo, come nella specifica. Osservazione, da non cambiare qui: il messaggio generico di `lib/auth` dice «link non valido o scaduto» anche per una password debole.
- **P13 — «Esci» porta a `https://0.0.0.0:8080/app/login` su Cloud Run.** Il server risponde 303 senza errori (due POST nei log) e il cookie viene scaduto (dopo il POST, `/app` risponde 307 al login). Causa probabile, dal codice e non provata: `new URL('/app/login', request.url)` in `app/(app)/app/logout/route.ts`; dietro Cloud Run `request.url` ha l'host interno del contenitore (Next ascolta su `0.0.0.0:8080`, come dicono i log). Correzione: reindirizzamento relativo (`Location: /app/login`, come `lib/auth/localEmail/resetPasswordEndpoint.ts`) oppure URL costruito da `getAppPublicURL()`; mai da `request.url`. Prova: su Cloud Run «Esci» deve portare a `/app/login` sul dominio pubblico.
- **P14 — La cartella `docs/design/prototipo-sorgenti/` nel repo** (commit `27227a7`) sembra lo zip estratto invece che committato. `tsconfig.json` include `**/*.tsx` senza esclusioni e `eslint.config.mjs` non ignora `docs`; i sorgenti importano da `@/components/ui/` dieci componenti che nell'app non esistono (`table`, `tabs`, `select`, `switch`, `checkbox`, `badge`, `textarea`, `toggle`, `toggle-group`, `alert-dialog`). Quindi `pnpm typecheck` e `pnpm lint` probabilmente falliscono (non provato: dipendenze non installate). Cloud Run non è toccato, perché `.dockerignore` esclude `docs`. Correzione: togliere la cartella e committare `docs/design/prototipo-sorgenti.zip` (nello zip di consegna), come dicono i README.

**Non bloccanti (A)**
- **A23 — Tema «Sistema» senza ascolto**: `matchMedia` è letto una volta sola; se il sistema passa a scuro a pagina aperta, l'App non segue finché non si ricarica.
- **A24 — Menu utente diverso dal mockup, senza cambi di comportamento**: intestazione con avatar ed email in più (l'email è già nel blocco sotto), voci del tema senza icone (sole, luna, schermo), «Vai all'Admin» con una sola icona (D3 la prevede così; il mockup ne ha due), un separatore in più prima di «Esci». Da decidere se allineare il codice o il mockup.
- **A25 — CHANGELOG e codice non coincidono**: il CHANGELOG dice `next/script`, il layout usa un `<script>` in `<head>` (tecnica standard anti-lampo). Correggere il CHANGELOG.
- **A26 — Home senza larghezza massima** su schermi molto larghi: non è specificata.
- **A27 — «Torna al sito» porta a `/`**: dai log risulta una pagina che carica `next.svg` e `vercel.svg`, cioè probabilmente quella di esempio di Next (non vista). Fuori dal design.

### Seconda verifica della 8.2: lanciatore automatico v2.0.0 (2026-10-11)

Esecuzione di `pnpm ui:verify` (lanciatore 2.0.0, controlli v2) su `locale-dev` (porta 3000), `locale-prod` (build di produzione, porta 3100) e `online` (Cloud Run). Esiti in `docs/design/verifica/esiti/2026-10-11-*`. Giudizio sugli esiti e sugli screenshot (home e menu aperto a 390 px confrontati con i mockup).

**Ambiente**: il controllo `AMBIENTE` passa su `locale-prod` e su `online` (nessun indicatore di sviluppo di Next; nelle immagini il cerchio «N» non c'è più). La prima esecuzione aveva misurato il server di sviluppo perché `pnpm dev` e `pnpm start` erano entrambi sulla porta 3000. Gli esiti di misura di questa esecuzione sono validi.

**Verificato su build di produzione**: spazi e icona dell'accesso (P11) in tutte le combinazioni (`acc-spazi-16` 160/160), assenza di lampo del tema (80/80), cambio del sistema a pagina aperta, barra in alto agganciata dopo 600 px (8/8), margini del contenuto (48/48), voci del menu, blocco in cima e blocco utente, campi e testi di accesso, forgot e verify, avvisi in tutti gli stati, aree di tocco a 44 px, scorrimento orizzontale. `locale-dev`: 28 controlli di console, con apertura dei menu e cambio tema, senza errori né avvisi. `online`: AMBIENTE e `on1`–`on6` OK.

**Da correggere (P)**
- **P15 — Il pannello del menu su telefono è largo più di 18 rem.** Misurato a 767 px: 384 px, atteso 288. Causa dal codice: `components/ui/sheet.tsx` dà al lato sinistro `data-[side=left]:w-3/4` e `data-[side=left]:sm:max-w-sm`, e i selettori con attributo vincono su `w-(--sidebar-width)` che `components/ui/sidebar.tsx` passa al pannello. Risultato: 75 % della larghezza, con tetto a 384 px da 640 px in su. A 390 px non si vede (292 contro 288), ma su un telefono da 430 px il pannello è largo circa 322 px e su un tablet in verticale 384 px. Correzione: nel `SheetContent` mobile di `sidebar.tsx` aggiungere `data-[side=left]:w-(--sidebar-width) data-[side=left]:sm:max-w-(--sidebar-width)`; poi registrarla nel registro D6 (`sidebar`, pannello mobile) e in `deviazioni.json`.

**Difetti del lanciatore (non dell'app)**: `acc-padding-scheda` su `reset/iniziale` (valori negativi), `reset-testi` (la descrizione non viene letta), `home-nessuna-riga-di-stato` (contava come «righe di testo» il titolo e la descrizione a capo), `shell-percorso-voce-attiva` a 767 px (testi duplicati nel DOM e pannello chiuso), `shell-menu-utente` a 390 px (il menu non viene aperto: l'immagine `shell-home-menu-utente-telefono-390-chiaro.png` mostra la home senza menu), `shell-tema-scelta` (mai eseguito per un timeout).

**Ipotesi da provare (non verificate)**
- **WebKit non completa il login su `locale-prod`**: `collections/Users.ts` imposta il cookie `Secure` quando `NODE_ENV` è `production`, e WebKit rifiuta i cookie `Secure` su `http://localhost`, mentre Chromium li accetta. Prova: lo stesso giro WebKit su `locale-dev`. Se è così, non è un difetto dell'app.
- **Il clic forzato** aggiunto per `menuitemradio «Chiaro»` può nascondere un problema reale: se Playwright non riesce a cliccare per elemento coperto, instabile o fuori vista, anche un utente potrebbe non riuscirci. Serve il registro completo della chiamata.

**Limiti dell'esecuzione**: gli esiti committati di `locale-prod` sono precedenti alle correzioni del lanciatore (intestazione «Browser: —», `CONSOLE` e `on1`–`on6` elencati come non provati), quindi vanno rigenerati. Mancano gli screenshot a 1280 px in chiaro di home e menu utente.

### Design del Menù (6.6), rilievi del 2026-10-14

- **A33 — `assets/mockup.css` non riproducibile dai sorgenti** (aggiornato il 2026-10-14 con Vini): rigenerato dal prototipo del repo è lungo 110.131 byte contro 110.736 (tre blocchi in più, tra cui le classi del pannello P15, e nove in meno), causa non verificata. Con Vini serve `table-fixed`, assente dal CSS del repo: il CSS rigenerato viene riconsegnato dopo aver verificato che gli otto mockup esistenti si rendano **identici** con il vecchio e il nuovo CSS (0 pixel di differenza a 1280 px, in chiaro e in scuro) e che nessuna classe usata dai mockup sia solo nel vecchio.
- **A34 — Il pacchetto `piatti/` del 2026-10-10 partiva da due assunzioni poi cambiate**: il reset di «terminato» (A16) e le azioni di riga (D13, D14). Rigenerati mockup e screenshot.
- **A35 — Colonna delle azioni nella tabella dei piatti**: con tre icone la colonna passa da 56 a 144 px (`w-36`); a 1280 px la tabella resta nella colonna da 976 px.

- **A36 — Vini: tolta la colonna «Stato»** della tabella: con l'interruttore «Disponibile» era ridondante («Stato: Disponibile» accanto a un interruttore acceso). Resta il badge «Disabilitato» accanto al nome e la riga attenuata. Piatti ha un'altra colonna «Stato» perché lì l'interruttore è «Terminato».
- **A37 — Vini: 90 voci nello snapshot di riferimento** (13 nascoste; `docs/operativo/export-menu-vtn-backend.md`) contro il `limit=100` di `ADR-112`: il caso «elenco parziale» è vicino. Il design dei vini prevede da subito il pulsante «Mostra altri vini» (confermato da Mirko il 2026-10-14); Piatti (44) resta con il solo avviso.
- **A38 — Tabelle a colonne fisse**: Vini usa `table-fixed` con larghezze dichiarate (Origine 14 rem, Prezzo 7 rem, Disponibile 7 rem, azioni 6 rem) perché con il layout automatico le colonne si spostavano da un gruppo all'altro. Le tabelle dei piatti hanno ancora il difetto: da allineare quando si implementa.
- **A39 — Cascata dell'origine del vino** (Mirko, 2026-10-14): regione e denominazione disabilitate finché manca il livello superiore o non esistono valori, con il motivo nel segnaposto; classificazione che segue il paese; valore salvato fuori filtro sempre visibile. Misurato nel prototipo con un paese senza regioni (Giappone).
- **A40 — Select facoltativi senza modo di svuotarli**: nel primo prototipo dei vini, scelta una regione o una classificazione non c'era modo di tornare al campo vuoto. Aggiunta come prima voce «Nessuna regione», «Nessuna denominazione», «Nessuna classificazione», «Non indicata», «Non indicato» (D15). Vale per tutti i select facoltativi delle schermate seguenti.
- **A41 — Filtro per origine nei vini** (Mirko, 2026-10-14): Paese → Regione → Denominazione a cascata nel foglio dei filtri, come nel modulo; la classificazione non è un filtro. Le opzioni sono i valori delle tassonomie, non solo quelli che hanno vini (quest'ultima variante richiederebbe un'interrogazione in più).
- **A42 — Distillati: differenze dai vini** (Mirko, 2026-10-14): niente geografia a cascata (solo paese), niente anno né prezzo al calice; con l'invecchiamento e il grado **a scelta** (D15); **capacità tolta dall'App** (campo `volume` invariato, possibile integrazione futura); **prezzo unico al bicchiere** (etichetta «Prezzo al bicchiere (€)»). Il pacchetto è la schermata dei vini senza ciò che non serve: stessi gruppi, interruttore, matita, cestino, «Mostra altri distillati». Assunzione da confermare: il grado a passi di 1 (non di 0,5).
- **A43 — Bevande: differenze dai distillati** (Mirko, 2026-10-14): nome e descrizione localizzati (la traduzione inglese contiene anche il nome, come nei piatti); paese facoltativo con «Nessun paese»; capacità a scelta 25, 33, 50, 75 cl; grado a scelta 3%–12% a passi di 0,5 (un grado come 4,9% o 6,6% si sceglie al passo più vicino: il costo accettato per uniformarlo a vini e distillati); **allergeni non gestiti nell'App** (campo invariato, si modifica nell'Admin); testi al femminile («Bevanda abilitata», stato «Abilitate», «Disabilitate»). Nessuna relazione punta alle bevande, quindi l'eliminazione non ha il caso «in uso».
- **A44 — Tre schermate quasi gemelle**: Vini, Distillati e Bevande condividono gruppi, interruttore, matita, cestino, filtri, conferma, stati ed elenco parziale; differiscono per i campi. In implementazione conviene un solo componente di elenco e un solo scheletro di modulo, parametrizzati per collection, con i formati in un modulo di `lib/menu/` (`fase-6` §6.6).
- **A45 — Servizi: la schermata più semplice** (assunzioni 1–4 confermate da Mirko il 2026-10-14, `servizi/spec.md` §10): tre campi (nome localizzato, prezzo, disabilitato), elenco piatto per nome, **nessuna ricerca né filtro** (3 voci), interruttore, matita, cestino. **Un servizio usato dai menù fissi si può eliminare** (cascade, come l'admin) e la conferma lo dichiara; è la differenza con i piatti, che il database rifiuta se in un menù fisso. Nessun avviso quando si disabilita un servizio usato.
- **A46 — Menù fissi: composizione e visibilità** (Mirko, 2026-10-14; `menu-fissi/spec.md` §10): foglio con **due viste** (modulo e «Scegli piatti»), **frecce su/giù** per l'ordine, **almeno un piatto**, **visibilità precompilata dalla categoria** e regola dell'**intersezione** tra visibilità del menù e della categoria per il menù pubblico (note di `ADR-108` e `ADR-112`); avviso informativo quando la categoria restringe il menù e avviso rosso non bloccante quando le due non si incrociano. Le categorie restano nella scheda «Categorie», senza cestino (il database rifiuterebbe l'eliminazione di una categoria in uso: `fixed_menus.category_id` è `NOT NULL` con `ON DELETE set null`). `assets/mockup.css` aggiornato con una regola (`.gap-x-2`, usata dalle intestazioni dei gruppi): tutti i 12 mockup esistenti si rendono identici con il vecchio e il nuovo CSS (0 pixel di differenza a 1280 px, chiaro e scuro).
- **A47 — «Entro pochi minuti», non «pochi secondi»** (Mirko, 2026-10-15): `disponibilita.json` cambia in pochi secondi, ma il menù pubblico lo rilegge circa ogni cinque minuti (cache fino a 60 secondi, `ADR-112`): per chi ha la pagina aperta serve fino a circa cinque minuti. Gli avvisi di tutte le schermate dicono ora «Il menù pubblico si aggiorna entro pochi minuti.»; le affermazioni sul file («cambia entro pochi secondi») restano vere e restano. Cambiati i testi e gli screenshot interessati di `piatti`, `vini`, `distillati`, `bevande`, `servizi` e `menu-fissi`.
- **A48 — Giorni speciali e Messaggio globale** (Mirko, 2026-10-15; `giorni-speciali/spec.md` e `messaggio-globale/spec.md` §10): Prossimi e Passati, date passate con avviso non bloccante, interruttore «Attivo», sovrapposizione anticipata nel modulo con il testo del server; messaggio senza limite di lunghezza (debito di verifica), «Togli il messaggio» con conferma, indicatore di pubblicazione con l'ora letta da `disponibilita.json` lato server (con ripiego «senza ora»). I giorni speciali non sono nel file di disponibilità: tutto richiede la ricompilazione. Le otto assunzioni dei Menù fissi (`menu-fissi/spec.md` §10) sono confermate.
- **A49 — Conflitto di flag nel prototipo** (corretto il 2026-10-15): le pagine Distillati, Menù fissi e Giorni speciali usavano `__D__`, `__F__` e `__G__`, già dei Piatti, dei filtri e delle varianti della lingua: la pagina dei Piatti mostrava i Distillati. Flag rinominati (`__DS__`, `__FM__`, `__GS__`); nessun file consegnato in precedenza ne era toccato (mockup e screenshot dei Piatti sono del passo 0), ma `prototipo-sorgenti.zip` nel repo non ricostruiva i Piatti. Aggiunto un controllo del titolo di ogni pagina al README di ripristino.
- **A50 — Screenshot a pagina intera a 390 px**: ricatturati con lo stesso script, differiscono dai PNG già nel repo di qualche pixel di testo (le etichette sotto gli interruttori e altezze di riga: fino a tre pixel), per una causa non individuata; non si riconsegnano, perché la schermata non è cambiata. I PNG con l'avviso «pochi minuti» coincidono con i precedenti tranne il testo.
- **A51 — Integrazione del Menù** (Mirko, 2026-10-15; `integrazione/spec.md` §11): la riga di stato della scheda «Menù» conta i piatti **terminati** (non i disabilitati); «Ricompila il menù pubblico» **resta nell'intestazione di ogni elenco** (scelta A, nessun rifacimento); descrizione della scheda «Piatti, vini, bevande, menù fissi e altro»; D2 aggiornato (testo della riga e dati).
- **A52 — Difetto di corrispondenza dei percorsi** (trovato nel codice il 2026-10-15): `components/app/shell/app-sidebar-nav.tsx` (riga 35) e `lib/app/breadcrumb.ts` (riga 17) scelgono la **prima** voce il cui percorso è un prefisso; con «Piatti» su `/app/menu` ogni pagina `/app/menu/…` avrebbe attiva anche «Piatti» e la briciola «Menù › Piatti». Latente anche tra «Elenco» ed «Eccezioni giorno». Corretto in specifica con la regola del **percorso più lungo**, con una tabella di casi da provare.
- **A53 — Schede dei Menù fissi come percorsi** (assunzione, `integrazione/spec.md` §2): `/app/menu/fixed` e `/app/menu/fixed/categories`, per collegamento diretto, tasto indietro e briciole («Menù › Menù fissi › Categorie»).
- **A54 — Icona di «Menù fissi»** (assunzione): `book-open` come nel design e nelle demo, al posto di `list` del codice; il prototipo originale usava anche `GlassWater` per le bevande dove il codice ha `cup-soda`: si segue il codice per le bevande.
- **A55 — Titolo della home** (assunzione, 2026-10-16; `integrazione/spec.md` §3 e §11): «Oggi» e «Situazione di oggi e accesso alle sezioni.» **appena almeno una scheda ha una riga di stato attiva** (dalla chat I1 della 6.6, per chi vede il Menù); «Area App» e «Scegli una sezione.» se nessuna è attiva. Prima non era scritto quando il titolo cambia.
- **A56 — Il conteggio della riga del Menù esclude i disabilitati** (correzione, 2026-10-16): la specifica diceva «i disabilitati non contano» ma la query scritta contava ogni `soldOut` vero; la query ora è `soldOut` vero **e** `disabled` non vero, e il controllo `home-riga-menu-casi` prova il caso disabilitato con `soldOut` vero.
- **A57 — Il periodo senza «Ricompila» e le simulazioni di sviluppo** (la bandiera spenta: Mirko, 2026-10-16; gli avvisi senza la frase sul pulsante: assunzione da confermare): la 6.5 viene dopo la 6.6 e la 6.9, quindi il componente «Ricompila il menù pubblico» esiste ma sta dietro una bandiera spenta; finché è spenta il pulsante e la finestra non compaiono e gli avvisi che nominano il pulsante hanno solo il titolo (`integrazione/spec.md` §5). Gli screenshot approvati restano di riferimento per il risultato finale (la differenza è un rilievo A). Le schermate del Menù supportano in sviluppo le simulazioni `APP_MENU_DEV_SIMULATE_SAVE_ERROR`, `APP_MENU_DEV_SIMULATE_LOAD_ERROR` e `APP_MENU_DEV_SIMULATE_LOAD_DELAY_MS` (come Orari: `lib/app/menu/devSimulate.ts`, solo fuori da `production`).
- **A58 — Controlli della 6.6** (2026-10-16): un solo file `docs/design/verifica/controlli-6.6.json` con le schermate aggiunte una alla volta; prima di ogni chat di implementazione l'agente di verifica implementa nel lanciatore i controlli di quel gruppo (`policy-test.md` §6). Gli esiti restano OK, FALLITO, AVVISO e NON PROVATO: un controllo che si prova solo alla 6.5 è NON PROVATO con l'evidenza «rinviato alla 6.5».

## 5. Verifiche tecniche fatte in questa sessione

- Sorgenti dei componenti: repository `shadcn-ui/ui`, commit `2d3f1cd` (2026-10-09), cartelle `apps/v4/registry/bases/base/ui` e `styles/style-nova.css`. **`base-nova` poggia su `@base-ui/react`, non su Radix.** Le classi `cn-*` dei componenti si risolvono con `style-nova.css`: 422 blocchi, tutti `@apply` semplici.
- Mockup costruiti con i componenti reali (non con HTML che li imita) e i token di `app-ui.css`; Playwright e Chromium funzionano sui componenti shadcn veri (screenshot a 390 e 1280 px, misure di altezza e di scorrimento orizzontale a 360 px).
- **Confronto visivo**: su telefono due acquisizioni a pagina intera dello stesso prototipo differiscono del 6,6 % (rumore di rendering dell'emulazione mobile); su notebook la differenza è 0,0 %. Il confronto con le implementazioni si fa quindi con misure geometriche (`getBoundingClientRect`, dimensioni, posizioni), non con la differenza di pixel; le misure del mockup statico coincidono con quelle del prototipo al decimo di pixel.
- Nessuno scorrimento orizzontale a 360 px (con tocco simulato) su elenco prenotazioni nel layout scelto, filtri a foglio e home «Oggi». Da ripetere sulle schermate vere.

## 6. Punti aperti

- Sottoaree del Menù: risolte il 2026-10-14 (otto voci, D1). Resta provvisorio il nome «Elenco» di Prenotazioni.
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
- **Uscita («Esci»)**: implementata in 8.2 (`POST /app/logout`), con reindirizzamento relativo dopo P13. Verificato il 2026-10-11 su Cloud Run (da te, a mano): la pagina finale è `/app/login` sul dominio pubblico. Restano da verificare la sessione dell'Admin dopo l'uscita (stesso cookie) e la riga `logout` nel registro attività su produzione (livello 3). Con `useSessions: false` il logout scade solo il cookie, non invalida il token lato server (nota per la revisione).
- **Utente già autenticato su `/app/login`**: oggi vede la pagina; si può reindirizzare a `/app`. Non deciso.
- **Percorsi delle sottovoci**: per il Menù proposti in D1 (`/app/menu/services`, `/app/menu/special-days`, `/app/menu/message`), da confermare con la 6.6; per Prenotazioni da fissare con la 5.5.

## 7. Impatto sul piano

I tre «passaggi da confermare» di `fase-8-shell-app.md` §8.2 sono risolti da D1, D2 e D3. Questo documento non modifica la fase 8: la voce di §8.2 e la sua checklist (navigazione e home verificate su telefono e desktop per ogni ruolo) vanno allineate quando si prepara l'implementazione. Aggiunte di cui la 8.2 dovrà tener conto: tema (D4), dimensioni di tocco (D6), slot della barra di salvataggio nella shell (D7), larghezza della colonna (D8) il modello degli elenchi di record (D9) e la gestione delle due lingue nei moduli (D10).

## 8. Prossimi passi

**Fatto il 2026-10-10**
1. Prove su tre schermate, confezionate in `schermate/orari/`, `schermate/prenotazioni/` e `schermate/piatti/`.
2. Regola UI di progetto `.cursor/rules/ui/01-ui-app-invarianti.mdc` (`stato: da validare`), `modello-specifica-schermata.md`, `scripts/ui-check.mjs`, `patch-app-ui-css.md`, `installazione-componenti-ui.md`.
3. Pacchetti di **shell e home** (`schermate/shell/`) e di **accesso** (`schermate/accesso/`) per la 8.2.

**Da fare**
4. Le altre schermate quando arriva la loro fase: Eccezioni giorno e Impostazioni (5.x); Vini, Bevande, Distillati, Menù fissi, Servizi, Giorni speciali e Messaggio globale (6.6).
5. Verifica visiva delle implementazioni di Cursor a 390 e 1280 px, in tutti e due i temi, con i controlli comuni del modello di specifica. **Fatta in parte il 2026-10-11 per la 8.2** (vedi §4): restano le correzioni P10–P14, la prova su un iPhone vero (D6), gli screenshot mancanti e la riverifica dopo le correzioni.
