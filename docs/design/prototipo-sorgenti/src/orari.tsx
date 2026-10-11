import * as React from "react"
import { Pencil, Trash2, Plus, CircleCheck, CircleAlert, Info } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { useIsMobile } from "@/hooks/use-mobile"
import { Shell, GroupedFlatMenu } from "./layouts"

/* --- logica di esempio (nel progetto: lib/systemSettings/) --- */
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/
const timeError = (v: string) => (!v.trim() ? "Orario obbligatorio." : !TIME_RE.test(v) ? "Formato non valido: usa HH:mm in 24 ore (es. 09:30)." : null)
type Closure = { id: number; date: string; label: string }
type State = { lunchStart: string; lunchEnd: string; dinnerStart: string; dinnerEnd: string; closedDays: string[]; closures: Closure[]; bnbIn: string; bnbOut: string }
const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`
function easter(y: number) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1; return { mo, da } }
function holidays(y: number): { date: string; label: string }[] {
  const e = easter(y); const em = new Date(Date.UTC(y, e.mo - 1, e.da + 1))
  return [
    [1, 1, "Capodanno"], [1, 6, "Epifania"], [4, 25, "Festa della Liberazione"], [5, 1, "Festa del Lavoro"], [6, 2, "Festa della Repubblica"],
    [8, 15, "Ferragosto"], [11, 1, "Ognissanti"], [12, 7, "Sant'Ambrogio"], [12, 8, "Immacolata Concezione"], [12, 25, "Natale"], [12, 26, "Santo Stefano"],
  ].map(([m, d, l]) => ({ date: iso(y, m as number, d as number), label: l as string })).concat([
    { date: iso(y, e.mo, e.da), label: "Pasqua" }, { date: iso(y, em.getUTCMonth() + 1, em.getUTCDate()), label: "Lunedì dell'Angelo" },
  ])
}
const plural = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : `${n} ${many}`)
const fmt = (d: string) => d ? d.split("-").reverse().join("/") : ""
const sortClosures = (c: Closure[]) => [...c].sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"))
let nextId = 100
const initial: State = {
  lunchStart: "12:30", lunchEnd: "14:30", dinnerStart: "19:00", dinnerEnd: "23:00", closedDays: ["monday"],
  closures: [
    { id: 1, date: "2026-11-01", label: "Ognissanti" }, { id: 2, date: "2026-12-07", label: "Sant'Ambrogio" },
    { id: 3, date: "2026-12-08", label: "Immacolata Concezione" }, { id: 4, date: "2026-12-25", label: "Natale" },
    { id: 5, date: "2026-12-26", label: "Santo Stefano" }, { id: 6, date: "2027-01-01", label: "Capodanno" },
  ],
  bnbIn: "15:00", bnbOut: "11:00",
}
const DAYS = [["monday", "Lun", "Lunedì"], ["tuesday", "Mar", "Martedì"], ["wednesday", "Mer", "Mercoledì"], ["thursday", "Gio", "Giovedì"], ["friday", "Ven", "Venerdì"], ["saturday", "Sab", "Sabato"], ["sunday", "Dom", "Domenica"]]

function TimeField({ id, label, value, onChange, error, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; error: string | null; placeholder: string }) {
  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input id={id} data-component="Input" type="time" step={60} autoComplete="off" value={value} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} onChange={(e) => onChange(e.target.value)} />
      {error && <FieldError id={`${id}-err`}>{error}</FieldError>}
    </Field>
  )
}

function OrariPage() {
  const isNarrow = useIsMobile()
  const [saved, setSaved] = React.useState<State>(initial)
  const [s, setS] = React.useState<State>(initial)
  const [showErrors, setShowErrors] = React.useState(false)
  const [notice, setNotice] = React.useState<{ kind: "ok" | "err" | "info"; title: string; text?: string } | null>(null)
  const [edit, setEdit] = React.useState<Closure | null>(null)
  const [editIsNew, setEditIsNew] = React.useState(false)
  const [year, setYear] = React.useState(String(new Date().getFullYear()))
  const [saving, setSaving] = React.useState(false)
  const [phase, setPhase] = React.useState<"ok" | "loadError">("ok")
  const [configured, setConfigured] = React.useState(true)
  const [failNext, setFailNext] = React.useState(false)
  const [leaveTo, setLeaveTo] = React.useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = React.useState(false)
  const dirty = JSON.stringify(s) !== JSON.stringify(saved)
  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }))
  const errs = {
    lunchStart: timeError(s.lunchStart), lunchEnd: timeError(s.lunchEnd), dinnerStart: timeError(s.dinnerStart), dinnerEnd: timeError(s.dinnerEnd),
    bnbIn: timeError(s.bnbIn), bnbOut: timeError(s.bnbOut),
  }
  const e = (k: keyof typeof errs) => (showErrors ? errs[k] : null)
  const hasErrors = Object.values(errs).some(Boolean)
  const yearNum = Number(year); const yearOk = /^\d{4}$/.test(year) && yearNum >= 1900 && yearNum <= 2100

  const SERVER_ERR = { kind: "err" as const, title: "Salvataggio non riuscito", text: "Non è stato salvato nulla. Controlla la connessione e riprova; se il problema continua, avvisa l’amministratore." }
  async function save() {
    if (hasErrors) {
      setShowErrors(true); setNotice({ kind: "err", title: "Controlla i campi evidenziati", text: "Alcuni orari non sono validi: non è stato salvato nulla." })
      requestAnimationFrame(() => { const f = document.querySelector<HTMLElement>('[aria-invalid="true"]'); f?.scrollIntoView({ block: "center" }); f?.focus({ preventScroll: true }) })
      return
    }
    setSaving(true); setNotice(null)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    if (failNext) { setFailNext(false); setNotice(SERVER_ERR); return }
    setSaved(s); setConfigured(true); setShowErrors(false); setNotice({ kind: "ok", title: "Orari salvati" })
  }
  function demo(v: string) {
    setNotice(null); setShowErrors(false); setPhase("ok"); setSaving(false); setConfigured(true); setFailNext(false); setS(initial); setSaved(initial)
    if (v === "salvataggio") { setS({ ...initial, lunchEnd: "14:45" }); setSaving(true) }
    if (v === "errore-server") { setS({ ...initial, lunchEnd: "14:45" }); setNotice(SERVER_ERR) }
    if (v === "prossimo-fallisce") setFailNext(true)
    if (v === "uscita") { setS({ ...initial, bnbIn: "15:30" }); setLeaveTo("#") }
    if (v === "non-configurato") { const empty = { ...initial, lunchStart: "", lunchEnd: "", dinnerStart: "", dinnerEnd: "" }; setS(empty); setSaved(empty); setConfigured(false) }
    if (v === "errore-caricamento") setPhase("loadError")
  }
  React.useEffect(() => {
    const h = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement).closest("a")
      if (!a || !dirty || a.closest('[data-block="contenitore-form"]')) return
      ev.preventDefault(); ev.stopPropagation(); setLeaveTo(a.getAttribute("href") || "#")
    }
    document.addEventListener("click", h, true)
    return () => document.removeEventListener("click", h, true)
  }, [dirty])
  function cancel() { setS(saved); setShowErrors(false); setNotice(null) }
  function addHolidays() {
    if (!yearOk) { setNotice({ kind: "err", title: "Inserisci un anno valido (1900–2100)." }); return }
    const have = new Set(s.closures.map((c) => c.date)); const add = holidays(yearNum).filter((h) => !have.has(h.date))
    if (!add.length) { setNotice({ kind: "info", title: `Le festività del ${year} sono già tutte presenti.` }); return }
    set("closures", sortClosures([...s.closures, ...add.map((h) => ({ id: nextId++, ...h }))]))
    setNotice({ kind: "info", title: `${add.length === 1 ? "Aggiunta" : "Aggiunte"} ${plural(add.length, "festività", "festività")} del ${year}`, text: "Salva le modifiche per renderle effettive." })
  }
  const removable = yearOk ? s.closures.filter((c) => holidays(yearNum).some((h) => h.date === c.date)) : []
  function askRemove() {
    if (!yearOk) { setNotice({ kind: "err", title: "Inserisci un anno valido (1900–2100)." }); return }
    if (!removable.length) { setNotice({ kind: "info", title: `Nessuna festività predefinita da rimuovere per il ${year}.` }); return }
    setConfirmRemove(true)
  }
  function doRemove() { const ds = new Set(removable.map((c) => c.id)); set("closures", s.closures.filter((c) => !ds.has(c.id))); setConfirmRemove(false); setNotice({ kind: "info", title: `${ds.size === 1 ? "Rimossa" : "Rimosse"} ${plural(ds.size, "festività", "festività")} del ${year}`, text: "Salva le modifiche per renderle effettive." }) }
  function applyEdit() {
    if (!edit) return
    if (!edit.date || !edit.label.trim()) return
    set("closures", sortClosures(editIsNew ? [...s.closures, { ...edit, id: nextId++ }] : s.closures.map((c) => (c.id === edit.id ? edit : c))))
    setEdit(null)
  }
  const years = Array.from(new Set(s.closures.map((c) => c.date.slice(0, 4))))

  const footerBar = (
    <>
      {dirty && (
        <div className="sticky bottom-0 z-10 border-t bg-background p-3 md:px-6" data-block="barra-salvataggio">
        <div className="mx-auto grid w-full max-w-xl grid-cols-2 gap-2 sm:flex sm:items-center sm:justify-end">
          <span className="col-span-2 text-sm text-muted-foreground sm:mr-auto" aria-live="polite">{saving ? "Salvataggio in corso…" : "Modifiche non salvate"}</span>
          <Button variant="outline" size="lg" data-component="Button" data-variant="outline" data-size="lg" onClick={cancel} disabled={saving}>Annulla modifiche</Button>
          <Button size="lg" data-component="Button" data-variant="default" data-size="lg" onClick={save} disabled={saving}>{saving && <Spinner data-icon="inline-start" />}{saving ? "Salvataggio…" : "Salva modifiche"}</Button>
        </div>
        </div>
      )}
    </>
  )

  return (
    <Shell themeSwitch adminInUserMenu menu={<GroupedFlatMenu activeLabel="Orari" />}
      topbar={<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Orari</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>} footerBar={footerBar}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-5" data-block="contenitore-form">
      <div data-block="intestazione-pagina">
        <h1 className="text-xl font-semibold tracking-tight">Orari</h1>
        <p className="text-sm text-muted-foreground">Orari di vietnamonamour.com: ristorante e B&amp;B.</p>
      </div>

      {!configured && phase === "ok" && (
        <Alert role="status" data-component="Alert" data-state="non-configurato"><Info /><AlertTitle>Orari non configurati</AlertTitle><AlertDescription>Pranzo e Cena non hanno ancora orari: compila i quattro campi e salva.</AlertDescription></Alert>
      )}

      {phase === "loadError" && (
        <Alert variant="destructive" role="alert" data-component="Alert" data-state="errore-caricamento"><CircleAlert /><AlertTitle>Impossibile caricare gli orari</AlertTitle>
          <AlertDescription><p>Riprova tra qualche istante; se il problema continua, avvisa l’amministratore.</p>
            <Button variant="outline" className="mt-3" data-component="Button" data-variant="outline" onClick={() => setPhase("ok")}>Riprova</Button></AlertDescription></Alert>
      )}

      {notice && (
        <Alert role="status" data-component="Alert" variant={notice.kind === "err" ? "destructive" : "default"}>
          {notice.kind === "err" ? <CircleAlert /> : <CircleCheck />}
          <AlertTitle>{notice.title}</AlertTitle>
          {notice.text && <AlertDescription>{notice.text}</AlertDescription>}
        </Alert>
      )}

      {phase === "ok" && (
      <fieldset disabled={saving} aria-busy={saving} className="contents" data-block="moduli">
      <Card data-component="Card" data-block="servizi">
        <CardHeader><CardTitle>Servizi del ristorante</CardTitle><CardDescription>Orario di inizio e fine di Pranzo e Cena (HH:mm, 24 ore).</CardDescription></CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldSet><FieldLegend variant="label">Pranzo</FieldLegend>
              <div className="grid grid-cols-2 gap-3">
                <TimeField id="lunch-start" label="Inizio" placeholder="12:30" value={s.lunchStart} onChange={(v) => set("lunchStart", v)} error={e("lunchStart")} />
                <TimeField id="lunch-end" label="Fine" placeholder="14:30" value={s.lunchEnd} onChange={(v) => set("lunchEnd", v)} error={e("lunchEnd")} />
              </div>
            </FieldSet>
            <FieldSet><FieldLegend variant="label">Cena</FieldLegend>
              <div className="grid grid-cols-2 gap-3">
                <TimeField id="dinner-start" label="Inizio" placeholder="19:00" value={s.dinnerStart} onChange={(v) => set("dinnerStart", v)} error={e("dinnerStart")} />
                <TimeField id="dinner-end" label="Fine" placeholder="23:00" value={s.dinnerEnd} onChange={(v) => set("dinnerEnd", v)} error={e("dinnerEnd")} />
              </div>
            </FieldSet>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card data-component="Card" data-block="giorni-riposo">
        <CardHeader><CardTitle>Giorni di riposo settimanali</CardTitle><CardDescription>Giorni della settimana in cui il ristorante è chiuso.</CardDescription></CardHeader>
        <CardContent>
          <ToggleGroup multiple variant="outline" spacing={0} data-component="ToggleGroup" className="w-full sm:w-fit" value={s.closedDays} onValueChange={(v) => set("closedDays", v as string[])} aria-label="Giorni di riposo settimanali">
            {DAYS.map(([v, short, full]) => <ToggleGroupItem key={v} value={v} aria-label={full} className="flex-1 px-0 text-xs sm:w-14 sm:flex-none sm:text-sm">{short}</ToggleGroupItem>)}
          </ToggleGroup>
        </CardContent>
      </Card>

      <Card data-component="Card" data-block="chiusure-annuali">
        <CardHeader><CardTitle>Chiusure annuali</CardTitle><CardDescription>Giorni di chiusura eccezionali (festività, ferie, ecc.).</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-5">
          <FieldSet data-block="festivita">
            <FieldLegend variant="label">Festività predefinite</FieldLegend>
            <FieldDescription>13 festività: nazionali e Sant’Ambrogio.</FieldDescription>
            <Field className="max-w-40"><FieldLabel htmlFor="holiday-year">Anno</FieldLabel><Input id="holiday-year" inputMode="numeric" value={year} onChange={(ev) => setYear(ev.target.value)} data-component="Input" /></Field>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button data-component="Button" data-variant="default" onClick={addHolidays}>Aggiungi festività</Button>
              <Button data-component="Button" data-variant="outline" variant="outline" onClick={askRemove}>Rimuovi festività di un anno</Button>
            </div>
          </FieldSet>

          <div data-block="elenco-chiusure" className="flex flex-col">
            {s.closures.length === 0 && <p className="text-sm text-muted-foreground">Nessuna chiusura annuale.</p>}
            {years.map((y) => (
              <div key={y}>
                {years.length > 1 && <div className="pt-4 pb-1 text-base font-semibold text-foreground">{y}</div>}
                {s.closures.filter((c) => c.date.startsWith(y) || (!c.date && y === "")).map((c) => (
                  <div key={c.id} className="flex items-center gap-2 border-t py-1.5">
                    <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{c.label}</div><div className="text-xs text-muted-foreground tabular-nums">{fmt(c.date)}</div></div>
                    <Button variant="ghost" size="icon" aria-label={`Modifica chiusura ${c.label}`} data-component="Button" data-variant="ghost" data-size="icon" onClick={() => { setEditIsNew(false); setEdit(c) }}><Pencil /></Button>
                    <Button variant="ghost" size="icon" aria-label={`Elimina chiusura ${c.label}`} data-component="Button" data-variant="ghost" data-size="icon" onClick={() => set("closures", s.closures.filter((x) => x.id !== c.id))}><Trash2 /></Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Button variant="outline" data-component="Button" data-variant="outline" className="self-start" onClick={() => { setEditIsNew(true); setEdit({ id: 0, date: "", label: "" }) }}><Plus data-icon="inline-start" /> Aggiungi chiusura</Button>
        </CardContent>
      </Card>

      <Card data-component="Card" data-block="bnb">
        <CardHeader><CardTitle>B&amp;B (vietnamonamour.com)</CardTitle><CardDescription>Orari di check-in e check-out. L’indicazione sulla colazione è contenuto del sito.</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <TimeField id="bnb-in" label="Check-in" placeholder="15:00" value={s.bnbIn} onChange={(v) => set("bnbIn", v)} error={e("bnbIn")} />
            <TimeField id="bnb-out" label="Check-out" placeholder="11:00" value={s.bnbOut} onChange={(v) => set("bnbOut", v)} error={e("bnbOut")} />
          </div>
        </CardContent>
      </Card>
      </fieldset>
      )}

      </div>

      <AlertDialog open={leaveTo !== null} onOpenChange={(open) => !open && setLeaveTo(null)}>
        <AlertDialogContent data-component="AlertDialog" data-state="uscita">
          <AlertDialogHeader><AlertDialogTitle>Uscire senza salvare?</AlertDialogTitle>
            <AlertDialogDescription>Hai modifiche non salvate: se esci le perdi.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Resta qui</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => { setS(saved); setLeaveTo(null) }}>Esci senza salvare</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div data-demo className="fixed top-2.5 right-2 z-50 rounded-md border bg-card px-1.5 py-0.5 text-[11px] text-muted-foreground shadow-xs">
        <label>Demo stato <select aria-label="Stato demo" className="bg-transparent text-foreground" defaultValue="normale" onChange={(ev) => demo(ev.target.value)}>
          <option value="normale">normale</option>
          <option value="salvataggio">salvataggio in corso</option>
          <option value="errore-server">errore del server (già mostrato)</option>
          <option value="prossimo-fallisce">errore del server al prossimo «Salva»</option>
          <option value="uscita">conferma di uscita (con modifiche)</option>
          <option value="non-configurato">orari non configurati</option>
          <option value="errore-caricamento">errore di caricamento</option>
        </select></label>
      </div>

      <Sheet open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <SheetContent side={isNarrow ? "bottom" : "right"} data-component="Sheet">
          <SheetHeader><SheetTitle>{editIsNew ? "Nuova chiusura" : "Modifica chiusura"}</SheetTitle><SheetDescription>Poi premi «Salva modifiche» nella pagina per renderla effettiva.</SheetDescription></SheetHeader>
          <FieldGroup className="px-4">
            <Field><FieldLabel htmlFor="c-date">Data</FieldLabel><Input id="c-date" type="date" value={edit?.date ?? ""} onChange={(ev) => edit && setEdit({ ...edit, date: ev.target.value })} /></Field>
            <Field><FieldLabel htmlFor="c-label">Etichetta</FieldLabel><Input id="c-label" value={edit?.label ?? ""} onChange={(ev) => edit && setEdit({ ...edit, label: ev.target.value })} /></Field>
          </FieldGroup>
          <SheetFooter className="grid grid-cols-2">
            <Button size="lg" onClick={applyEdit} disabled={!edit?.date || !edit?.label.trim()}>Applica</Button>
            <Button size="lg" variant="outline" onClick={() => setEdit(null)}>Annulla</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={confirmRemove} onOpenChange={setConfirmRemove}>
        <AlertDialogContent data-component="AlertDialog">
          <AlertDialogHeader><AlertDialogTitle>Rimuovere le festività del {year}?</AlertDialogTitle>
            <AlertDialogDescription>{removable.length === 1 ? "Verrà tolta" : "Verranno tolte"} {plural(removable.length, "chiusura", "chiusure")} con data uguale a una festività predefinita del {year}, anche se ne hai cambiato l’etichetta. Poi premi «Salva modifiche».</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Annulla</AlertDialogCancel><AlertDialogAction onClick={doRemove}>Rimuovi</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  )
}

export const orariPage = <OrariPage />
