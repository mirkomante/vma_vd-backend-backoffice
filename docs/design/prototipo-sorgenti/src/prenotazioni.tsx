import * as React from "react"
import { Plus, Search, SlidersHorizontal, ChevronLeft, ChevronRight, MoreHorizontal, X, CircleCheck, CircleAlert, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useIsMobile } from "@/hooks/use-mobile"
import { Shell, GroupedFlatMenu, crumbs } from "./layouts"

/* ---------- dati di esempio (nel progetto: Collection Prenotazioni) ---------- */
type Stato = "confermata" | "in-attesa" | "rifiutata" | "cancellata" | "no-show"
type Canale = "sito" | "telefono" | "di-persona" | "thefork"
type Servizio = "lunch" | "dinner"
type Res = { id: number; date: string; time: string; nome: string; cognome: string; email: string; tel: string; persone: number; servizio: Servizio; canale: Canale; stato: Stato; note?: string; annullataDa?: "utente" | "staff"; motivo?: string; anon?: boolean }
const NOW = { date: "2026-10-10", time: "15:30" } // data e ora simulate
const mk = (id: number, date: string, time: string, cognome: string, nome: string, persone: number, servizio: Servizio, canale: Canale, stato: Stato, extra: Partial<Res> = {}): Res =>
  ({ id, date, time, cognome, nome, persone, servizio, canale, stato, email: `${nome.toLowerCase()}.${cognome.toLowerCase()}@esempio.it`, tel: "333 1234567", ...extra })
const initialData: Res[] = [
  mk(1, "2026-10-10", "12:30", "Rossi", "Marta", 4, "lunch", "sito", "confermata"),
  mk(2, "2026-10-10", "12:45", "Bianchi", "Luca", 2, "lunch", "telefono", "confermata"),
  mk(3, "2026-10-10", "13:00", "Conti", "Elena", 6, "lunch", "di-persona", "confermata", { note: "Un seggiolone per un bambino." }),
  mk(4, "2026-10-10", "13:15", "Greco", "Paolo", 3, "lunch", "sito", "cancellata", { annullataDa: "utente" }),
  mk(5, "2026-10-10", "19:30", "Ferrari", "Anna", 2, "dinner", "sito", "confermata"),
  mk(6, "2026-10-10", "20:00", "Esposito", "Giulia", 8, "dinner", "telefono", "in-attesa", { note: "Compleanno: torta portata da loro." }),
  mk(7, "2026-10-10", "20:15", "Marino", "Davide", 4, "dinner", "thefork", "confermata"),
  mk(8, "2026-10-10", "20:30", "Ricci", "Sara", 2, "dinner", "sito", "rifiutata", { annullataDa: "staff", motivo: "Locale al completo." }),
  mk(15, "2026-10-10", "21:00", "Galli", "Marco", 1, "dinner", "di-persona", "confermata"),
  mk(9, "2026-10-11", "12:30", "Lombardi", "Chiara", 2, "lunch", "sito", "confermata"),
  mk(10, "2026-10-11", "13:00", "De Luca", "Franco", 10, "lunch", "telefono", "in-attesa"),
  mk(11, "2026-10-11", "20:00", "Colombo", "Irene", 3, "dinner", "sito", "confermata"),
  mk(12, "2026-10-24", "19:45", "Fontana", "Paolo", 12, "dinner", "telefono", "in-attesa"),
  { id: 13, date: "2026-06-20", time: "12:30", cognome: "", nome: "", email: "", tel: "", persone: 4, servizio: "lunch", canale: "sito", stato: "confermata", anon: true },
  { id: 14, date: "2026-06-20", time: "20:00", cognome: "", nome: "", email: "", tel: "", persone: 2, servizio: "dinner", canale: "telefono", stato: "no-show", anon: true },
]

const STATO: Record<Stato, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  confermata: { label: "Confermata", variant: "default" }, "in-attesa": { label: "In attesa di conferma", variant: "secondary" },
  rifiutata: { label: "Rifiutata", variant: "outline" }, cancellata: { label: "Cancellata", variant: "outline" }, "no-show": { label: "No-show", variant: "destructive" },
}
const CANALE: Record<Canale, string> = { sito: "Sito", telefono: "Telefono", "di-persona": "Di persona", thefork: "TheFork" }
const SERV: Record<Servizio, string> = { lunch: "Pranzo", dinner: "Cena" }
const opts = (o: Record<string, string | { label: string }>, all?: string) => [...(all ? [{ value: "tutti", label: all }] : []), ...Object.entries(o).map(([value, v]) => ({ value, label: typeof v === "string" ? v : v.label }))]
const SERV_OPTS = opts(SERV), CANALE_OPTS = opts(CANALE), FILTER_SERV = opts(SERV, "Tutti i servizi"), FILTER_STATO = opts(STATO, "Tutti gli stati"), FILTER_CANALE = opts(CANALE, "Tutti i canali")

