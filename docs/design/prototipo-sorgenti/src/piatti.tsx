import * as React from "react"
import { Plus, Search, SlidersHorizontal, MoreHorizontal, X, CircleCheck, CircleAlert, ChevronDown, RefreshCw, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { useIsMobile } from "@/hooks/use-mobile"
import { Shell, GroupedFlatMenu } from "./layouts"

/* ---------- dati di esempio (nel progetto: Collection dishes) ---------- */
const ALLERGENS = ["Cereali contenenti glutine", "Crostacei", "Uova", "Pesce", "Arachidi", "Soia", "Latte", "Frutta a guscio", "Sedano", "Senape", "Semi di sesamo", "Anidride solforosa e solfiti", "Lupini", "Molluschi"]
const CATS = ["Antipasti", "Dolci", "Primi", "Secondi"] // ordine per nome, come il contratto del menù pubblico (ADR-112)
type Dish = { id: number; name: string; nameEn: string; desc: string; descEn: string; price: string; cat: string; allergens: string[]; glutenFree: boolean; dairyFree: boolean; vegan: boolean; eggFree: boolean; soldOut: boolean; disabled: boolean }
const D = (id: number, name: string, price: string, cat: string, allergens: string[], extra: Partial<Dish> = {}): Dish => ({ id, name, nameEn: "", desc: "", descEn: "", price, cat, allergens, glutenFree: false, dairyFree: false, vegan: false, eggFree: false, soldOut: false, disabled: false, ...extra })
const initialData: Dish[] = [
  D(1, "Nem di carne", "9,00", "Antipasti", ["Cereali contenenti glutine", "Soia"], { desc: "Involtini fritti di maiale con verdure e vermicelli, serviti con salsa agrodolce.", dairyFree: true }),
  D(2, "Involtini primavera", "8,00", "Antipasti", ["Cereali contenenti glutine", "Soia"], { vegan: true, dairyFree: true, eggFree: true, nameEn: "Spring rolls" }),
  D(3, "Gamberi in tempura", "11,00", "Antipasti", ["Crostacei", "Uova", "Cereali contenenti glutine"], { disabled: true }),
  D(4, "Pho bo", "12,00", "Primi", ["Cereali contenenti glutine", "Soia"], { soldOut: true, desc: "Zuppa di manzo con noodles di riso, erbe fresche e lime." }),
  D(5, "Spaghetti di riso saltati", "11,00", "Primi", ["Soia", "Uova"], { dairyFree: true }),
  D(6, "Ravioli al vapore", "10,00", "Primi", ["Cereali contenenti glutine", "Soia", "Semi di sesamo"]),
  D(7, "Maiale caramellato", "16,00", "Secondi", ["Soia"], { dairyFree: true, glutenFree: false }),
  D(8, "Pollo al limone", "15,00", "Secondi", ["Cereali contenenti glutine"]),
  D(9, "Branzino al vapore", "19,00", "Secondi", ["Pesce"], { glutenFree: true, dairyFree: true, eggFree: true }),
  D(10, "Banana flambé", "7,00", "Dolci", ["Latte"]),
  D(11, "Gelato al cocco", "6,00", "Dolci", [], { vegan: true, glutenFree: true, dairyFree: true, eggFree: true }),
]
const pl = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : `${n} ${many}`)
const catItems = [{ value: "tutte", label: "Tutte le categorie" }, ...CATS.map((c) => ({ value: c, label: c }))]
const catOnly = CATS.map((c) => ({ value: c, label: c }))
const statoItems = [{ value: "tutti", label: "Tutti" }, { value: "disponibili", label: "Disponibili" }, { value: "terminati", label: "Terminati" }, { value: "disabilitati", label: "Disabilitati" }]
const state = (d: Dish) => (d.disabled ? "disabilitato" : d.soldOut ? "terminato" : "disponibile")
const STATE_BADGE = { disponibile: { label: "Disponibile", variant: "default" as const }, terminato: { label: "Terminato", variant: "secondary" as const }, disabilitato: { label: "Disabilitato", variant: "outline" as const } }
const price = (p: string) => `${p} €`
const FLAGS: [keyof Dish, string][] = [["glutenFree", "Senza glutine"], ["dairyFree", "Senza latticini"], ["vegan", "Vegano"], ["eggFree", "Senza uova"]]
const SERR = "Non è stato modificato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore."
type Form = { name: string; nameEn: string; desc: string; descEn: string; price: string; cat: string; allergens: string[]; glutenFree: boolean; dairyFree: boolean; vegan: boolean; eggFree: boolean; soldOut: boolean; disabled: boolean }
const emptyForm = (): Form => ({ name: "", nameEn: "", desc: "", descEn: "", price: "", cat: "", allergens: [], glutenFree: false, dairyFree: false, vegan: false, eggFree: false, soldOut: false, disabled: false })
let nextId = 100

