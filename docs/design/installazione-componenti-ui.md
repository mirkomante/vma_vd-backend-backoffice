# Installazione dei componenti shadcn e deviazioni D6

Guida per installare i componenti di `components/ui` nello stile `base-nova` e per applicare le **deviazioni delle dimensioni di tocco** (D6 di `decisioni-layout-app.md`). È richiamata dalla regola `.cursor/rules/ui/01-ui-app-invarianti.mdc`.

**Stato**: preparata il 2026-10-10 su sorgenti provati nel prototipo: repository `shadcn-ui/ui`, commit `2d3f1cd` (2026-10-09), `apps/v4/registry/bases/base/ui` e `styles/style-nova.css`. Con le versioni del progetto (React 19.2.8, Tailwind 4.3.3, `lucide-react` 1.52.0, `class-variance-authority` 0.7.1, `cn` 0.4.0, `tw-animate-css` 1.4.0) e `@base-ui/react` 1.9.0.

## 1. Prima di installare

- `components.json` è già pronto: stile `base-nova`, `tailwind.css` su `app/(app)/app-ui.css`, alias `@/components/ui`, `@/lib/utils`, `@/hooks`. Non toccarlo.
- **Prima** si applica la patch di `app-ui.css` (`docs/design/patch-app-ui-css.md`): i componenti agganciati (barra in alto, barra di salvataggio, footer dei fogli) non funzionano con `overflow-x: hidden`.
- **`base-nova` poggia su `@base-ui/react`, non su Radix.** Il progetto non la ha ancora: la CLI la aggiunge con il primo componente. Fissarla a versione esatta (nel progetto le versioni sono senza `^`) e riportarla nel CHANGELOG, come in 8.1.
- Si installano **solo i componenti che servono alla sottofase in corso** (8.1): vedi la tabella della sezione 2.
- Comando: `pnpm exec shadcn add <nome>` (la CLI è già una dipendenza, versione fissata; non usare `@latest`). Su richiesta di sovrascrittura di un file esistente rispondere no e fermarsi: significa che il componente è già installato.

## 2. Che cosa installare, e quando

