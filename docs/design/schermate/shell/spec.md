# Shell e home — specifica di schermata (`/app`)

**Stato**: chiusa il 2026-10-10. Le scelte della sezione 10 sono state confermate da Mirko lo stesso giorno.

**Si implementa in**: `fase-8-shell-app.md` §8.2. Dipende da 8.1 e 8.3, dalla patch di `app-ui.css` (`docs/design/patch-app-ui-css.md`) e dall'installazione dei componenti (`docs/design/installazione-componenti-ui.md`).

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1–D12), `ADR-102`, `ADR-113`, `lib/auth/userAccess.ts`, `lib/auth/canAccessSection.ts`, `fase-8-shell-app.md` §§8.2 e 8.3.

**File del pacchetto** (stessa cartella): `mockup.html` (home senza righe di stato, come nella 8.2, con il menu a tre voci) e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Segnaposto: `390-segnaposto-chiaro.png`, `1280-segnaposto-chiaro.png`. Home con il menu completo (a regime): `390-con-righe-di-stato-chiaro.png`, `1280-con-righe-di-stato-chiaro.png`, `390-vuota-chiaro.png`, `1280-vuota-chiaro.png`. Shell: `390-menu-aperto-chiaro.png`, `390-menu-utente-chiaro.png`, `1280-menu-utente-chiaro.png`, `1280-menu-utente-scuro.png`, `1280-menu-chiuso-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo e accesso

La shell è il contenitore comune di tutte le pagine dell'App dopo l'accesso: barra laterale, barra in alto, menu utente, tema. La home `/app` è la pagina iniziale. **Le pagine di accesso (`/app/login/**`) non stanno nella shell** (vedi `schermate/accesso/`).

**Guardia** (si sceglie un comportamento per ogni caso; i primi due sono già nel piano):
- **Non autenticato** → `/app/login`.
- **Autenticato ma senza accesso all'App** (`canAccessAppArea` falsa: utente disattivato con cookie ancora valido, o `adminRole: manager` senza `appRole`) → `/app/login?authFailed=1`, che mostra il messaggio generico esistente «Accesso non riuscito. Se ritieni di dover avere accesso, contatta l'amministratore.» *(confermato: riusa il meccanismo di oggi, nessuna schermata nuova)*.
- **Sezione non consentita** (`canAccessSection(user, section)` falsa) → la voce non compare nel menu e l'URL diretto porta a `/app`. Oggi la regola è la stessa per le tre sezioni (`canAccessAppArea`), quindi un utente con accesso all'App le vede sempre tutte e tre; la guardia per sezione resta perché `ADR-113` può distinguerle in futuro.

**Fuori perimetro**: i contenuti delle sezioni (schermate di Orari, Prenotazioni, Menù) e le pagine di accesso.

## 2. Collegamento ai dati

| Elemento | Dato | Note |
|---|---|---|
| Indirizzo nel blocco utente | `email` | **La collection `users` non ha un campo nome**: si mostra solo l'email, tagliata con i puntini se lunga |
| Iniziali nell'avatar | dall'`email` | Parte prima della `@`, divisa su `.`, `_` e `-`: iniziali delle prime due parti («marco.rossi» → «MR»); senza separatori, le prime due lettere («marco» → «MA»). Maiuscole |
| Ruolo sotto «Area App» | `adminRole`, `appRole` | `super-admin` → «Super-admin»; `admin` → «Admin»; altrimenti `appRole: manager` → «Manager». Etichette come in `lib/auth/roles.ts` |
| Voce «Vai all'Admin» | `canAccessAdminPanel(user)` | Visibile solo se vero |
| Voci del menu | tabella di navigazione | Una sola tabella (in `lib/` o `components/app/`): gruppo, voce, percorso, sezione per la guardia, e `enabled` |

**Tabella di navigazione** (D1):

| Gruppo | Voci | Sezione per `canAccessSection` |
|---|---|---|
| Menù | Piatti, Vini, Bevande, Distillati, Menù fissi | `menu` |
| Orari | Orari | `hours` |
| Prenotazioni | Elenco, Eccezioni giorno, Impostazioni | `reservations` |

- Un gruppo compare solo se l'utente ha la sezione. Una voce compare solo se è `enabled`: **finché la sua pagina non esiste, la voce non si mostra** (non deve portare a un 404). Si abilita nella sottofase della schermata (8.5 per Orari, 5.5, 6.6).
- **Nella 8.2 sono abilitate tre voci**, quelle che portano alle rotte di sezione già previste dal piano: Menù › Piatti (`/app/menu`), Orari (`/app/hours`), Prenotazioni › Elenco (`/app/reservations`). Ciascuna apre una **pagina segnaposto** dentro la shell (sezione 5), che passa dalla guardia `canAccessSection` e viene sostituita dalla schermata vera nella sua sottofase. Vini, Bevande, Distillati, Menù fissi, Eccezioni giorno e Impostazioni restano nascoste. Così nella 8.2 la navigazione e la guardia per URL si possono verificare. Gli screenshot degli altri pacchetti (Orari, Prenotazioni, Piatti) mostrano il menu completo, quello a regime.
- I percorsi delle sezioni sono `/app/menu`, `/app/hours`, `/app/reservations` (`fase-8` §8.2); quelli delle sottovoci li fissa la sottofase di ogni sezione.
- **Uscita («Esci»)**: nel repo non esiste ancora un percorso di uscita per l'App. Vedi sezione 7, comportamento 8.

## 3. Albero blocchi → componenti → varianti

| Blocco (`data-block`) | Contenuto | Componenti |
|---|---|---|
| Barra laterale | Blocco in cima (icona, «Area App», ruolo), gruppi con voci, blocco utente in fondo | `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton (lg | default)`, `SidebarFooter` |
| Blocco utente | Avatar con iniziali, email, `⌄`; apre il menu utente | `DropdownMenu`, `Avatar`, `AvatarFallback`, `SidebarMenuButton (lg)` |
| Menu utente | Tema (Chiaro, Scuro, Sistema), «Vai all'Admin», «Esci» | `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuItem`, `DropdownMenuSeparator` |
| `topbar` | Pulsante del menu, separatore, percorso (briciola di pane) | `SidebarTrigger`, `Separator (vertical)`, `Breadcrumb` |
| Area contenuto | Colonna con il contenuto della pagina | `SidebarInset` |
| `schede-sezioni` (home) | Una scheda per sezione consentita | `Card` dentro un collegamento (eccezione dichiarata, sezione 8) |
| `scheda-<sezione>` | Icona, titolo, descrizione, riga di stato (facoltativa), freccia | `Card`, `CardContent` |
| (stato) segnaposto | Titolo e descrizione della sezione, dentro la shell | testo (`h1`, `p`) |
| (stato) home vuota | Messaggio per l'utente senza sezioni | testo in un riquadro tratteggiato |

La scheda è un collegamento intero: un `a` che contiene la `Card` (eccezione dichiarata, sezione 8).

## 4. Layout e regole responsive

| | Telefono (sotto 768 px) | Schermo largo (da 768 px) |
|---|---|---|
| Barra laterale | Pannello laterale da 18 rem che si apre dal pulsante in alto a sinistra | Barra fissa da 16 rem, chiudibile dal pulsante |
| Barra in alto | Alta 56 px, agganciata in alto: pulsante, separatore, percorso | Idem |
| Contenuto | Margine 16 px | Margine 24 px |
| Home, schede | Una colonna | Due colonne da `md`, tre da `xl` |
| Dimensioni dei controlli | Dispositivo touch (`pointer-coarse`): ≥ 44 px (D6) | Con mouse: misure standard di Nova |

- Il punto di passaggio è **768 px**, fisso nella `Sidebar` di shadcn. Un tablet largo meno di 768 px vede il layout da telefono; da 768 px in su quello da notebook.
- Lo stato aperto o chiuso della barra su notebook lo ricorda il componente (cookie di shadcn): invariato.
- La barra in alto resta agganciata durante lo scorrimento (richiede `overflow-x: clip`, `patch-app-ui-css.md`).
- La barra di salvataggio delle pagine-modulo è uno **slot della shell**, fuori dal contenitore con il padding: una pagina vi inserisce la propria barra (D7). Come si realizza (per esempio con un portale) lo decide Cursor; se non riesce a garantire il comportamento sticky, si ferma e chiede.
- Nessuno scorrimento orizzontale a 360, 390 e 1280 px.

## 5. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Home senza righe di stato (**come nella 8.2**) | Titolo «Area App», «Scegli una sezione.», tre schede con titolo e descrizione; menu con tre voci (Piatti, Orari, Elenco) | `*-chiaro.png`, `*-scuro.png`, `mockup.html` |
| Segnaposto di sezione (8.2) | Titolo («Piatti», «Orari», «Prenotazioni»), «Questa sezione sarà disponibile a breve.», voce corrente evidenziata e percorso nella barra | `390-segnaposto-chiaro.png`, `1280-segnaposto-chiaro.png` |
| Home con righe di stato | Titolo «Oggi», una riga di stato per sezione, solo per le righe attive | `390-con-righe-di-stato-chiaro.png`, `1280-con-righe-di-stato-chiaro.png` |
| Home senza sezioni | Messaggio «Nessuna sezione disponibile» e il testo di assistenza; la barra non ha gruppi | `390-vuota-chiaro.png`, `1280-vuota-chiaro.png` |
| Menu aperto (telefono) | Pannello con i gruppi, il blocco utente in fondo, velo sul resto | `390-menu-aperto-chiaro.png` |
| Menu utente aperto | Tema, «Vai all'Admin» (se consentito), «Esci» | `390-menu-utente-chiaro.png`, `1280-menu-utente-chiaro.png`, `1280-menu-utente-scuro.png` |
| Barra chiusa (notebook) | Il contenuto occupa tutta la larghezza; il pulsante la riapre | `1280-menu-chiuso-chiaro.png` |

La home **senza sezioni** non è oggi raggiungibile (tutti gli utenti con accesso all'App hanno le tre sezioni): è una difesa se `ADR-113` introdurrà ruoli con sezioni diverse.

## 6. Testi

Tutti in italiano.

| Dove | Testo |
|---|---|
| Blocco in cima | Area App · {Super-admin \| Admin \| Manager} (collegamento a `/app`) |
| Gruppi e voci | Menù: Piatti, Vini, Bevande, Distillati, Menù fissi · Orari: Orari · Prenotazioni: Elenco, Eccezioni giorno, Impostazioni |
| Barra in alto | Percorso come in sezione 7; nomi accessibili «Apri o chiudi il menu» (pulsante) e «Percorso» (briciola) |
| Pannello su telefono | Titolo per lo screen reader «Menu»; descrizione «Menu di navigazione dell’Area App.»; chiusura «Chiudi» |
| Menu utente | Tema · Chiaro · Scuro · Sistema · Vai all'Admin · Esci |
| Home (senza righe) | Area App / Scegli una sezione. |
| Home (con righe) | Oggi / Situazione di oggi e accesso alle sezioni. |
| Schede | Prenotazioni: «Elenco, eccezioni giorno, impostazioni» · Menù: «Piatti, vini, bevande, distillati, menù fissi» · Orari: «Ristorante, B&B, giorni di riposo, chiusure» |
| Righe di stato (quando attive) | Prenotazioni: «Oggi {N} coperti · prossima alle {HH:mm}» (5.5) · Menù: «{N} piatti non disponibili» (6.6) · Orari: «Oggi: {HH:mm}–{HH:mm} e {HH:mm}–{HH:mm}» (8.5; mai «aperto» finché non esistono le Eccezioni giorno) |
| Segnaposto di sezione | Titolo: Piatti · Orari · Prenotazioni (gli stessi delle schermate vere). Descrizione: Questa sezione sarà disponibile a breve. |
| Home senza sezioni | Nessuna sezione disponibile / Il tuo account non ha accesso a nessuna sezione. Se ritieni di dover avere accesso, contatta l’amministratore. |
| Titolo del documento | «Area App» nella home e «{Pagina} · Area App» nelle altre; descrizione «Backoffice operativo» (oggi «… placeholder Fase 1») |

**Singolare e plurale**: «1 coperto», «1 piatto non disponibile».

## 7. Comportamenti

1. **Voce attiva**: la voce della pagina corrente è evidenziata (`SidebarMenuButton isActive`); nella home nessuna. Il blocco in cima porta a `/app`.
2. **Percorso nella barra in alto**: home «Area App» (testo semplice); voci con un solo livello (Orari) il nome della voce; voci di un gruppo «{Gruppo} › {Voce}» (per esempio «Prenotazioni › Elenco»). Il gruppo è un collegamento alla prima voce abilitata del gruppo, la voce corrente è testo semplice.
3. **Telefono**: il pulsante apre il pannello; toccare una voce porta alla pagina e chiude il pannello. **Notebook**: il pulsante chiude e riapre la barra.
4. **Schede della home**: l'intera scheda è un collegamento alla sezione (`/app/menu`, `/app/hours`, `/app/reservations`). Ordine: Prenotazioni, Menù, Orari *(confermato: diverso da quello della barra, perché la home segue l'uso quotidiano)*.
5. **Righe di stato**: una riga compare solo se la sua query esiste ed è attiva; altrimenti la scheda ha solo titolo e descrizione. Se la lettura fallisce, la riga non compare e la scheda resta navigabile. In caricamento: `Skeleton` alla stessa altezza della riga.
6. **Tema**: tre voci a scelta singola nel menu utente (Chiaro, Scuro, Sistema), predefinita Sistema; la scelta vale per il dispositivo (D4) e si applica **prima** del primo disegno della pagina (nessun lampo del tema sbagliato), anche nelle pagine di accesso. I controlli nativi del browser seguono il tema (`color-scheme`).
7. **«Vai all'Admin»**: collegamento a `/admin` nella stessa scheda, per chi supera `canAccessAdminPanel`. Con modifiche non salvate in una pagina-modulo, come ogni altro collegamento fuori pagina, apre la conferma di uscita (specifica di Orari, comportamento 15).
8. **«Esci»**: termina la sessione e porta a `/app/login`. **Non esiste ancora nel repo**: da implementare in 8.2. Strada proposta, da verificare: il logout REST di Payload (`POST /api/users/logout`, cookie `payload-token`) da un modulo, senza JavaScript. Va verificato che la sessione sia la stessa dell'Admin (uscendo dall'App si esce anche dall'Admin) e che il registro attività annoti `logout` come gli altri eventi (il tipo esiste nello schema).
9. **Segnaposto di sezione**: nella 8.2 le tre rotte `/app/menu`, `/app/hours`, `/app/reservations` mostrano il segnaposto dentro la shell, con la voce corrente evidenziata e il percorso («Menù › Piatti», «Orari», «Prenotazioni › Elenco»). Passano da `canAccessSection`: senza sezione portano a `/app`. Si sostituiscono con la schermata vera (8.5 per Orari, 5.5, 6.6) senza cambiare la rotta.
10. **Tastiera**: la scorciatoia di shadcn per aprire e chiudere la barra (Ctrl o Cmd + B) resta quella del componente; tutte le voci si raggiungono con Tab, con ordine uguale a quello visivo.

## 8. Componenti da installare e da comporre

- **Da installare** (8.2): `sidebar`, `button`, `separator`, `sheet`, `tooltip`, `skeleton`, `avatar`, `dropdown-menu`, `breadcrumb`, `card`, `collapsible`, `alert`, `spinner`, con le deviazioni D6 e i testi in italiano (T1) di `docs/design/installazione-componenti-ui.md`.
- **Componenti di composizione** (`components/app/`): la shell (provider, barra laterale e area del contenuto, slot della barra di salvataggio), la navigazione (gruppi e voci dalla tabella di navigazione, filtrati dalla guardia), il menu utente (tema, Admin, Esci), la barra in alto con il percorso, la scheda di sezione della home.
- **Eccezioni alla regola UI** (`ui-check-allow`): la scheda di sezione è un `a` che contiene una `Card` (collegamento intero).
- **Logica pura in `lib/`** (con test): iniziali dall'email, etichetta del ruolo, voci di navigazione filtrate dalla guardia, percorso dalla route.

## 9. Checklist di accettazione

Valgono i **controlli comuni C1–C10** del modello di specifica (`modello-specifica-schermata.md`). In più:

1. **Guardia**: non autenticato → `/app/login`; utente disattivato con cookie valido e `adminRole: manager` senza `appRole` → `/app/login?authFailed=1`; un utente con accesso vede home e menu.
2. **Sezioni per ruolo**: con `appRole: manager`, `adminRole: admin` e `super-admin` si vedono i tre gruppi (le voci non ancora abilitate non compaiono); l'URL di una sezione non consentita porta a `/app`.
3. **Punto di passaggio**: a 767 px il menu è un pannello; a 768 px è la barra fissa. Nessun elemento sotto 44 px su touch, voci del menu e del menu utente comprese.
4. **Blocco utente**: mostra l'email intera o tagliata con i puntini; iniziali come in sezione 2; ruolo coerente con i dati per i tre casi.
5. **Menu utente**: «Vai all'Admin» compare solo con `canAccessAdminPanel`; Chiaro, Scuro e Sistema funzionano; con sistema scuro e «Sistema» la pagina è scura; la scelta resta dopo il ricaricamento, senza lampo.
6. **Percorso e voce attiva**: per ogni pagina il percorso e la voce evidenziata coincidono con la sezione 7.
7. **Home**: senza righe di stato come nella 8.2; le righe compaiono solo quando la query è attiva; con la lettura in errore la riga non compare.
8. **Testi dei componenti**: i nomi accessibili sono in italiano («Apri o chiudi il menu», «Chiudi», «Percorso», «Menu»); `pnpm ui:check` non segnala testi in inglese.
9. **Barra in alto agganciata**: dopo uno scorrimento di 600 px ha `top = 0`; lo slot della barra di salvataggio resta in fondo alla finestra (provato con la pagina Orari).
10. **Uscita**: «Esci» chiude la sessione e porta a `/app/login`; dopo, `/app` porta di nuovo al login.
11. **Segnaposto**: le tre rotte esistono e mostrano titolo e descrizione del segnaposto; con la guardia falsa portano a `/app` (provato con un utente di prova senza accesso); il menu della 8.2 ha esattamente tre voci.
12. **Accesso fuori dalla shell**: `/app/login` e le altre pagine di accesso non hanno barra laterale né barra in alto.

## 10. Scelte confermate, assunzioni e debiti

**Scelte confermate** (da `decisioni-layout-app.md`): navigazione, home «Oggi» con righe di stato predisposte, collegamento all'Admin nel menu utente, tema chiaro/scuro/sistema per dispositivo (D1–D4).

**Scelte confermate da Mirko il 2026-10-10**
- Solo l'**email** nel blocco utente, con le **iniziali** ricavate dall'email, e il **ruolo** sotto «Area App».
- Utente autenticato senza accesso all'App → `/app/login?authFailed=1` (messaggio generico esistente).
- Sezione non consentita → `/app`.
- Home senza righe di stato nella 8.2, con il titolo «Area App»; «Oggi» solo quando almeno una riga è attiva.
- Voci non ancora abilitate **nascoste** (non portano a un 404).
- Ordine delle schede della home: Prenotazioni, Menù, Orari.

**Nota sulle schede della home**: le descrizioni («Piatti, vini, bevande, distillati, menù fissi», ...) parlano anche di sottovoci non ancora abilitate; nella 8.2 il testo resta quello definitivo (rilievo non bloccante).

**Da fare / da verificare in 8.2**
- **Uscita («Esci»)** da implementare (sezione 7, comportamento 8).
- **Slot della barra di salvataggio** nella shell: il meccanismo è di Cursor, con il vincolo sticky.
- **Percorsi delle sottovoci**: da fissare con le sottofasi.

**Debiti futuri**: nome e foto dell'utente (oggi il dato non c'è); ricerca nella barra laterale; notifiche temporanee (`Toaster`).
