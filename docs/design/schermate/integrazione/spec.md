# Integrazione del Menù nella shell — specifica di schermata (navigazione, home «Oggi», briciole)

**Stato**: design chiuso il 2026-10-15 con le risposte di Mirko (riga di stato dei piatti terminati; «Ricompila il menù pubblico» resta nell'intestazione di ogni elenco, scelta A; descrizione della scheda «Menù») e la conferma della demo; restano da confermare le assunzioni della sezione 10. Non è una schermata nuova: raccorda le otto schermate del Menù (`piatti`, `vini`, `bevande`, `distillati`, `menu-fissi`, `servizi`, `giorni-speciali`, `messaggio-globale`) con la shell e la home della 8.2, e corregge due difetti trovati nel codice.

**Si implementa in**: `fase-6` sottofase 6.6, **a partire da questa parte** (la Parte 0, i permessi, non dipende da essa) e insieme alle singole schermate, che si accendono nella navigazione man mano. Dipende dalla shell di 8.2 (`schermate/shell/spec.md`), da 8.3 (guardia) e dalla Parte 0 di 6.6 per il conteggio dei piatti con la sessione dell'utente.

**Riferimenti**: `docs/design/decisioni-layout-app.md` (D1, D2, D3, D12), `schermate/shell/spec.md` (che questa specifica **aggiorna** per i testi, la tabella delle voci e la scheda «Menù»), `fase-6-menu-digitale.md` §6.6, `fase-8-shell-app.md` §8.2, `lib/app/navigation.ts`, `lib/app/breadcrumb.ts`, `components/app/shell/app-sidebar-nav.tsx`.

**File del pacchetto** (stessa cartella): `mockup.html` (mockup statico annotato: la home «Oggi» con la riga di stato del Menù) e screenshot di riferimento. Stato iniziale: `390-chiaro.png`, `390-scuro.png`, `1280-chiaro.png`, `1280-scuro.png` (pagina intera). Telefono: `390-riga-un-piatto-chiaro.png`, `390-riga-zero-chiaro.png`, `390-riga-caricamento-chiaro.png`, `390-riga-errore-chiaro.png`, `390-pannello-chiaro.png`. Il mockup usa `../../assets/mockup.css` e il font `../../assets/Geist-Variable.woff2`.

---

## 1. Obiettivo

Far trovare il Menù completo da telefono e da notebook: otto voci in un gruppo, una scheda in home che dice in una riga che cosa richiede attenzione, briciole e voce attiva corrette per ogni percorso. Il pulsante «Ricompila il menù pubblico» **non cambia posto** (sezione 5).

## 2. Navigazione

Tabella di `lib/app/navigation.ts` (D1: tre gruppi, tutte le voci visibili, nessuna a scomparsa). Cambiano solo le voci del gruppo «Menù»; Orari e Prenotazioni restano come sono.

| `id` | Etichetta | Percorso | Icona (`AppNavIconKey`) | Nota |
|---|---|---|---|---|
| `menu-dishes` | Piatti | `/app/menu` | `utensils-crossed` | invariata; resta sulla radice della sezione |
| `menu-wines` | Vini | `/app/menu/wines` | `wine` | invariata |
| `menu-drinks` | Bevande | `/app/menu/drinks` | `cup-soda` | invariata |
| `menu-spirits` | Distillati | `/app/menu/spirits` | **`martini`** | oggi `beer`: la birra è una Bevanda (D1) |
| `menu-fixed` | Menù fissi | `/app/menu/fixed` | **`book-open`** | oggi `list`: il design usa il libro (assunzione, sezione 10) |
| `menu-services` | Servizi | `/app/menu/services` | **`concierge-bell`** | **nuova** |
| `menu-special-days` | Giorni speciali | `/app/menu/special-days` | **`calendar-heart`** | **nuova** |
| `menu-message` | Messaggio globale | `/app/menu/message` | **`megaphone`** | **nuova** |

- `AppNavItemId` e `AppNavIconKey` si estendono con le nuove chiavi; in `app-nav-icon.tsx` si aggiungono `Martini`, `BookOpen`, `ConciergeBell`, `CalendarHeart`, `Megaphone` (tutte in `lucide-react`) e si tolgono `beer` e `list` se non servono più.
- `enabled` passa a `true` quando la pagina della voce esiste (come oggi): una voce non abilitata non compare.
- **Pannello su telefono** (misurato nel prototipo a 390 px): 716 px di contenuto; a 844 px di altezza entra tutto, a 667 px le voci scorrono e restano fissi il blocco «Area App» e quello utente.

### Voce attiva e briciole: difetto da correggere

Oggi sia la voce attiva (`app-sidebar-nav.tsx`, riga 35) sia la briciola (`breadcrumb.ts`, riga 17) scelgono **la prima voce** il cui percorso coincide o è un prefisso (`pathname.startsWith(`${item.href}/`)`). Con «Piatti» su `/app/menu` ogni pagina `/app/menu/…` risulterebbe di «Piatti»: attiva anche «Piatti», briciola «Menù › Piatti» sulla pagina dei vini. Lo stesso difetto è latente tra «Elenco» (`/app/reservations`) e «Eccezioni giorno» (`/app/reservations/day-exceptions`).

**Regola**: tra le voci il cui percorso coincide con quello della pagina o ne è prefisso, vale **quella con il percorso più lungo**; la voce attiva è una sola.

| Percorso | Voce attiva | Briciola |
|---|---|---|
| `/app` | nessuna | Area App |
| `/app/menu` | Piatti | Menù › **Piatti** |
| `/app/menu/wines` | Vini (non Piatti) | Menù › **Vini** |
| `/app/menu/fixed` | Menù fissi | Menù › **Menù fissi** |
| `/app/menu/fixed/categories` | Menù fissi | Menù › Menù fissi › **Categorie** |
| `/app/hours` | Orari | **Orari** |
| `/app/reservations` | Elenco | Prenotazioni › **Elenco** |
| `/app/reservations/day-exceptions` | Eccezioni giorno (non Elenco) | Prenotazioni › **Eccezioni giorno** |

Nelle briciole il primo elemento è il gruppo (collegamento alla prima voce) e, per la sotto-pagina «Categorie», anche «Menù fissi» è un collegamento. Le sotto-pagine si dichiarano in una piccola costante (`/app/menu/fixed/categories` → «Categorie»), non nella tabella delle voci: non sono voci di menu.

### Schede dei Menù fissi come percorsi

Le due schede «Menù fissi» e «Categorie» sono **due percorsi**, `/app/menu/fixed` e `/app/menu/fixed/categories`, con la stessa intestazione e la striscia delle schede (collegamenti, non stato): così il collegamento diretto, il ricarico e il tasto indietro funzionano e le briciole sono corrette. Il prototipo le mostra come stato interno solo per semplicità.

## 3. Home «Oggi»

Una scheda per ogni sezione consentita (D2), nell'ordine Prenotazioni, Menù, Orari. Cambiano il testo della scheda «Menù» e la sua riga di stato.

| Scheda | Descrizione | Riga di stato |
|---|---|---|
| Prenotazioni | «Elenco, eccezioni giorno, impostazioni» | invariata (5.5): «Oggi N coperti · prossima alle HH:mm» |
| **Menù** | **«Piatti, vini, bevande, menù fissi e altro»** | **«{1 piatto terminato \| N piatti terminati}» o «Nessun piatto terminato»** |
| Orari | «Ristorante, B&B, giorni di riposo, chiusure» | invariata (8.5) |

**Riga del Menù** (D2, che diceva «N piatti non disponibili»; scelta di Mirko del 2026-10-15):
- Conta i piatti con `soldOut` vero **in quel momento** (`payload.count` su `dishes` con `where: { soldOut: { equals: true } }`, `overrideAccess: false`, sessione dell'utente, nessuna cache: si calcola a ogni richiesta di `/app`). I piatti **disabilitati non contano**: sono assenze volute e stabili, e la riga serve a sapere «che cosa manca stasera».
- «Terminato» vale fino all'inizio del servizio successivo (`schermate/piatti/spec.md`): tra un servizio e l'altro la riga conta piatti che si azzereranno all'apertura.
- Stati (D2): **dati** → la riga con il testo; **zero** → «Nessun piatto terminato»; **caricamento** → `Skeleton` alla stessa altezza della riga; **errore di lettura** → la riga non compare e la scheda resta navigabile.
- La riga compare solo per chi vede la sezione Menù (`canAccessSection(user, 'menu')`), come la scheda.
- La scheda collega a `/app/menu` (Piatti), come oggi.

## 4. Titoli di pagina

Titolo del documento «{Pagina} · Area App» (`schermate/shell/spec.md`): Piatti, Vini, Bevande, Distillati, Menù fissi, Servizi, Giorni speciali, Messaggio globale. La pagina «Categorie» ha lo stesso titolo di «Menù fissi».

## 5. «Ricompila il menù pubblico»

**Resta nell'intestazione di ogni elenco** (scelta A di Mirko, 2026-10-15), come già disegnato: Piatti, Vini, Bevande, Distillati, Menù fissi (sopra le schede, quindi presente anche in «Categorie»), Servizi, Giorni speciali. **Non c'è** nel Messaggio globale (cambia senza ricompilare) né in home. È un solo componente con una sola logica (`schermate/piatti/spec.md`). Non si aggiunge il pulsante dentro gli avvisi né nella scheda della home.

## 6. Stati

| Stato | Cosa si vede | Riferimento |
|---|---|---|
| Home con la riga del Menù | Titolo «Oggi», tre schede; nel Menù «3 piatti terminati» | `*-chiaro.png`, `*-scuro.png` |
| Un piatto | «1 piatto terminato» | `390-riga-un-piatto-chiaro.png` |
| Nessun piatto terminato | «Nessun piatto terminato» | `390-riga-zero-chiaro.png` |
| Riga in caricamento | `Skeleton` alla stessa altezza della riga | `390-riga-caricamento-chiaro.png` |
| Errore di lettura | La riga non compare, la scheda resta | `390-riga-errore-chiaro.png` |
| Pannello di navigazione | Otto voci del Menù, Orari, tre di Prenotazioni, blocco utente | `390-pannello-chiaro.png` |

Le righe di Prenotazioni e Orari mostrano nel mockup i loro testi di esempio, perché dipendono da altre sottofasi.

## 7. Testi

| Dove | Testo |
|---|---|
| Home | Titolo «Oggi» / «Situazione di oggi e accesso alle sezioni.» (con le righe di stato attive); «Area App» / «Scegli una sezione.» senza righe |
| Scheda Menù | Titolo «Menù» / «Piatti, vini, bevande, menù fissi e altro» / riga «{1 piatto terminato \| N piatti terminati}» o «Nessun piatto terminato» |
| Menu | Gruppi «Menù» (otto voci), «Orari» (Orari), «Prenotazioni» (Elenco, Eccezioni giorno, Impostazioni); etichette delle voci come nella tabella della sezione 2 |
| Pannello su telefono | Titolo per lo screen reader «Menu»; descrizione «Menu di navigazione dell’Area App.»; chiusura «Chiudi» (invariati) |

## 8. Comportamenti

1. **Voce attiva unica**: la sola voce con il percorso più lungo che combacia; nessuna voce attiva in `/app`.
2. **Briciole** come nella tabella della sezione 2; il primo elemento è un collegamento al gruppo (prima voce del gruppo).
3. **Riga del Menù**: letta a ogni apertura della home, senza aggiornamento automatico a pagina aperta.
4. **Voci non abilitate**: non compaiono; la 6.6 le accende una a una quando la pagina esiste.
5. **Accesso**: le voci e le schede si mostrano per `canAccessSection(user, section)`; un utente senza la sezione Menù non vede né le voci né la scheda né la riga.
6. **Tema e tocco**: come D4 e D6.

## 9. Componenti da installare e da comporre

- **Da installare**: nessun componente nuovo (`Skeleton`, `Card` e `Sidebar` ci sono dalla 8.2).
- **Da modificare**: `lib/app/navigation.ts` (otto voci, `HOME_SECTION_CARDS`), `lib/app/nav-icon-keys.ts` e `components/app/app-nav-icon.tsx` (nuove icone), `components/app/shell/app-sidebar-nav.tsx` e `lib/app/breadcrumb.ts` (percorso più lungo, sotto-pagine), `components/app/home/section-card.tsx` (riga di stato del Menù).
- **Logica pura in `lib/`** (con test): scelta della voce attiva e briciole con la regola del percorso più lungo (test unitari per tutti i percorsi della tabella, comprese `/app/menu/wines` e `/app/reservations/day-exceptions`); testo della riga di stato del Menù (singolare, plurale, zero).
- **Eccezioni alla regola UI** (`ui-check-allow`): nessuna.

## 10. Checklist di accettazione

Si verifica con Playwright. Controlli comuni **C1–C10** di `modello-specifica-schermata.md`. Specifici:

1. **Otto voci** nel gruppo «Menù», con le icone della tabella; ogni voce compare solo se la pagina esiste (`enabled`).
2. **Voce attiva unica** per ogni percorso della tabella della sezione 2, in particolare `/app/menu/wines` (solo Vini) e `/app/reservations/day-exceptions` (solo Eccezioni giorno). Test unitario e prova nel browser.
3. **Briciole** per tutti i percorsi della tabella, comprese «Menù › Menù fissi › Categorie» e il collegamento «Menù fissi»; test unitari in `breadcrumb.test.ts`.
4. **Schede dei Menù fissi come percorsi**: `/app/menu/fixed/categories` apre la scheda «Categorie»; il ricarico e il tasto indietro la conservano.
5. **Home**: la descrizione della scheda «Menù» è «Piatti, vini, bevande, menù fissi e altro»; la riga dice «3 piatti terminati» con tre piatti `soldOut` veri, «1 piatto terminato» con uno, «Nessun piatto terminato» con zero; un piatto disabilitato non conta; segnando «terminato» un piatto e riaprendo la home il numero cambia.
6. **Riga con sessione utente**: la scheda e la riga compaiono per manager, admin e super-admin; un utente senza la sezione Menù non le vede (`canAccessSection(user, 'menu')`). La lettura usa `overrideAccess: false`.
7. **Stati della riga**: caricamento con `Skeleton` alla stessa altezza; con un errore di lettura simulato la riga non compare e la scheda resta navigabile. *Provato nel prototipo.*
8. **Nessuno scorrimento orizzontale** a 360, 390 e 1280 px in home e con il pannello aperto; **nessun elemento sotto 44 px** a 390 px con tocco simulato. *Misurato nel prototipo il 2026-10-15: home a 360, 390 e 1280 px, pannello aperto a 390 px, nessuno.*
9. **Pannello su telefono**: a 844 px di altezza entra tutto; a 667 px le voci scorrono e restano fissi il blocco «Area App» e il blocco utente. *Misurato nel prototipo il 2026-10-14 (D1).*
10. **Ricompila**: presente nelle intestazioni di Piatti, Vini, Bevande, Distillati, Menù fissi (anche nella scheda «Categorie»), Servizi e Giorni speciali; assente nel Messaggio globale e in home.
11. **Titoli di pagina** «{Pagina} · Area App» per le otto voci.
12. **Temi, accesso, `pnpm ui:check`**: C3, C4 (`canAccessSection(user, 'menu')`), C9.
13. **Confronto visivo** con i PNG di riferimento a 390 e 1280 px, in tema chiaro e scuro (C10).

## 11. Scelte confermate, assunzioni e debiti

**Scelte confermate da Mirko il 2026-10-15**
- **Riga di stato del Menù** = piatti **terminati** («{N} piatti terminati», «Nessun piatto terminato»); i disabilitati non contano.
- **«Ricompila il menù pubblico» resta nell'intestazione di ogni elenco** (A).
- **Descrizione della scheda «Menù»**: «Piatti, vini, bevande, menù fissi e altro».
- Già deciso prima: otto voci in un gruppo, icone di Distillati, Servizi, Giorni speciali e Messaggio globale, percorsi `/app/menu/…` (D1).

**Assunzioni ancora da confermare**
1. **Icona di «Menù fissi»**: `book-open` (come nel design) al posto di `list` del codice.
2. **Schede dei Menù fissi come percorsi** (`/app/menu/fixed` e `/app/menu/fixed/categories`), non come stato della pagina.
3. **Regola del percorso più lungo** per voce attiva e briciole, con le sotto-pagine in una costante.
4. **Nessuna cache** sul conteggio della riga: una piccola richiesta a ogni apertura di `/app`.
5. **Home senza il pulsante «Ricompila»**: nessuna scorciatoia in home.

**Debiti futuri e punti aperti**
- **Stato di pubblicazione** del menù (cambiamenti non ancora ricompilati): non tracciato; oggi gli avvisi dopo ogni modifica lo ricordano.
- **Riga «Oggi»**: altre informazioni utili del Menù (per esempio il prossimo giorno speciale) non previste.
- **Latenza della riga**: se il conteggio dovesse pesare, una cache breve; da valutare con l'uso.