La CLI aggiunge da sola le dipendenze tra componenti (per esempio `sidebar` porta `button`, `input`, `separator`, `sheet`, `skeleton`, `tooltip` e l'hook `use-mobile`).

| Sottofase | Componenti |
|---|---|
| 8.2 shell, accesso, home | `sidebar`, `button`, `separator`, `sheet`, `tooltip`, `skeleton`, `avatar`, `dropdown-menu`, `breadcrumb`, `card`, `collapsible`, `field`, `label`, `input`, `alert`, `spinner` |
| 8.5 Orari | in più: `toggle`, `toggle-group`, `alert-dialog` |
| 5.5 Prenotazioni | in più: `tabs`, `table`, `badge`, `textarea`, `checkbox`, `select` |
| 6.6 Menù | in più: `switch` |

L'elenco è provvisorio per le sottofasi non ancora disegnate (accesso, home, vini, bevande, distillati, menù fissi, servizi): ogni specifica di schermata elenca i componenti che usa nella sua sezione 8, e fa fede quella.

## 3. Deviazioni D6: applicarle subito dopo ogni installazione

Regola: **ogni elemento interattivo ha un'area di tocco di almeno 44 px sui dispositivi touch** (`pointer-coarse:`), e le misure standard di Nova restano con il mouse. Si ottiene **solo nei componenti**, mai nelle schermate. La tabella dà l'**intento** e un **esempio di sostituzione** sul testo generato dalla CLI (versione dei sorgenti sopra). Se il testo da cercare non c'è (la CLI ha ordinato o scritto le classi in modo diverso), **non indovinare**: applicare l'intento in modo equivalente e riferire, perché il registro potrebbe richiedere un aggiornamento. `pnpm ui:check` verifica la presenza delle deviazioni.

| File | Intento | Cerca (esempio) | Sostituisci con |
|---|---|---|---|
| `button.tsx` | Ogni dimensione ha altezza 44 px su touch; le varianti icona 44 × 44 | `default: "h-8 gap-1.5` · `xs: "h-6 gap-1` · `sm: "h-7 gap-1` · `lg: "h-9 gap-1.5` | aggiungere `pointer-coarse:h-11` dopo l'altezza (es. `default: "h-8 pointer-coarse:h-11 gap-1.5`) |
| | | `icon: "size-8"` · `"icon-xs": "size-6 ` · `"icon-sm": "size-7 ` · `"icon-lg": "size-9"` | aggiungere `pointer-coarse:size-11` (es. `icon: "size-8 pointer-coarse:size-11"`) |
| `input.tsx` | Campo alto 44 px | ` h-8 ` | ` h-8 pointer-coarse:h-11 ` |
| `select.tsx` | Trigger e voci alti 44 px | `data-[size=default]:h-8` · `data-[size=sm]:h-7` | `…:h-8 pointer-coarse:data-[size=default]:h-11` · `…:h-7 pointer-coarse:data-[size=sm]:h-11` |
| | | `rounded-md py-1 pr-8` (SelectItem) | `rounded-md py-1 pointer-coarse:py-3 pr-8` |
| `toggle.tsx` | Dimensioni 44 px; **stato selezionato evidente** | `default: "h-8 min-w-8` · `sm: "h-7 min-w-7` · `lg: "h-9 min-w-9` | aggiungere `pointer-coarse:h-11 pointer-coarse:min-w-11` |
| | | `aria-pressed:bg-muted` · `data-[state=on]:bg-muted` | `aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90 aria-pressed:hover:text-primary-foreground` · `data-[state=on]:bg-primary data-[state=on]:text-primary-foreground` |
| `sidebar.tsx` | Voci del menu, sotto-voci e campo alti 44 px | `default: "h-8 text-sm"` · `sm: "h-7 text-xs"` · `bg-background h-8 w-full` · `h-7 gap-2` (SidebarMenuSubButton) | aggiungere `pointer-coarse:h-11` dopo l'altezza |
| `dropdown-menu.tsx` | Voci alte 44 px | `gap-1.5 rounded-md py-1 pr-8 pl-1.5` (voci con spunta e radio) · `gap-1.5 rounded-md px-1.5 py-1 text-sm` (voce e sotto-menu) | aggiungere `pointer-coarse:py-3` dopo `py-1` |
| `tabs.tsx` | Scheda alta 44 px, lista che la contiene | `group-data-horizontal/tabs:h-8` (lista) | `group-data-horizontal/tabs:h-8 pointer-coarse:group-data-horizontal/tabs:h-auto` |
| | | `relative inline-flex h-[calc(100%-1px)] flex-1` (scheda) | `relative inline-flex h-[calc(100%-1px)] pointer-coarse:h-11 flex-1` |
| `breadcrumb.tsx` | Area di tocco del collegamento (anche in orizzontale) | `cn("hover:text-foreground transition-colors", className)` (BreadcrumbLink) | `cn("hover:text-foreground transition-colors pointer-coarse:relative pointer-coarse:after:absolute pointer-coarse:after:-inset-3.5", className)` |
| `checkbox.tsx` | Area di tocco da 46 px (parte dal bordo interno: `-inset-3.5` darebbe solo 42 px) | `flex size-4 items-center justify-center rounded-[4px] border` | `relative flex size-4 items-center justify-center rounded-[4px] border pointer-coarse:after:absolute pointer-coarse:after:-inset-4` |
| `switch.tsx` | Area di tocco da 54 × 44 px | `after:-inset-x-3 after:-inset-y-2` | `after:-inset-x-3 after:-inset-y-2 pointer-coarse:after:-inset-y-3.5` |
| `sheet.tsx` | Il foglio scorre e non supera il 90 % dello schermo (dal basso); **il footer resta agganciato in fondo** | `bg-popover text-popover-foreground fixed z-50 flex flex-col gap-4` (SheetContent) | `… flex flex-col gap-4 overflow-y-auto data-[side=bottom]:max-h-[90svh]` |
| | | `"gap-2 p-4 mt-auto flex flex-col"` (SheetFooter) | `"gap-2 p-4 mt-auto flex flex-col sticky bottom-0 border-t bg-popover"` |

**Testi in italiano (T1)**: i componenti hanno testi di default in inglese per lo screen reader. Applicarli subito dopo l'installazione, insieme alle deviazioni D6; `pnpm ui:check` segnala quelli rimasti.

| File | Cerca | Sostituisci con |
|---|---|---|
| `sidebar.tsx` | `<SheetTitle>Sidebar</SheetTitle>` | `<SheetTitle>Menu</SheetTitle>` |
| | `Displays the mobile sidebar.` | `Menu di navigazione dell’Area App.` |
| | `Toggle Sidebar` (nel pulsante, nel margine `aria-label` e `title`) | `Apri o chiudi il menu` |
| `sheet.tsx` | `<span className="sr-only">Close</span>` | `<span className="sr-only">Chiudi</span>` |
| `breadcrumb.tsx` | `aria-label="breadcrumb"` | `aria-label="Percorso"` |
| | `<span className="sr-only">More</span>` | `<span className="sr-only">Altro</span>` |

Se si installano altri componenti con testi in inglese (per esempio paginazione o calendario), si traducono nello stesso modo e si aggiungono qui e a `scripts/ui-check.mjs`.

Componenti non ancora adattati perché non usati nelle schermate disegnate: `radio-group`, `calendar`, `pagination`, e i collegamenti dentro il testo. Se servono, si adattano nello stesso passo in cui si installano e si aggiungono qui e in `scripts/ui-check.mjs`.

## 4. Dopo l'installazione

1. Applicare le deviazioni della tabella ai soli componenti appena installati.
2. `pnpm ui:check`: gli errori «deviazione D6 mancante» indicano che cosa manca.
3. Aggiornare o reinstallare un componente **cancella le deviazioni**: ripetere i passi 1 e 2.
4. Non modificare un file di `components/ui` per l'esigenza di una singola schermata. Una nuova deviazione si propone con nome del componente, classi e motivo; se approvata, si aggiunge a questa tabella e ai marcatori di `scripts/ui-check.mjs`.

## 5. Che cosa non serve copiare dal prototipo

Gli attributi `data-component`, `data-variant`, `data-size` e `data-block` dei mockup servono solo a descrivere la struttura nella specifica. L'implementazione non deve emetterli.