const dateFmt = (d: string, opt: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("it-IT", opt).format(new Date(d + "T12:00:00"))
const long = (d: string) => dateFmt(d, { weekday: "long", day: "numeric", month: "long", year: "numeric" })
const medium = (d: string) => dateFmt(d, { weekday: "short", day: "numeric", month: "short" })
const addDays = (d: string, n: number) => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) }
const isPast = (r: Res) => r.date < NOW.date || (r.date === NOW.date && r.time < NOW.time)
const isActive = (r: Res) => r.stato === "confermata" || r.stato === "in-attesa"
const who = (r: Res) => (r.anon ? "Dati anonimizzati" : `${r.cognome} ${r.nome}`)
type Act = "modifica" | "conferma" | "rifiuta" | "cancella" | "noshow" | "anonimizza"
const ACT_LABEL: Record<Act, string> = { modifica: "Modifica", conferma: "Conferma", rifiuta: "Rifiuta", cancella: "Cancella prenotazione", noshow: "Segna no-show", anonimizza: "Anonimizza ora" }
function actionsFor(r: Res): Act[] {
  const a: Act[] = []
  if (r.stato === "in-attesa") a.push("conferma", "rifiuta")
  if (isActive(r) && !r.anon) a.push("modifica")
  if (r.stato === "confermata") { a.push("cancella"); if (isPast(r)) a.push("noshow") }
  if (!r.anon) a.push("anonimizza")
  return a
}
const pl = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : `${n} ${many}`)
const serviceFromTime = (t: string): Servizio => (t && t < "16:00" ? "lunch" : "dinner")
let nextId = 100

type Form = { date: string; time: string; persone: string; servizio: Servizio; canale: Canale; cognome: string; nome: string; tel: string; email: string; note: string; privacy: boolean }
const emptyForm = (date: string): Form => ({ date, time: "", persone: "2", servizio: "dinner", canale: "telefono", cognome: "", nome: "", tel: "", email: "", note: "", privacy: false })

