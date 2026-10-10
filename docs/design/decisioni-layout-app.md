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

Voce **«Vai all'Admin»** nel menu utente (quello che si apre dal nome in fondo alla barra), con icona di collegamento esterno. Visibile solo se `canAccessAdminPanel(user)`. Motivo: l'Admin è pensato soprattutto per l'uso da web e i contenuti dei siti, dopo l'inserimento iniziale, si aggiornano di rado.

### D4 — Tema chiaro, scuro, sistema

- Tre scelte nel menu utente: **Chiaro, Scuro, Sistema**, voci piatte con spunta (niente sottomenu, scomodi da toccare). Scelta iniziale: Sistema.
- La scelta vale **per dispositivo**, non per account (nessun campo in `users`, nessuna migrazione). Se in futuro servisse per account: campo in `users` e migrazione.
- Requisiti comportamentali: nessun lampo del tema sbagliato al caricamento della pagina; i controlli nativi del browser seguono il tema scelto (`color-scheme`); ogni schermata va verificata in tutti e due i temi.
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
| `tabs` | `pointer-coarse:group-data-horizontal/tabs:h-11` sulla lista | D6 |

Non ancora adattati perché non usati finora: casella di spunta, interruttore, radio, calendario, paginazione, link nel testo. Si adattano nello stesso passo in cui si installano.

**Eccezioni** (da compilare solo con decisione esplicita): nessuna.

### D7 — Modello di salvataggio delle schermate di modifica

**Una barra «Salva modifiche» per pagina.** Si salva tutto in una volta: il Global è un unico documento e la validazione tra campi (es. i due servizi) è sull'insieme.