function SelectField({ id, items, value, onChange, placeholder }: { id?: string; items: { value: string; label: string }[]; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <Select items={items} value={value} onValueChange={(v) => onChange(v as string)}>
      <SelectTrigger id={id} data-component="Select" className="w-full"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>{items.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
    </Select>
  )
}

function PiattiPage() {
  const narrow = useIsMobile()
  const [data, setData] = React.useState<Dish[]>(initialData)
  const [q, setQ] = React.useState("")
  const [filters, setFilters] = React.useState({ cat: "tutte", stato: "tutti", noAll: false })
  const [draft, setDraft] = React.useState(filters)
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [selId, setSelId] = React.useState<number | null>(null)
  const [form, setForm] = React.useState<Form>(emptyForm())
  const [showErr, setShowErr] = React.useState(false)
  const [enOpen, setEnOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [opError, setOpError] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState<{ kind: "ok" | "err" | "info"; title: string; text?: string } | null>(null)
  const [loadState, setLoadState] = React.useState<"ok" | "loading" | "error" | "empty">("ok")
  const [failNext, setFailNext] = React.useState(false)
  const [rebuildOpen, setRebuildOpen] = React.useState(false)
  const [rebuildBusy, setRebuildBusy] = React.useState(false)
  const [rebuildRunning, setRebuildRunning] = React.useState(false)
  const [truncated, setTruncated] = React.useState(false)

  const term = q.trim().toLowerCase()
  const list = data.filter((d) =>
    (filters.cat === "tutte" || d.cat === filters.cat) &&
    (filters.stato === "tutti" || (filters.stato === "disponibili" && state(d) === "disponibile") || (filters.stato === "terminati" && state(d) === "terminato") || (filters.stato === "disabilitati" && state(d) === "disabilitato")) &&
    (!filters.noAll || d.allergens.length === 0) && (!term || `${d.name} ${d.nameEn}`.toLowerCase().includes(term)))
  const chips: { k: string; label: string }[] = []
  if (filters.cat !== "tutte") chips.push({ k: "cat", label: filters.cat })
  if (filters.stato !== "tutti") chips.push({ k: "stato", label: statoItems.find((s) => s.value === filters.stato)!.label })
  if (filters.noAll) chips.push({ k: "noAll", label: "Senza allergeni dichiarati" })
  const clearChip = (k: string) => setFilters({ ...filters, [k]: k === "cat" ? "tutte" : k === "stato" ? "tutti" : false })
  const patch = (id: number, p: Partial<Dish>) => setData((x) => x.map((d) => (d.id === id ? { ...d, ...p } : d)))

  async function quick(d: Dish, p: Partial<Dish>, ok: string) {
    setNotice(null); await new Promise((r) => setTimeout(r, 250))
    if (failNext) { setFailNext(false); setNotice({ kind: "err", title: "Operazione non riuscita", text: SERR }); return }
    patch(d.id, p); setNotice({ kind: "ok", title: ok, text: "Il menù pubblico si aggiorna entro pochi secondi." })
  }
  function openEdit(d: Dish) { setForm({ name: d.name, nameEn: d.nameEn, desc: d.desc, descEn: d.descEn, price: d.price, cat: d.cat, allergens: d.allergens, glutenFree: d.glutenFree, dairyFree: d.dairyFree, vegan: d.vegan, eggFree: d.eggFree, soldOut: d.soldOut, disabled: d.disabled }); setEnOpen(!!(d.nameEn || d.descEn)); setShowErr(false); setOpError(null); setSelId(d.id) }
  function openNew() { setForm(emptyForm()); setEnOpen(false); setShowErr(false); setOpError(null); setSelId(-1) }
  const errs = {
    name: form.name.trim() ? null : "Campo obbligatorio.",
    price: !form.price.trim() ? "Campo obbligatorio." : /^\d+([.,]\d{1,2})?$/.test(form.price.trim()) ? null : "Inserisci un prezzo valido (es. 9,50).",
    cat: form.cat ? null : "Scegli una categoria.",
  }
  const hasErr = Object.values(errs).some(Boolean)
  const fe = (k: keyof typeof errs) => (showErr ? errs[k] : null)
  const setF = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }))
  async function save() {
    if (hasErr) { setShowErr(true); requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-slot="sheet-content"] [aria-invalid="true"]')?.focus()); return }
    setBusy(true); setOpError(null); await new Promise((r) => setTimeout(r, 700)); setBusy(false)
    if (failNext) { setFailNext(false); setOpError("Operazione non riuscita. " + SERR); return }
    const isNew = selId === -1
    if (isNew) setData((x) => [...x, { id: nextId++, ...form, name: form.name.trim() } as Dish]); else patch(selId!, { ...form, name: form.name.trim() })
    setSelId(null); setNotice({ kind: "ok", title: isNew ? "Piatto aggiunto" : "Piatto salvato", text: "Per vederlo sul menù pubblico serve «Ricompila il menù pubblico»." })
  }
  async function rebuild() {
    setRebuildBusy(true); await new Promise((r) => setTimeout(r, 800)); setRebuildBusy(false); setRebuildOpen(false)
    if (rebuildRunning) setNotice({ kind: "info", title: "Una ricompilazione è già in corso", text: "Attendi che finisca prima di avviarne un'altra." })
    else { setRebuildRunning(true); setNotice({ kind: "ok", title: "Ricompilazione avviata", text: "Il menù pubblico si aggiorna tra alcuni minuti." }) }
  }
  function demo(v: string) {
    setNotice(null); setLoadState("ok"); setFailNext(false); setRebuildRunning(false); setTruncated(false)
    if (v === "caricamento") setLoadState("loading"); if (v === "errore-caricamento") setLoadState("error"); if (v === "vuoto") setLoadState("empty")
    if (v === "molti-piatti") setTruncated(true); if (v === "errore-azione") setFailNext(true); if (v === "ricompilazione-in-corso") setRebuildRunning(true)
  }

  const Actions = ({ d }: { d: Dish }) => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Azioni per ${d.name}`} data-component="Button" />}><MoreHorizontal /></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        <DropdownMenuItem onClick={() => openEdit(d)}>Modifica</DropdownMenuItem>
        <DropdownMenuItem onClick={() => quick(d, { disabled: !d.disabled }, d.disabled ? "Piatto abilitato" : "Piatto disabilitato")}>{d.disabled ? "Abilita" : "Disabilita"}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
  const SoldSwitch = ({ d }: { d: Dish }) => (
    <Switch data-component="Switch" aria-label={`Terminato: ${d.name}`} checked={d.soldOut} disabled={d.disabled} onCheckedChange={(c) => quick(d, { soldOut: c === true }, c ? "Piatto segnato come terminato" : "Piatto di nuovo disponibile")} />
  )
  const Group = ({ cat }: { cat: string }) => {
    const rows = list.filter((d) => d.cat === cat).sort((a, b) => a.name.localeCompare(b.name, "it", { sensitivity: "base" })); if (!rows.length) return null
    return (
      <section data-block={`gruppo-${cat.toLowerCase()}`} className="flex flex-col gap-2">
        <h2 className="flex items-baseline gap-2 text-base font-semibold">{cat} <span className="text-sm font-normal text-muted-foreground">{pl(rows.length, "piatto", "piatti")}</span></h2>
        <div className="hidden rounded-lg border md:block" data-block="elenco-tabella">
          <Table data-component="Table">
            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead className="w-24">Prezzo</TableHead><TableHead className="w-36">Stato</TableHead><TableHead className="w-28">Terminato</TableHead><TableHead className="w-14"><span className="sr-only">Azioni</span></TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id} className={d.disabled ? "text-muted-foreground" : ""}>
                  <TableCell><Button variant="link" className="h-auto justify-start p-0 text-inherit" onClick={() => openEdit(d)}>{d.name}</Button></TableCell>
                  <TableCell className="tabular-nums">{price(d.price)}</TableCell>
                  <TableCell>{state(d) === "disponibile" ? <span className="text-sm text-muted-foreground">Disponibile</span> : <Badge data-component="Badge" variant={STATE_BADGE[state(d)].variant}>{STATE_BADGE[state(d)].label}</Badge>}</TableCell>
                  <TableCell><SoldSwitch d={d} /></TableCell>
                  <TableCell className="text-right"><Actions d={d} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-2 md:hidden" data-block="elenco-schede">
          {rows.map((d) => (
            <Card key={d.id} size="sm" data-component="Card" className={d.disabled ? "text-muted-foreground" : ""}>
              <CardContent className="flex items-center gap-2">
                <button type="button" className="min-w-0 flex-1 rounded-md py-1 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50" onClick={() => openEdit(d)} aria-label={`${d.name}, ${price(d.price)}, ${STATE_BADGE[state(d)].label}`}>
                  <div className="truncate text-sm font-medium">{d.name}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground"><span className="tabular-nums">{price(d.price)}</span>{state(d) !== "disponibile" && <Badge data-component="Badge" variant={STATE_BADGE[state(d)].variant}>{STATE_BADGE[state(d)].label}</Badge>}</div>
                </button>
                <label className="flex flex-col items-center gap-1 text-[11px] text-muted-foreground"><SoldSwitch d={d} />Terminato</label>
                <Actions d={d} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }
  const Skel = () => <div className="flex flex-col gap-2" aria-busy="true" data-block="caricamento">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>

  return (
    <Shell themeSwitch adminInUserMenu menu={<GroupedFlatMenu activeLabel="Piatti" />}
      topbar={<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Menù</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Piatti</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5" data-block="contenitore-elenco">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between" data-block="intestazione-pagina">
          <div><h1 className="text-xl font-semibold tracking-tight">Piatti</h1><p className="text-sm text-muted-foreground">Il menù digitale del ristorante.</p></div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="outline" size="lg" data-component="Button" onClick={() => setRebuildOpen(true)}><RefreshCw data-icon="inline-start" /> Ricompila il menù pubblico</Button>
            <Button size="lg" data-component="Button" onClick={openNew}><Plus data-icon="inline-start" /> Nuovo piatto</Button>
          </div>
        </div>

        {notice && <Alert role="status" data-component="Alert" variant={notice.kind === "err" ? "destructive" : "default"}>{notice.kind === "err" ? <CircleAlert /> : <CircleCheck />}<AlertTitle>{notice.title}</AlertTitle>{notice.text && <AlertDescription>{notice.text}</AlertDescription>}</Alert>}

        <div className="flex gap-2" data-block="ricerca-filtri">
          <div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input data-component="Input" aria-label="Cerca" placeholder="Cerca un piatto" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <Button variant="outline" data-component="Button" onClick={() => { setDraft(filters); setFilterOpen(true) }}><SlidersHorizontal data-icon="inline-start" /> Filtri{chips.length > 0 && <Badge data-component="Badge" className="ml-1">{chips.length}</Badge>}</Button>
        </div>
        {chips.length > 0 && <div className="flex flex-wrap gap-2" data-block="filtri-attivi">{chips.map((c) => <Button key={c.k} variant="secondary" size="sm" data-component="Button" aria-label={`Rimuovi filtro ${c.label}`} onClick={() => clearChip(c.k)}>{c.label}<X data-icon="inline-end" /></Button>)}</div>}

        {loadState === "loading" && <Skel />}
        {loadState === "error" && <Alert variant="destructive" role="alert" data-component="Alert"><CircleAlert /><AlertTitle>Impossibile caricare i piatti</AlertTitle><AlertDescription><p>Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.</p><Button variant="outline" className="mt-3" data-component="Button" onClick={() => setLoadState("ok")}>Riprova</Button></AlertDescription></Alert>}
        {loadState === "empty" && <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-6" data-block="vuoto"><p className="text-sm text-muted-foreground">Nessun piatto nel menù.</p><Button variant="outline" data-component="Button" onClick={openNew}>Nuovo piatto</Button></div>}
        {loadState === "ok" && truncated && <Alert role="status" data-component="Alert" data-state="elenco-parziale"><Info /><AlertTitle>Mostrati 100 piatti su 137</AlertTitle><AlertDescription>Restringi l’elenco con la ricerca o i filtri per trovare gli altri.</AlertDescription></Alert>}
        {loadState === "ok" && (list.length === 0
          ? <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed p-6" data-block="nessun-risultato"><p className="text-sm text-muted-foreground">Nessun risultato con questi filtri.</p><Button variant="outline" data-component="Button" onClick={() => { setFilters({ cat: "tutte", stato: "tutti", noAll: false }); setQ("") }}>Azzera filtri</Button></div>
          : <div className="flex flex-col gap-6">{CATS.map((c) => <Group key={c} cat={c} />)}</div>)}
      </div>

      {/* Filtri */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side={narrow ? "bottom" : "right"} data-component="Sheet">
          <SheetHeader><SheetTitle>Filtri</SheetTitle><SheetDescription>Restringi l’elenco dei piatti.</SheetDescription></SheetHeader>
          <FieldGroup className="px-4">
            <Field><FieldLabel htmlFor="f-cat">Categoria</FieldLabel><SelectField id="f-cat" items={catItems} value={draft.cat} onChange={(v) => setDraft({ ...draft, cat: v })} /></Field>
            <Field><FieldLabel htmlFor="f-stato">Stato</FieldLabel><SelectField id="f-stato" items={statoItems} value={draft.stato} onChange={(v) => setDraft({ ...draft, stato: v })} /></Field>
            <Field orientation="horizontal"><Checkbox id="f-noall" data-component="Checkbox" checked={draft.noAll} onCheckedChange={(c) => setDraft({ ...draft, noAll: c === true })} /><FieldLabel htmlFor="f-noall" className="min-h-11 flex-1 items-center font-normal">Senza allergeni dichiarati</FieldLabel></Field>
          </FieldGroup>
          <SheetFooter className="grid grid-cols-2"><Button size="lg" onClick={() => { setFilters(draft); setFilterOpen(false) }}>Applica</Button><Button size="lg" variant="outline" onClick={() => setDraft({ cat: "tutte", stato: "tutti", noAll: false })}>Azzera</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Modulo piatto */}
      <Sheet open={selId !== null} onOpenChange={(o) => { if (!o && !busy) setSelId(null) }}>
        <SheetContent side={narrow ? "bottom" : "right"} data-component="Sheet" data-state={selId === -1 ? "new" : "edit"}>
          <SheetHeader><SheetTitle>{selId === -1 ? "Nuovo piatto" : "Modifica piatto"}</SheetTitle><SheetDescription>{selId === -1 ? "Il piatto compare nel menù pubblico dopo la ricompilazione." : form.name}</SheetDescription></SheetHeader>
          <FieldGroup className="px-4" data-block="modulo-piatto">
            {opError && <Alert variant="destructive" role="alert" data-component="Alert"><CircleAlert /><AlertTitle>Operazione non riuscita</AlertTitle><AlertDescription>{SERR}</AlertDescription></Alert>}
            <Field data-invalid={fe("name") ? true : undefined}><FieldLabel htmlFor="d-nome">Nome</FieldLabel><Input id="d-nome" value={form.name} aria-invalid={fe("name") ? true : undefined} onChange={(e) => setF("name", e.target.value)} />{fe("name") && <FieldError>{fe("name")}</FieldError>}</Field>
            <Field><FieldLabel htmlFor="d-desc">Descrizione</FieldLabel><Textarea id="d-desc" data-component="Textarea" value={form.desc} onChange={(e) => setF("desc", e.target.value)} /></Field>
            <Collapsible open={enOpen} onOpenChange={setEnOpen} className="rounded-lg border" data-block="traduzione-inglese">
              <CollapsibleTrigger render={<button type="button" className="flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm font-medium" />}>
                Traduzione inglese <span className="font-normal text-muted-foreground">(facoltativa)</span>
                <Badge data-component="Badge" variant="outline" className="ml-auto">{form.nameEn || form.descEn ? "Presente" : "Manca"}</Badge><ChevronDown className={`size-4 transition-transform ${enOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent><div className="flex flex-col gap-4 border-t p-3">
                <Field><FieldLabel htmlFor="d-nome-en">Name</FieldLabel><Input id="d-nome-en" placeholder={form.name} value={form.nameEn} onChange={(e) => setF("nameEn", e.target.value)} /></Field>
                <Field><FieldLabel htmlFor="d-desc-en">Description</FieldLabel><Textarea id="d-desc-en" value={form.descEn} onChange={(e) => setF("descEn", e.target.value)} /><FieldDescription>Facoltativa. Se resta vuota, il menù mostra il testo italiano.</FieldDescription></Field>
              </div></CollapsibleContent>
            </Collapsible>
            <div className="grid grid-cols-2 gap-3">
              <Field data-invalid={fe("price") ? true : undefined}><FieldLabel htmlFor="d-prezzo">Prezzo (€)</FieldLabel><Input id="d-prezzo" inputMode="decimal" value={form.price} aria-invalid={fe("price") ? true : undefined} onChange={(e) => setF("price", e.target.value)} />{fe("price") && <FieldError>{fe("price")}</FieldError>}</Field>
              <Field data-invalid={fe("cat") ? true : undefined}><FieldLabel htmlFor="d-cat">Categoria</FieldLabel>
                <Select items={catOnly} value={form.cat} onValueChange={(v) => setF("cat", v as string)}><SelectTrigger id="d-cat" data-component="Select" className="w-full" aria-invalid={fe("cat") ? true : undefined}><SelectValue placeholder="Scegli" /></SelectTrigger><SelectContent>{catOnly.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select>
                {fe("cat") && <FieldError>{fe("cat")}</FieldError>}</Field>
            </div>
            <FieldSet data-block="allergeni">
              <FieldLegend variant="label">Allergeni</FieldLegend>
              <FieldDescription>Seleziona quelli presenti nel piatto.{form.allergens.length > 0 && ` Selezionati: ${form.allergens.length}.`}</FieldDescription>
              <ToggleGroup multiple variant="outline" spacing={2} className="flex w-full flex-wrap" data-component="ToggleGroup" aria-label="Allergeni" value={form.allergens} onValueChange={(v) => setF("allergens", v as string[])}>
                {ALLERGENS.map((a) => <ToggleGroupItem key={a} value={a} className="text-xs">{a}</ToggleGroupItem>)}
              </ToggleGroup>
            </FieldSet>
            <FieldSet data-block="caratteristiche">
              <FieldLegend variant="label">Caratteristiche</FieldLegend>
              {FLAGS.map(([k, label]) => (
                <Field key={k} orientation="horizontal"><Checkbox id={`d-${k}`} data-component="Checkbox" checked={form[k as keyof Form] as boolean} onCheckedChange={(c) => setF(k as keyof Form, (c === true) as never)} /><FieldLabel htmlFor={`d-${k}`} className="min-h-11 flex-1 items-center font-normal">{label}</FieldLabel></Field>
              ))}
            </FieldSet>
            <FieldSet data-block="disponibilita">
              <FieldLegend variant="label">Disponibilità</FieldLegend>
              <Field orientation="horizontal"><div className="flex-1"><FieldLabel htmlFor="d-sold" className="min-h-11 items-center">Terminato per il servizio</FieldLabel><FieldDescription>Temporaneo: si azzera da solo tra la fine di questo servizio e l’inizio del successivo.</FieldDescription></div><Switch id="d-sold" data-component="Switch" checked={form.soldOut} disabled={form.disabled} onCheckedChange={(c) => setF("soldOut", c === true)} /></Field>
              <Field orientation="horizontal"><div className="flex-1"><FieldLabel htmlFor="d-dis" className="min-h-11 items-center">Disabilitato</FieldLabel><FieldDescription>Assente a tempo indefinito: il piatto non compare nel menù.</FieldDescription></div><Switch id="d-dis" data-component="Switch" checked={form.disabled} onCheckedChange={(c) => setF("disabled", c === true)} /></Field>
            </FieldSet>
          </FieldGroup>
          <SheetFooter className="grid grid-cols-2"><Button size="lg" onClick={save} disabled={busy}>{busy && <Spinner data-icon="inline-start" />}{busy ? "Salvataggio…" : "Salva"}</Button><Button size="lg" variant="outline" disabled={busy} onClick={() => setSelId(null)}>Annulla</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Ricompila */}
      <AlertDialog open={rebuildOpen} onOpenChange={(o) => !o && !rebuildBusy && setRebuildOpen(false)}>
        <AlertDialogContent data-component="AlertDialog" data-state="ricompila">
          <AlertDialogHeader><AlertDialogTitle>Ricompilare il menù pubblico?</AlertDialogTitle>
            <AlertDialogDescription>La pubblicazione richiede alcuni minuti. Serve per vedere piatti nuovi e modifiche ai contenuti, ai servizi, agli orari, alle chiusure e ai giorni speciali. «Terminato» e «disabilitato» valgono già.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel disabled={rebuildBusy}>Indietro</AlertDialogCancel><Button data-component="Button" onClick={rebuild} disabled={rebuildBusy}>{rebuildBusy && <Spinner data-icon="inline-start" />}Ricompila</Button></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div data-demo className="fixed bottom-2 right-2 z-50 rounded-md border bg-card px-1.5 py-0.5 text-[11px] text-muted-foreground shadow-xs">
        <label>Demo stato <select aria-label="Stato demo" className="bg-transparent text-foreground" defaultValue="normale" onChange={(e) => demo(e.target.value)}>
          <option value="normale">normale</option><option value="caricamento">caricamento</option><option value="errore-caricamento">errore di caricamento</option><option value="vuoto">nessun piatto</option>
          <option value="molti-piatti">più di 100 piatti</option><option value="errore-azione">errore all’azione successiva</option><option value="ricompilazione-in-corso">ricompilazione già in corso</option>
        </select></label>
      </div>
    </Shell>
  )
}
export const piattiPage = <PiattiPage />