function SelectField({ id, items, value, onChange }: { id?: string; items: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <Select items={items} value={value} onValueChange={(v) => onChange(v as string)}>
      <SelectTrigger id={id} data-component="Select" className="w-full"><SelectValue /></SelectTrigger>
      <SelectContent>{items.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
    </Select>
  )
}
const StatoBadge = ({ s }: { s: Stato }) => <Badge data-component="Badge" variant={STATO[s].variant}>{STATO[s].label}</Badge>

function PrenotazioniPage() {
  const narrow = useIsMobile()
  const [data, setData] = React.useState<Res[]>(initialData)
  const [tab, setTab] = React.useState("giorno")
  const [day, setDay] = React.useState(NOW.date)
  const [q, setQ] = React.useState("")
  const [filters, setFilters] = React.useState({ servizio: "tutti", stato: "tutti", canale: "tutti" })
  const [draft, setDraft] = React.useState(filters)
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [selId, setSelId] = React.useState<number | null>(null)
  const [mode, setMode] = React.useState<"view" | "edit" | "new">("view")
  const [form, setForm] = React.useState<Form>(emptyForm(NOW.date))
  const [showErr, setShowErr] = React.useState(false)
  const [serviceTouched, setServiceTouched] = React.useState(false)
  const [confirm, setConfirm] = React.useState<{ kind: "cancella" | "rifiuta" | "noshow" | "anonimizza"; id: number } | null>(null)
  const [motivo, setMotivo] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [opError, setOpError] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState<{ title: string; text?: string } | null>(null)
  const [loadState, setLoadState] = React.useState<"ok" | "loading" | "error">("ok")
  const [failNext, setFailNext] = React.useState(false)

  const sel = data.find((r) => r.id === selId) ?? null
  const dayAll = data.filter((r) => r.date === day).sort((a, b) => a.time.localeCompare(b.time))
  const term = q.trim().toLowerCase()
  const dayList = dayAll.filter((r) =>
    (filters.servizio === "tutti" || r.servizio === filters.servizio) && (filters.stato === "tutti" || r.stato === filters.stato) && (filters.canale === "tutti" || r.canale === filters.canale) &&
    (!term || (!r.anon && `${r.nome} ${r.cognome} ${r.tel} ${r.email}`.toLowerCase().includes(term))))
  const pending = data.filter((r) => r.stato === "in-attesa").sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const chips = ([["servizio", FILTER_SERV], ["stato", FILTER_STATO], ["canale", FILTER_CANALE]] as const)
    .filter(([k]) => filters[k] !== "tutti").map(([k, list]) => ({ k, label: list.find((x) => x.value === filters[k])!.label }))

  const SERR = "Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore."
  const patch = (id: number, p: Partial<Res>) => setData((d) => d.map((r) => (r.id === id ? { ...r, ...p } : r)))
  async function run(fn: () => void, ok: { title: string; text?: string }) {
    setBusy(true); setOpError(null); await new Promise((r) => setTimeout(r, 700)); setBusy(false)
    if (failNext) { setFailNext(false); setOpError("Operazione non riuscita. " + SERR); return false }
    fn(); setNotice(ok); setConfirm(null); setSelId(null); setMode("view"); setMotivo(""); return true
  }
  const desc = (r: Res) => `${who(r)} · ${medium(r.date)} alle ${r.time}`
  function doAct(a: Act, r: Res) {
    setOpError(null)
    if (a === "modifica") { setForm({ date: r.date, time: r.time, persone: String(r.persone), servizio: r.servizio, canale: r.canale, cognome: r.cognome, nome: r.nome, tel: r.tel, email: r.email, note: r.note ?? "", privacy: true }); setServiceTouched(true); setShowErr(false); setMode("edit"); setSelId(r.id) }
    else if (a === "conferma") run(() => patch(r.id, { stato: "confermata" }), { title: "Prenotazione confermata", text: desc(r) })
    else setConfirm({ kind: a === "cancella" ? "cancella" : a === "rifiuta" ? "rifiuta" : a === "noshow" ? "noshow" : "anonimizza", id: r.id })
  }
  function doConfirm() {
    if (!confirm) return; const r = data.find((x) => x.id === confirm.id)!
    if (confirm.kind === "cancella") run(() => patch(r.id, { stato: "cancellata", annullataDa: "staff", motivo: motivo.trim() || undefined }), { title: "Prenotazione cancellata", text: desc(r) })
    if (confirm.kind === "rifiuta") run(() => patch(r.id, { stato: "rifiutata", annullataDa: "staff", motivo: motivo.trim() || undefined }), { title: "Prenotazione rifiutata", text: desc(r) })
    if (confirm.kind === "noshow") run(() => patch(r.id, { stato: "no-show" }), { title: "Segnata come no-show", text: desc(r) })
    if (confirm.kind === "anonimizza") run(() => patch(r.id, { nome: "", cognome: "", email: "", tel: "", note: undefined, motivo: undefined, anon: true }), { title: "Prenotazione anonimizzata", text: `${medium(r.date)} alle ${r.time}` })
  }
  const errs = {
    date: form.date ? null : "Campo obbligatorio.", time: form.time ? null : "Campo obbligatorio.", persone: Number(form.persone) >= 1 ? null : "Almeno 1 persona.",
    cognome: form.cognome.trim() ? null : "Campo obbligatorio.", nome: form.nome.trim() ? null : "Campo obbligatorio.", tel: form.tel.trim() ? null : "Campo obbligatorio.",
    email: !form.email.trim() ? "Campo obbligatorio." : /^\S+@\S+\.\S+$/.test(form.email) ? null : "Indirizzo email non valido.",
    privacy: mode === "new" && !form.privacy ? "Serve la conferma dell’informativa privacy." : null,
  }
  const hasErr = Object.values(errs).some(Boolean)
  const fe = (k: keyof typeof errs) => (showErr ? errs[k] : null)
  function saveForm() {
    if (hasErr) { setShowErr(true); requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-slot="sheet-content"] [aria-invalid="true"]')?.focus()); return }
    const base = { date: form.date, time: form.time, persone: Number(form.persone), servizio: form.servizio, canale: form.canale, cognome: form.cognome.trim(), nome: form.nome.trim(), tel: form.tel.trim(), email: form.email.trim(), note: form.note.trim() || undefined }
    if (mode === "new") run(() => { setData((d) => [...d, { id: nextId++, stato: "confermata", ...base } as Res]); setDay(form.date) }, { title: "Prenotazione aggiunta", text: `${form.cognome} ${form.nome} · ${medium(form.date)} alle ${form.time}` })
    else if (sel) run(() => patch(sel.id, base), { title: "Prenotazione modificata", text: `${form.cognome} ${form.nome} · ${medium(form.date)} alle ${form.time}` })
  }
  function demo(v: string) {
    setNotice(null); setLoadState("ok"); setFailNext(false); setDay(NOW.date); setTab("giorno")
    if (v === "caricamento") setLoadState("loading"); if (v === "errore-caricamento") setLoadState("error")
    if (v === "errore-azione") setFailNext(true); if (v === "giorno-vuoto") setDay("2026-10-17"); if (v === "anonimizzate") setDay("2026-06-20")
  }
  const setF = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))

  /* ---------- pezzi ---------- */
  const RowActions = ({ r }: { r: Res }) => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Azioni per ${who(r)}`} data-component="Button" />}><MoreHorizontal /></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        {actionsFor(r).map((a, i, all) => (
          <React.Fragment key={a}>
            {a === "anonimizza" && i > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem variant={a === "cancella" || a === "anonimizza" ? "destructive" : undefined} onClick={() => doAct(a, r)}>{ACT_LABEL[a]}</DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
  const dim = (r: Res) => (isActive(r) ? "" : "text-muted-foreground")
  const Group = ({ serv }: { serv: Servizio }) => {
    const all = dayAll.filter((r) => r.servizio === serv && isActive(r)); const list = dayList.filter((r) => r.servizio === serv)
    if (!list.length && filters.servizio !== "tutti" && filters.servizio !== serv) return null
    if (!list.length) return null
    return (
      <section data-block={`gruppo-${serv}`} className="flex flex-col gap-2">
        <h2 className="flex items-baseline gap-2 text-base font-semibold">{SERV[serv]} <span className="text-sm font-normal text-muted-foreground">{all.length} {all.length === 1 ? "attiva" : "attive"} · {pl(all.reduce((n, r) => n + r.persone, 0), "coperto", "coperti")}</span></h2>
        <div className="hidden rounded-lg border md:block" data-block="elenco-tabella">
          <Table data-component="Table">
            <TableHeader><TableRow><TableHead className="w-20">Ora</TableHead><TableHead>Nome</TableHead><TableHead className="w-24">Persone</TableHead><TableHead>Canale</TableHead><TableHead>Stato</TableHead><TableHead className="w-14"><span className="sr-only">Azioni</span></TableHead></TableRow></TableHeader>
            <TableBody>
              {list.map((r) => (
                <TableRow key={r.id} className={dim(r)}>
                  <TableCell className="font-medium tabular-nums">{r.time}</TableCell>
                  <TableCell><Button variant="link" className="h-auto justify-start p-0 text-inherit" onClick={() => { setMode("view"); setOpError(null); setSelId(r.id) }}>{who(r)}</Button></TableCell>
                  <TableCell>{r.persone}</TableCell><TableCell>{CANALE[r.canale]}</TableCell><TableCell><StatoBadge s={r.stato} /></TableCell>
                  <TableCell className="text-right"><RowActions r={r} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-2 md:hidden" data-block="elenco-schede">
          {list.map((r) => (
            <button key={r.id} type="button" className="rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label={`${who(r)}, ${r.time}, ${pl(r.persone, "persona", "persone")}, ${STATO[r.stato].label}`} onClick={() => { setMode("view"); setOpError(null); setSelId(r.id) }}>
              <Card size="sm" data-component="Card" className={dim(r)}>
                <CardContent className="flex items-center gap-3">
                  <div className="w-12 text-base font-semibold tabular-nums">{r.time}</div>
                  <div className="min-w-0 flex-1"><div className={`truncate text-sm font-medium ${r.anon ? "italic" : ""}`}>{who(r)}</div><div className="text-xs text-muted-foreground">{pl(r.persone, "persona", "persone")} · {CANALE[r.canale]}</div></div>
                  <StatoBadge s={r.stato} />
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </section>
    )
  }
  const Skel = () => <div className="flex flex-col gap-2" aria-busy="true" data-block="caricamento">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>

  const confirmText = confirm && (() => {
    const r = data.find((x) => x.id === confirm.id)!
    return {
      cancella: { t: `Cancellare la prenotazione di ${who(r)}?`, d: "La prenotazione passa a Cancellata e viene tolta dal calendario. Non si può annullare.", b: "Cancella prenotazione", v: "destructive" as const, m: true },
      rifiuta: { t: `Rifiutare la prenotazione di ${who(r)}?`, d: "La prenotazione passa a Rifiutata. Non si può annullare.", b: "Rifiuta prenotazione", v: "destructive" as const, m: true },
      noshow: { t: `Segnare ${who(r)} come no-show?`, d: "Il cliente non si è presentato. Non si può annullare.", b: "Segna no-show", v: "default" as const, m: false },
      anonimizza: { t: `Anonimizzare i dati di ${who(r)}?`, d: "Nome, cognome, email, telefono e note vengono cancellati in modo definitivo. Restano data, persone, stato, servizio e canale. Non si può annullare.", b: "Anonimizza ora", v: "destructive" as const, m: false },
    }[confirm.kind]
  })()

  return (
    <Shell themeSwitch adminInUserMenu menu={<GroupedFlatMenu activeLabel="Elenco" />} topbar={crumbs}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5" data-block="contenitore-elenco">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between" data-block="intestazione-pagina">
          <div><h1 className="text-xl font-semibold tracking-tight">Prenotazioni</h1><p className="text-sm text-muted-foreground">Prenotazioni del ristorante.</p></div>
          <Button size="lg" data-component="Button" className="w-full sm:w-auto" onClick={() => { setForm(emptyForm(day)); setServiceTouched(false); setShowErr(false); setOpError(null); setMode("new"); setSelId(-1) }}><Plus data-icon="inline-start" /> Nuova prenotazione</Button>
        </div>

        {notice && <Alert role="status" data-component="Alert" data-variant="default"><CircleCheck /><AlertTitle>{notice.title}</AlertTitle>{notice.text && <AlertDescription>{notice.text}</AlertDescription>}</Alert>}

        <Tabs value={tab} onValueChange={(v) => setTab(v as string)} className="gap-4">
          <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0" data-block="sotto-navigazione">
            <TabsList variant="line" data-component="Tabs" data-variant="line">
              <TabsTrigger value="giorno">Giorno</TabsTrigger>
              <TabsTrigger value="da-confermare">Da confermare{pending.length > 0 && <Badge data-component="Badge" variant="secondary" className="ml-1.5">{pending.length}</Badge>}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="giorno" className="flex flex-col gap-4">
            <div className="flex items-center gap-2" data-block="navigazione-giorno">
              <Button variant="outline" size="icon" aria-label="Giorno precedente" data-component="Button" onClick={() => setDay(addDays(day, -1))}><ChevronLeft /></Button>
              <Input type="date" aria-label="Giorno" data-component="Input" className="min-w-0 flex-1" value={day} onChange={(e) => e.target.value && setDay(e.target.value)} />
              <Button variant="outline" size="icon" aria-label="Giorno successivo" data-component="Button" onClick={() => setDay(addDays(day, 1))}><ChevronRight /></Button>
              <Button variant="outline" data-component="Button" onClick={() => setDay(NOW.date)}>Oggi</Button>
            </div>
            <div className="flex gap-2" data-block="ricerca-filtri">
              <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input data-component="Input" aria-label="Cerca" placeholder="Cerca per nome o telefono" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} /></div>
              <Button variant="outline" data-component="Button" onClick={() => { setDraft(filters); setFilterOpen(true) }}><SlidersHorizontal data-icon="inline-start" /> Filtri{chips.length > 0 && <Badge data-component="Badge" className="ml-1">{chips.length}</Badge>}</Button>
            </div>
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2" data-block="filtri-attivi">
                {chips.map((c) => <Button key={c.k} variant="secondary" size="sm" data-component="Button" aria-label={`Rimuovi filtro ${c.label}`} onClick={() => setFilters({ ...filters, [c.k]: "tutti" })}>{c.label}<X data-icon="inline-end" /></Button>)}
              </div>
            )}
            <p className="text-sm text-muted-foreground first-letter:uppercase" data-block="giorno-corrente">{long(day)}</p>

            {loadState === "loading" && <Skel />}
            {loadState === "error" && <Alert variant="destructive" role="alert" data-component="Alert"><CircleAlert /><AlertTitle>Impossibile caricare le prenotazioni</AlertTitle><AlertDescription><p>Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.</p><Button variant="outline" className="mt-3" data-component="Button" onClick={() => setLoadState("ok")}>Riprova</Button></AlertDescription></Alert>}
            {loadState === "ok" && (
              dayAll.length === 0 ? (
                <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-6" data-block="vuoto"><p className="text-sm text-muted-foreground">Nessuna prenotazione per questo giorno.</p><Button variant="outline" data-component="Button" onClick={() => { setForm(emptyForm(day)); setServiceTouched(false); setShowErr(false); setMode("new"); setSelId(-1) }}>Nuova prenotazione</Button></div>
              ) : dayList.length === 0 ? (
                <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-6" data-block="nessun-risultato"><p className="text-sm text-muted-foreground">Nessun risultato con questi filtri.</p><Button variant="outline" data-component="Button" onClick={() => { setFilters({ servizio: "tutti", stato: "tutti", canale: "tutti" }); setQ("") }}>Azzera filtri</Button></div>
              ) : <div className="flex flex-col gap-6"><Group serv="lunch" /><Group serv="dinner" /></div>
            )}
          </TabsContent>

          <TabsContent value="da-confermare" className="flex flex-col gap-3" data-block="da-confermare">
            {loadState === "loading" && <Skel />}
            {loadState === "ok" && pending.length === 0 && <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground" data-block="vuoto">Nessuna prenotazione in attesa di conferma.</div>}
            {loadState === "ok" && pending.map((r) => (
              <Card key={r.id} data-component="Card" data-block="scheda-da-confermare"><CardContent className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{who(r)}</div><div className="text-sm">{medium(r.date)} alle {r.time} · {SERV[r.servizio]}</div><div className="text-xs text-muted-foreground">{pl(r.persone, "persona", "persone")} · {CANALE[r.canale]}</div>{r.note && <div className="mt-1 text-xs text-muted-foreground">{r.note}</div>}</div>
                  <Button variant="ghost" size="sm" data-component="Button" onClick={() => { setMode("view"); setOpError(null); setSelId(r.id) }}>Dettagli</Button>
                </div>
                <div className="grid grid-cols-2 gap-2"><Button data-component="Button" onClick={() => doAct("conferma", r)}>Conferma</Button><Button variant="outline" data-component="Button" onClick={() => doAct("rifiuta", r)}>Rifiuta</Button></div>
              </CardContent></Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Filtri */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side={narrow ? "bottom" : "right"} data-component="Sheet">
          <SheetHeader><SheetTitle>Filtri</SheetTitle><SheetDescription>Restringi l’elenco del giorno.</SheetDescription></SheetHeader>
          <FieldGroup className="px-4">
            <Field><FieldLabel htmlFor="f-serv">Servizio</FieldLabel><SelectField id="f-serv" items={FILTER_SERV} value={draft.servizio} onChange={(v) => setDraft({ ...draft, servizio: v })} /></Field>
            <Field><FieldLabel htmlFor="f-stato">Stato</FieldLabel><SelectField id="f-stato" items={FILTER_STATO} value={draft.stato} onChange={(v) => setDraft({ ...draft, stato: v })} /></Field>
            <Field><FieldLabel htmlFor="f-can">Canale</FieldLabel><SelectField id="f-can" items={FILTER_CANALE} value={draft.canale} onChange={(v) => setDraft({ ...draft, canale: v })} /></Field>
          </FieldGroup>
          <SheetFooter className="grid grid-cols-2"><Button size="lg" onClick={() => { setFilters(draft); setFilterOpen(false) }}>Applica</Button><Button size="lg" variant="outline" onClick={() => setDraft({ servizio: "tutti", stato: "tutti", canale: "tutti" })}>Azzera</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Dettaglio / modifica / nuova */}
      <Sheet open={selId !== null} onOpenChange={(o) => { if (!o && !busy) { setSelId(null); setMode("view") } }}>
        <SheetContent side={narrow ? "bottom" : "right"} data-component="Sheet" data-state={mode}>
          {mode === "view" && sel && (
            <>
              <SheetHeader><SheetTitle className={sel.anon ? "italic" : ""}>{who(sel)}</SheetTitle><SheetDescription>{long(sel.date)} alle {sel.time} · {SERV[sel.servizio]}</SheetDescription></SheetHeader>
              <div className="flex flex-col gap-4 px-4" data-block="dettaglio">
                {opError && <Alert variant="destructive" role="alert" data-component="Alert"><CircleAlert /><AlertTitle>Operazione non riuscita</AlertTitle><AlertDescription>{SERR}</AlertDescription></Alert>}
                <div><StatoBadge s={sel.stato} /></div>
                <dl className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Persone</dt><dd>{sel.persone}</dd>
                  <dt className="text-muted-foreground">Canale</dt><dd>{CANALE[sel.canale]}</dd>
                  {!sel.anon && <><dt className="text-muted-foreground">Telefono</dt><dd><Button variant="outline" size="sm" data-component="Button" render={<a href={`tel:${sel.tel}`} />}><Phone data-icon="inline-start" />{sel.tel}</Button></dd>
                  <dt className="text-muted-foreground">Email</dt><dd className="min-w-0"><Button variant="outline" size="sm" data-component="Button" render={<a href={`mailto:${sel.email}`} />}><Mail data-icon="inline-start" /><span className="truncate">{sel.email}</span></Button></dd></>}
                  {sel.note && <><dt className="text-muted-foreground">Note</dt><dd>{sel.note}</dd></>}
                  {sel.annullataDa && <><dt className="text-muted-foreground">Annullata da</dt><dd>{sel.annullataDa === "staff" ? "Staff" : "Cliente"}</dd></>}
                  {sel.motivo && <><dt className="text-muted-foreground">Motivo</dt><dd>{sel.motivo}</dd></>}
                </dl>
                {sel.anon && <p className="text-sm text-muted-foreground">I dati personali sono stati cancellati. Restano data, persone, stato, servizio e canale.</p>}
              </div>
              <SheetFooter data-block="azioni-stato">
                {actionsFor(sel).filter((a) => a !== "anonimizza").map((a) => <Button key={a} size="lg" data-component="Button" variant={a === "conferma" ? "default" : a === "cancella" ? "destructive" : "outline"} onClick={() => doAct(a, sel)} disabled={busy}>{ACT_LABEL[a]}</Button>)}
                {actionsFor(sel).includes("anonimizza") && <Button size="lg" variant="ghost" data-component="Button" className="text-destructive" onClick={() => doAct("anonimizza", sel)} disabled={busy}>{ACT_LABEL.anonimizza}</Button>}
              </SheetFooter>
            </>
          )}
          {(mode === "edit" || mode === "new") && (
            <>
              <SheetHeader><SheetTitle>{mode === "new" ? "Nuova prenotazione" : "Modifica prenotazione"}</SheetTitle><SheetDescription>{mode === "new" ? "Inserimento manuale (telefono, di persona, TheFork)." : "La modifica non cambia lo stato."}</SheetDescription></SheetHeader>
              <FieldGroup className="px-4" data-block="modulo-prenotazione">
                {opError && <Alert variant="destructive" role="alert" data-component="Alert"><CircleAlert /><AlertTitle>Operazione non riuscita</AlertTitle><AlertDescription>{SERR}</AlertDescription></Alert>}
                <div className="grid grid-cols-2 gap-3">
                  <Field data-invalid={fe("date") ? true : undefined}><FieldLabel htmlFor="p-date">Data</FieldLabel><Input id="p-date" type="date" value={form.date} aria-invalid={fe("date") ? true : undefined} onChange={(e) => setF("date", e.target.value)} />{fe("date") && <FieldError>{fe("date")}</FieldError>}</Field>
                  <Field data-invalid={fe("time") ? true : undefined}><FieldLabel htmlFor="p-time">Ora</FieldLabel><Input id="p-time" type="time" step={60} value={form.time} aria-invalid={fe("time") ? true : undefined} onChange={(e) => { setF("time", e.target.value); if (!serviceTouched && e.target.value) setF("servizio", serviceFromTime(e.target.value)) }} />{fe("time") && <FieldError>{fe("time")}</FieldError>}</Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field data-invalid={fe("persone") ? true : undefined}><FieldLabel htmlFor="p-pers">Persone</FieldLabel><Input id="p-pers" type="number" inputMode="numeric" min={1} value={form.persone} aria-invalid={fe("persone") ? true : undefined} onChange={(e) => setF("persone", e.target.value)} />{fe("persone") && <FieldError>{fe("persone")}</FieldError>}</Field>
                  <Field><FieldLabel htmlFor="p-serv">Servizio</FieldLabel><SelectField id="p-serv" items={SERV_OPTS} value={form.servizio} onChange={(v) => { setServiceTouched(true); setF("servizio", v as Servizio) }} /></Field>
                </div>
                <FieldDescription>Il servizio è dedotto dall’ora; puoi cambiarlo.</FieldDescription>
                <Field><FieldLabel htmlFor="p-can">Canale</FieldLabel><SelectField id="p-can" items={CANALE_OPTS.filter((c) => mode === "edit" || c.value !== "sito")} value={form.canale} onChange={(v) => setF("canale", v as Canale)} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field data-invalid={fe("cognome") ? true : undefined}><FieldLabel htmlFor="p-cog">Cognome</FieldLabel><Input id="p-cog" value={form.cognome} aria-invalid={fe("cognome") ? true : undefined} onChange={(e) => setF("cognome", e.target.value)} />{fe("cognome") && <FieldError>{fe("cognome")}</FieldError>}</Field>
                  <Field data-invalid={fe("nome") ? true : undefined}><FieldLabel htmlFor="p-nom">Nome</FieldLabel><Input id="p-nom" value={form.nome} aria-invalid={fe("nome") ? true : undefined} onChange={(e) => setF("nome", e.target.value)} />{fe("nome") && <FieldError>{fe("nome")}</FieldError>}</Field>
                </div>
                <Field data-invalid={fe("tel") ? true : undefined}><FieldLabel htmlFor="p-tel">Cellulare</FieldLabel><Input id="p-tel" type="tel" autoComplete="off" value={form.tel} aria-invalid={fe("tel") ? true : undefined} onChange={(e) => setF("tel", e.target.value)} />{fe("tel") && <FieldError>{fe("tel")}</FieldError>}</Field>
                <Field data-invalid={fe("email") ? true : undefined}><FieldLabel htmlFor="p-mail">Email</FieldLabel><Input id="p-mail" type="email" autoComplete="off" value={form.email} aria-invalid={fe("email") ? true : undefined} onChange={(e) => setF("email", e.target.value)} />{fe("email") && <FieldError>{fe("email")}</FieldError>}</Field>
                <Field><FieldLabel htmlFor="p-note">Note</FieldLabel><Textarea id="p-note" data-component="Textarea" value={form.note} onChange={(e) => setF("note", e.target.value)} /></Field>
                {mode === "new" && (
                  <Field orientation="horizontal" data-invalid={fe("privacy") ? true : undefined}>
                    <Checkbox id="p-priv" data-component="Checkbox" checked={form.privacy} aria-invalid={fe("privacy") ? true : undefined} onCheckedChange={(c) => setF("privacy", c === true)} />
                    <FieldLabel htmlFor="p-priv" className="font-normal">Informativa privacy comunicata al cliente</FieldLabel>
                  </Field>
                )}
                {fe("privacy") && <FieldError>{fe("privacy")}</FieldError>}
              </FieldGroup>
              <SheetFooter className="grid grid-cols-2"><Button size="lg" onClick={saveForm} disabled={busy}>{busy && <Spinner data-icon="inline-start" />}{busy ? "Salvataggio…" : "Salva"}</Button><Button size="lg" variant="outline" disabled={busy} onClick={() => { if (mode === "new") { setSelId(null); setMode("view") } else setMode("view") }}>Annulla</Button></SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Conferme */}
      <AlertDialog open={confirm !== null} onOpenChange={(o) => { if (!o && !busy) { setConfirm(null); setMotivo(""); setOpError(null) } }}>
        <AlertDialogContent data-component="AlertDialog" data-state={confirm?.kind}>
          {confirmText && confirm && (
            <>
              <AlertDialogHeader><AlertDialogTitle>{confirmText.t}</AlertDialogTitle><AlertDialogDescription>{confirmText.d}</AlertDialogDescription></AlertDialogHeader>
              {opError && <Alert variant="destructive" role="alert" data-component="Alert"><CircleAlert /><AlertTitle>Operazione non riuscita</AlertTitle><AlertDescription>{SERR}</AlertDescription></Alert>}
              {confirmText.m && <Field><FieldLabel htmlFor="c-motivo">Motivo (facoltativo)</FieldLabel><Input id="c-motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} /></Field>}
              <AlertDialogFooter>
                <AlertDialogCancel disabled={busy}>Indietro</AlertDialogCancel>
                <Button data-component="Button" variant={confirmText.v} onClick={doConfirm} disabled={busy}>{busy && <Spinner data-icon="inline-start" />}{confirmText.b}</Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <div data-demo className="fixed bottom-2 right-2 z-50 rounded-md border bg-card px-1.5 py-0.5 text-[11px] text-muted-foreground shadow-xs">
        <label>Demo stato <select aria-label="Stato demo" className="bg-transparent text-foreground" defaultValue="normale" onChange={(e) => demo(e.target.value)}>
          <option value="normale">normale</option><option value="caricamento">caricamento</option><option value="errore-caricamento">errore di caricamento</option>
          <option value="errore-azione">errore all’azione successiva</option><option value="giorno-vuoto">giorno senza prenotazioni</option><option value="anonimizzate">prenotazioni anonimizzate (20 giugno)</option>
        </select></label>
      </div>
    </Shell>
  )
}
export const prenotazioniPage = <PrenotazioniPage />