- La barra compare solo quando ci sono modifiche non salvate: testo «Modifiche non salvate», pulsanti «Annulla modifiche» (ripristina l'ultimo salvato) e «Salva modifiche». Resta agganciata al fondo della finestra. Su telefono i due pulsanti stanno affiancati (97 px di altezza in totale).
- È uno **slot della shell, fuori dal contenitore con il padding** (vedi P2 nella sezione 3): dentro il contenitore non si aggancia in modo affidabile. Il suo contenuto è allineato alla colonna del modulo (D8).
- Gli elementi modificati in un foglio (es. una chiusura annuale) hanno «Applica», che modifica solo il modulo; la persistenza avviene con «Salva modifiche». Il testo del foglio lo dice.
- **Errore di validazione**: nessun salvataggio; banner in testa («Controlla i campi evidenziati»), campo con errore evidenziato con il suo messaggio, e il primo campo non valido viene portato in vista e riceve il focus.
- **Esito**: messaggio «… salvati» in pagina (notifica di shadcn da definire, vedi A6).

### D8 — Larghezza del contenuto

- **Pagine-modulo** (Orari, modifica di un piatto, impostazioni): colonna centrata larga al massimo `max-w-xl` (576 px). Su schermo largo le righe del modulo restano leggibili (con la larghezza piena, etichetta e icone di una riga si trovavano a oltre 800 px di distanza). Su telefono la colonna occupa tutta la larghezza.
- **Gruppi di scelta** (giorni di riposo): su schermo largo voci compatte da 56 px (`sm:w-14`, gruppo di 392 px); su telefono occupano la riga.
- **Pagine con tabelle** (elenco prenotazioni): larghezza diversa, da definire con quella schermata.
- La barra di salvataggio e il banner seguono la stessa colonna.

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
- **A4 — Orari come testo:** il mockup usa un campo di testo con tastiera numerica e segnaposto `12:30` (come l'Admin). L'alternativa `type="time"` dà il selettore nativo, ma il formato mostrato dipende dalle impostazioni del dispositivo.
- **A5 — Festività:** l'Admin ha due campi anno («aggiungi» e «rimuovi»); nel mockup ce n'è uno solo, con due pulsanti. Il comportamento resta quello delle funzioni di `lib/systemSettings/`; la checklist di §8.5 («le righe del pulsante festività corrispondono a quelle dell'Admin») resta valida.
- **A6 — Notifiche di conferma:** il wrapper `Sonner` di shadcn importa `next-themes`. Se il tema è gestito a mano (D4), il `Toaster` va collegato alla nostra scelta, oppure si adotta `next-themes` anche per il tema. Il mockup usa un messaggio in pagina (`Alert`).
- **A7 — Orari non configurati:** se `services` manca sul Global, la sezione deve mostrare lo stato «non configurato» (`fase-7` §7.2, «nessun default inventato»). Non è nel mockup: da specificare.
- **A8 — Elenco lungo:** con più anni le chiusure crescono di 13 righe all'anno. Il mockup le raggruppa per anno; da verificare con molti dati.

## 4. Verifiche tecniche fatte in questa sessione

- Sorgenti dei componenti: repository `shadcn-ui/ui`, commit `2d3f1cd` (2026-10-09), cartelle `apps/v4/registry/bases/base/ui` e `styles/style-nova.css`. **`base-nova` poggia su `@base-ui/react`, non su Radix.** Le classi `cn-*` dei componenti si risolvono con `style-nova.css`: 422 blocchi, tutti `@apply` semplici.
- Mockup costruiti con i componenti reali (non con HTML che li imita) e i token di `app-ui.css`; Playwright e Chromium funzionano sui componenti shadcn veri (screenshot a 390 e 1280 px, misure di altezza e di scorrimento orizzontale a 360 px).
- **Confronto visivo**: su telefono due acquisizioni a pagina intera dello stesso prototipo differiscono del 6,6 % (rumore di rendering dell'emulazione mobile); su notebook la differenza è 0,0 %. Il confronto con le implementazioni si fa quindi con misure geometriche (`getBoundingClientRect`, dimensioni, posizioni), non con la differenza di pixel; le misure del mockup statico coincidono con quelle del prototipo al decimo di pixel.
- Nessuno scorrimento orizzontale a 360 px (con tocco simulato) su elenco prenotazioni nel layout scelto, filtri a foglio e home «Oggi». Da ripetere sulle schermate vere.

## 5. Punti aperti

- Verifica delle sottoaree del Menù con `fase-6-menu-digitale.md`; nome definitivo di «Elenco».
- Filtro per data e filtri di ogni lista (specifica per schermata).
- Stato vuoto della home per un utente senza sezioni.
- Testi definitivi delle righe di stato della home (con le sottofasi 5.5, 6.6, 8.5).
- Tabelle su tablet touch: righe con azioni a 44 px, quindi meno righe visibili che con il mouse. Da verificare nelle schermate di dettaglio.
- Selettore di data (celle del calendario a 44 px su touch): da adattare quando si installa.
- Se la scelta del tema debba valere per account invece che per dispositivo.
- Larghezza delle pagine con tabelle (elenco prenotazioni), da definire con quella schermata.
- Componenti di composizione di progetto (P2) e loro elenco.
- Come gestire il tema rispetto a `next-themes` e al `Toaster` (A6).

## 6. Impatto sul piano

I tre «passaggi da confermare» di `fase-8-shell-app.md` §8.2 sono risolti da D1, D2 e D3. Questo documento non modifica la fase 8: la voce di §8.2 e la sua checklist (navigazione e home verificate su telefono e desktop per ogni ruolo) vanno allineate quando si prepara l'implementazione. Aggiunte di cui la 8.2 dovrà tener conto: tema (D4), dimensioni di tocco (D6), slot della barra di salvataggio nella shell (D7) e larghezza della colonna dei moduli (D8).

## 7. Prossimi passi

1. Provare le decisioni su tre schermate: Orari (§8.5, approvata e confezionata in `schermate/orari/`), elenco prenotazioni, modifica di un piatto.
2. Mockup HTML finali annotati con `data-component`, `data-variant`, `data-size`.
3. Regola UI di progetto `.cursor/rules/ui/…mdc`, modello di specifica per schermata, script `pnpm ui:check`.
4. Verifica visiva delle implementazioni di Cursor a 390 e 1280 px, in tutti e due i temi.
