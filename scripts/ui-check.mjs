#!/usr/bin/env node
/**
 * pnpm ui:check — controlli sul livello presentazionale dell'Area App.
 * Regole: .cursor/rules/ui/01-ui-app-invarianti.mdc. Nessuna dipendenza.
 *
 * Controlla:
 *  - le schermate (`app/(app)/**`) e i componenti di composizione (`components/app/**`);
 *  - le deviazioni delle dimensioni di tocco (D6) e dei testi in italiano (T1) nei file di `components/ui` (docs/design/decisioni-layout-app.md);
 *  - `app/(app)/app-ui.css` (patch di docs/design/patch-app-ui-css.md);
 *  - controlli statici della policy dei test v2 (docs/design/verifica/policy-test.md §10): R11 `Select` senza `items`,
 *    R12 `overrideAccess: true` nelle schermate, R13 file di esito modificati, R14 contratto del nucleo di L1.
 *
 * Eccezione puntuale: un commento `ui-check-allow: <motivo>` sulla riga o sulla riga precedente.
 * Il motivo è obbligatorio e va riportato nella sezione «componenti di composizione» della specifica.
 *
 * Uso: node scripts/ui-check.mjs [--root=<cartella>] [--list-allows]
 * Esce con 1 se trova violazioni.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const args = process.argv.slice(2)
const ROOT = (args.find((a) => a.startsWith('--root=')) ?? '').slice(7) || process.cwd()
const LIST_ALLOWS = args.includes('--list-allows')

const SCREEN_DIRS = ['app/(app)', 'components/app']
const APP_CSS = 'app/(app)/app-ui.css'
const UI_DIR = 'components/ui'

const PALETTE =
  '(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)'
const COLOR_UTIL = '(?:bg|text|border|ring|fill|stroke|from|via|to|divide|outline|shadow|decoration|accent|caret|placeholder)'

/** Regole sulle righe di codice delle schermate e dei componenti di composizione. */
const LINE_RULES = [
  {
    id: 'R1',
    name: 'colore letterale',
    test: (l) => /(?<![&\w/])#[0-9a-fA-F]{3,8}\b/.test(l) || /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color-mix)\(/.test(l),
    hint: 'usare solo colori semantici (bg-background, text-muted-foreground, bg-primary, ...)',
  },
  {
    id: 'R2',
    name: 'colore della palette Tailwind',
    test: (l) => new RegExp(`\\b${COLOR_UTIL}-${PALETTE}-\\d{2,3}\\b`).test(l) || new RegExp(`\\b(?:bg|text|border|ring|fill|stroke)-(?:white|black)\\b(?!-)`).test(l),
    hint: 'usare solo colori semantici',
  },
  {
    id: 'R3',
    name: 'valore arbitrario Tailwind',
    test: (l) => /[a-z0-9%)]-\[[^\]]+\]/i.test(l) || /\[&[^\]]*\]/.test(l),
    hint: 'nessun valore o variante arbitraria nelle schermate: se serve, componente mancante o deviazione da approvare',
  },
  { id: 'R4', name: 'stile in linea', test: (l) => /\bstyle\s*=\s*\{/.test(l), hint: 'nessun `style={...}`' },
  {
    id: 'R5',
    name: 'elemento nativo fuori da components/ui',
    test: (l) => /<(?:button|select|textarea|label|table|thead|tbody|tr|td|th|dialog)\b/.test(l) || /<input\b(?![^>]*\btype=["']hidden["'])/.test(l),
    hint: 'usare Button, Input, Select, Textarea, FieldLabel, Table, Dialog di components/ui',
  },
  { id: 'R6', name: 'prefisso dark:', test: (l) => /(?:^|[\s"'`])dark:/.test(l), hint: 'il tema passa dai token, non da `dark:` nelle schermate' },
  {
    id: 'R7',
    name: 'libreria UI importata fuori da components/ui',
    test: (l) => /from\s+['"](?:@base-ui\/react|@radix-ui\/|vaul|sonner|cmdk|react-aria|@headlessui\/)/.test(l),
    hint: 'si importano solo componenti da `@/components/ui/...`',
  },
  {
    id: 'R12',
    name: '`overrideAccess: true` nella schermata',
    test: (l) => /overrideAccess\s*:\s*true/.test(l),
    hint: 'le schermate leggono e scrivono con la sessione dell\'utente (`overrideAccess: false`)',
  },
  {
    id: 'R8',
    name: 'dimensione di tocco nella schermata',
    test: (l) => /\bpointer-(?:coarse|fine):/.test(l),
    hint: 'le dimensioni di tocco stanno nei componenti di components/ui (D6), non nelle schermate',
  },
]

/** Controlli sui file di components/ui: la deviazione D6 deve essere presente (solo se il file esiste). */
const UI_MARKERS = [
  ['button.tsx', /pointer-coarse:h-11/g, 3, 'Button: `pointer-coarse:h-11` su default, xs, sm, lg'],
  ['button.tsx', /pointer-coarse:size-11/g, 3, 'Button: `pointer-coarse:size-11` sulle varianti icon'],
  ['input.tsx', /pointer-coarse:h-11/g, 1, 'Input: `pointer-coarse:h-11`'],
  ['select.tsx', /pointer-coarse:data-\[size=default\]:h-11/g, 1, 'Select: altezza del trigger'],
  ['select.tsx', /pointer-coarse:py-3/g, 1, 'Select: altezza delle voci'],
  ['toggle.tsx', /pointer-coarse:h-11/g, 3, 'Toggle: altezze delle dimensioni'],
  ['toggle.tsx', /aria-pressed:bg-primary/g, 1, 'Toggle: stato selezionato evidente'],
  ['sidebar.tsx', /pointer-coarse:h-11/g, 3, 'Sidebar: voci del menu, sotto-voci, campo'],
  ['dropdown-menu.tsx', /pointer-coarse:py-3/g, 1, 'DropdownMenu: altezza delle voci'],
  ['tabs.tsx', /pointer-coarse:h-11/g, 1, 'Tabs: altezza della scheda'],
  ['tabs.tsx', /pointer-coarse:group-data-horizontal\/tabs:h-auto/g, 1, 'Tabs: altezza della lista'],
  ['breadcrumb.tsx', /pointer-coarse:after:-inset-3\.5/g, 1, 'Breadcrumb: area di tocco del collegamento'],
  ['sheet.tsx', /sticky bottom-0 border-t bg-popover/g, 1, 'Sheet: footer agganciato in fondo'],
  ['sheet.tsx', /max-h-\[90svh\]/g, 1, 'Sheet: altezza massima del foglio dal basso'],
  ['checkbox.tsx', /pointer-coarse:after:-inset-4/g, 1, 'Checkbox: area di tocco da 46 px'],
  ['switch.tsx', /pointer-coarse:after:-inset-y-3\.5/g, 1, 'Switch: area di tocco'],
]

/** Testi di default in inglese dei componenti shadcn: l'interfaccia è solo in italiano (anche per lo screen reader). */
const UI_ENGLISH = [
  [/Toggle Sidebar/, '«Toggle Sidebar» → «Apri o chiudi il menu»'],
  [/Displays the mobile sidebar/, '«Displays the mobile sidebar.» → «Menu di navigazione dell’Area App.»'],
  [/<SheetTitle>Sidebar<\/SheetTitle>/, '«Sidebar» → «Menu»'],
  [/<span className="sr-only">Close<\/span>/, '«Close» → «Chiudi»'],
  [/aria-label="breadcrumb"/, '«breadcrumb» → «Percorso»'],
  [/<span className="sr-only">More<\/span>/, '«More» → «Altro»'],
  [/sr-only">(?:Previous|Next)(?: page)?<\/span>/, '«Previous» e «Next» → «Precedente» e «Successivo»'],
]

const problems = []
const allows = []
const add = (file, line, id, name, detail) => problems.push({ file, line, id, name, detail })

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}
const rel = (p) => relative(ROOT, p).split(sep).join('/')
const isComment = (l) => /^\s*(?:\/\/|\/\*|\*|\{\/\*)/.test(l)
const allowOn = (lines, i) => {
  const m = (s) => s && s.match(/ui-check-allow:\s*(.*?)\s*(?:\*\/\}?|-->)?\s*$/)
  // Sulla stessa riga, oppure su una riga precedente fatta solo di commento (non sconfina da una riga di codice).
  const prevIsOnlyComment = i > 0 && /^\s*(?:\/\/|\{\/\*|\/\*)/.test(lines[i - 1])
  return m(lines[i]) ?? (prevIsOnlyComment ? m(lines[i - 1]) : null)
}

/* 1. Schermate e componenti di composizione */
for (const dir of SCREEN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    const r = rel(file)
    if (r === APP_CSS) continue
    if (file.endsWith('.css')) {
      add(r, 1, 'R9', 'file CSS di schermata', 'nessun CSS di schermata: i token stanno solo in app-ui.css')
      continue
    }
    if (!/\.(?:ts|tsx)$/.test(file)) continue
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      if (isComment(line) && !/ui-check-allow/.test(line)) return
      for (const rule of LINE_RULES) {
        if (!rule.test(line)) continue
        const allow = allowOn(lines, i)
        if (allow) {
          allows.push({ file: r, line: i + 1, rule: rule.id, reason: allow[1] })
          if (allow[1].length < 5) add(r, i + 1, rule.id, 'ui-check-allow senza motivo', 'scrivere il motivo (almeno 5 caratteri) e riportarlo nella specifica')
          continue
        }
        add(r, i + 1, rule.id, rule.name, `${line.trim().slice(0, 110)}  →  ${rule.hint}`)
      }
      const imp = line.match(/from\s+['"]@\/components\/ui\/([\w-]+)['"]/)
      if (imp && !existsSync(join(ROOT, UI_DIR, `${imp[1]}.tsx`))) {
        add(r, i + 1, 'R10', 'componente non installato', `components/ui/${imp[1]}.tsx non esiste: componente mancante, fermarsi e chiedere`)
      }
    })
  }
}

/* 1-bis. R11: `Select` senza `items` (A8: il trigger mostra «all» invece dell'etichetta) */
function selectsWithoutItems(src) {
  const found = []
  const rx = /<Select(?![A-Za-z0-9])/g
  let m
  while ((m = rx.exec(src))) {
    let depth = 0
    let end = src.length
    for (let i = m.index + m[0].length; i < src.length; i++) {
      const ch = src[i]
      if (ch === '{') depth++
      else if (ch === '}') depth--
      else if (ch === '>' && depth === 0) {
        end = i
        break
      }
    }
    const tag = src.slice(m.index, end)
    if (!/\bitems\s*=/.test(tag) && !/\{\s*\.\.\./.test(tag)) found.push(src.slice(0, m.index).split('\n').length)
  }
  return found
}
for (const dir of SCREEN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    if (!file.endsWith('.tsx')) continue
    const lines = readFileSync(file, 'utf8').split('\n')
    for (const ln of selectsWithoutItems(lines.join('\n'))) {
      const allow = allowOn(lines, ln - 1)
      if (allow) {
        allows.push({ file: rel(file), line: ln, rule: 'R11', reason: allow[1] })
        if (allow[1].length < 5) add(rel(file), ln, 'R11', 'ui-check-allow senza motivo', 'scrivere il motivo (almeno 5 caratteri)')
        continue
      }
      add(rel(file), ln, 'R11', '`Select` senza `items`', 'passare `items` al `Select`: senza, il trigger mostra il valore grezzo (A8)')
    }
  }
}

/* 1-ter. R12 anche negli helper delle schermate fuori da SCREEN_DIRS (come il controllo NO-OVERRIDE di controlli-6.6.json) */
for (const dir of ['lib/app', 'lib/menu/ui']) {
  for (const file of walk(join(ROOT, dir))) {
    if (!/\.(?:ts|tsx)$/.test(file)) continue
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      if (isComment(line) && !/ui-check-allow/.test(line)) return
      if (!/overrideAccess\s*:\s*true/.test(line)) return
      const allow = allowOn(lines, i)
      if (allow) {
        allows.push({ file: rel(file), line: i + 1, rule: 'R12', reason: allow[1] })
        if (allow[1].length < 5) add(rel(file), i + 1, 'R12', 'ui-check-allow senza motivo', 'scrivere il motivo (almeno 5 caratteri)')
        return
      }
      add(rel(file), i + 1, 'R12', '`overrideAccess: true` in un helper delle schermate', 'leggere e scrivere con la sessione dell\'utente (`overrideAccess: false`)')
    })
  }
}

/* 2. Deviazioni D6 nei componenti installati */
for (const [name, rx, min, label] of UI_MARKERS) {
  const p = join(ROOT, UI_DIR, name)
  if (!existsSync(p)) continue
  const n = (readFileSync(p, 'utf8').match(rx) ?? []).length
  if (n < min) add(`${UI_DIR}/${name}`, 1, 'D6', 'deviazione D6 mancante', `${label} (trovate ${n}, attese almeno ${min}); vedi docs/design/installazione-componenti-ui.md`)
}

/* 2-bis. Testi in inglese nei componenti installati (T1) */
for (const file of walk(join(ROOT, UI_DIR))) {
  if (!file.endsWith('.tsx')) continue
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    for (const [rx, hint] of UI_ENGLISH) if (rx.test(line)) add(rel(file), i + 1, 'T1', 'testo in inglese in un componente', `${hint}; vedi docs/design/installazione-componenti-ui.md`)
  })
}

/* 3. app-ui.css */
const cssPath = join(ROOT, APP_CSS)
if (existsSync(cssPath)) {
  const css = readFileSync(cssPath, 'utf8')
  const need = [
    [/overflow-x:\s*clip/, '`overflow-x: clip` su html e body (con `hidden` le barre agganciate non funzionano)'],
    [/:root\s*\{[^}]*color-scheme:\s*light/, '`:root { color-scheme: light }`'],
    [/\.dark\s*\{[^}]*color-scheme:\s*dark/, '`.dark { color-scheme: dark }`'],
    [/--destructive:\s*oklch\(0\.505 0\.21 22\)/, '`--destructive` chiaro: oklch(0.505 0.21 22)'],
    [/\.dark\s*\{[^}]*--sidebar-primary:\s*oklch\(0\.922 0 0\)/, '`--sidebar-primary` neutro in `.dark`: oklch(0.922 0 0)'],
  ]
  for (const [rx, label] of need) if (!rx.test(css)) add(APP_CSS, 1, 'C1', 'patch di app-ui.css mancante', `${label}; vedi docs/design/patch-app-ui-css.md`)
  if (/overflow-x:\s*hidden/.test(css)) add(APP_CSS, 1, 'C1', 'overflow-x: hidden presente', 'sostituire con `overflow-x: clip`')
  css.split('\n').forEach((line, i) => {
    if (/^\.[a-zA-Z]/.test(line) && !/^\.dark\b/.test(line)) add(APP_CSS, i + 1, 'C2', 'classe CSS personalizzata', `${line.trim().slice(0, 80)}  →  nessuna classe personalizzata: usare i componenti di components/ui`)
  })
}

/* 4. R13: i file di esito già versionati non si modificano (ogni giro scrive in una cartella nuova; policy-test §9) */
try {
  const out = execFileSync('git', ['-C', ROOT, 'status', '--porcelain', '--', 'docs/design/verifica/esiti'], { encoding: 'utf8', timeout: 10_000, stdio: ['ignore', 'pipe', 'ignore'] })
  for (const l of out.split('\n').filter(Boolean)) {
    const st = l.slice(0, 2)
    if (st === '??') continue // cartella o file nuovo: va bene
    if (st[1] === ' ') continue // già in staging: modifica o cancellazione deliberata (git add, git rm)
    add(l.slice(3).trim(), 1, 'R13', 'file di esito versionato modificato', 'un giro non riscrive un esito esistente: `git checkout -- docs/design/verifica/esiti` e usa una cartella nuova (E2E_ESITI)')
  }
} catch {
  // non è un repository git o git non c'è: il controllo non si applica
}

/* 5. R14: contratto del nucleo di L1 in controlli-6.6.json (policy-test §3) */
const CONTROLLI_66 = 'docs/design/verifica/controlli-6.6.json'
if (existsSync(join(ROOT, CONTROLLI_66))) {
  try {
    const data = JSON.parse(readFileSync(join(ROOT, CONTROLLI_66), 'utf8'))
    for (const screen of data.schermate ?? []) {
      let nucleo = 0
      for (const c of screen.controlli ?? []) {
        if (c.livello !== 1 && c.livello !== 2) add(CONTROLLI_66, 1, 'R14', 'livello non valido', `${c.id}: livello ${JSON.stringify(c.livello)} (ammessi 1 e 2)`)
        if (c.livello === 1 && c.tipo !== 'comando') nucleo++
        if (c.livello === 1 && c.stato_prova) add(CONTROLLI_66, 1, 'R14', 'controllo non provabile in L1', `${c.id}: ha \`stato_prova\`, resterebbe sempre NON PROVATO; va in L2`)
      }
      if (nucleo > 8) add(CONTROLLI_66, 1, 'R14', 'nucleo di L1 oltre otto', `${screen.id}: ${nucleo} controlli di livello 1 (esclusi i \`comando\`); il tetto è otto (policy-test §3)`)
    }
  } catch (e) {
    add(CONTROLLI_66, 1, 'R14', 'JSON non leggibile', String(e.message).slice(0, 100))
  }
}

/* Esito */
if (LIST_ALLOWS) {
  console.log(`ui-check-allow: ${allows.length}`)
  for (const a of allows) console.log(`  ${a.file}:${a.line}  ${a.rule}  ${a.reason}`)
}
if (problems.length === 0) {
  console.log(`ui:check ok (eccezioni dichiarate: ${allows.length})`)
  process.exit(0)
}
for (const p of problems) console.log(`${p.file}:${p.line}  ${p.id} ${p.name}: ${p.detail}`)
const byId = problems.reduce((m, p) => ((m[p.id] = (m[p.id] ?? 0) + 1), m), {})
console.log(`\nui:check: ${problems.length} problemi (${Object.entries(byId).map(([k, v]) => `${k}: ${v}`).join(', ')}), eccezioni dichiarate: ${allows.length}`)
process.exit(1)
