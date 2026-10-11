import * as React from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { servizi, stati, PageHeader, ReservationsList } from "./sample"
import { Shell, GroupedFlatMenu, crumbs } from "./layouts"

/* Altezza 44 px solo nel mockup; nel progetto va impostata in components/ui. */
const H = "h-11 data-[size=default]:h-11"

function SelectField({ items, value, onChange, className }: { items: typeof servizi; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <Select items={items} value={value} onValueChange={(v) => onChange(v as string)}>
      <SelectTrigger data-component="Select" className={`w-full ${H} ${className ?? ""}`}><SelectValue /></SelectTrigger>
      <SelectContent>{items.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
    </Select>
  )
}
function SearchField() {
  return (
    <div className="relative min-w-0 flex-1">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input data-component="Input" placeholder="Cerca per nome" className="h-11 pl-9" />
    </div>
  )
}

/* F1: due colonne */
function F1() {
  const [s, setS] = React.useState("tutti"); const [t, setT] = React.useState("tutti")
  return (
    <div className="grid grid-cols-2 gap-2" data-block="filtri" data-variant="due-colonne">
      <div className="col-span-2 flex"><SearchField /></div>
      <SelectField items={servizi} value={s} onChange={setS} />
      <SelectField items={stati} value={t} onChange={setT} />
    </div>
  )
}

/* F2: ricerca + pulsante Filtri che apre un foglio dal basso */
function F2() {
  const [open, setOpen] = React.useState(false)
  const [s, setS] = React.useState("cena"); const [t, setT] = React.useState("tutti")
  const count = [s, t].filter((v) => v !== "tutti").length
  return (
    <div data-block="filtri" data-variant="foglio">
      <div className="flex gap-2">
        <SearchField />
        <Button variant="outline" data-component="Button" data-variant="outline" className="h-11 px-3" onClick={() => setOpen(true)}>
          <SlidersHorizontal data-icon="inline-start" /> Filtri
          {count > 0 && <Badge data-component="Badge" variant="default" className="ml-1">{count}</Badge>}
        </Button>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" data-component="Sheet" data-variant="bottom">
          <SheetHeader><SheetTitle>Filtri</SheetTitle><SheetDescription>Restringi l'elenco delle prenotazioni.</SheetDescription></SheetHeader>
          <div className="flex flex-col gap-3 px-4">
            <SelectField items={servizi} value={s} onChange={setS} />
            <SelectField items={stati} value={t} onChange={setT} />
          </div>
          <SheetFooter>
            <Button size="lg" className="h-11" onClick={() => setOpen(false)}>Applica</Button>
            <Button size="lg" variant="outline" className="h-11" onClick={() => { setS("tutti"); setT("tutti") }}>Azzera</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

/* F3: servizio a pulsanti (un tocco) + ricerca e stato */
function F3() {
  const [s, setS] = React.useState("tutti"); const [t, setT] = React.useState("tutti")
  return (
    <div className="flex flex-col gap-2" data-block="filtri" data-variant="servizio-a-pulsanti">
      <ToggleGroup data-component="ToggleGroup" data-variant="outline" variant="outline" spacing={0} className="w-full" value={[s]} onValueChange={(v) => v[0] && setS(v[0] as string)}>
        {servizi.map((x) => <ToggleGroupItem key={x.value} value={x.value} className="h-11 flex-1">{x.value === "tutti" ? "Tutti" : x.label}</ToggleGroupItem>)}
      </ToggleGroup>
      <div className="flex gap-2">
        <SearchField />
        <div className="w-36 shrink-0"><SelectField items={stati} value={t} onChange={setT} /></div>
      </div>
    </div>
  )
}

/* F4: ricerca + interruttore che apre i filtri nella pagina */
function F4() {
  const [open, setOpen] = React.useState(false)
  const [s, setS] = React.useState("tutti"); const [t, setT] = React.useState("tutti")
  return (
    <Collapsible open={open} onOpenChange={setOpen} data-block="filtri" data-variant="a-scomparsa">
      <div className="flex gap-2">
        <SearchField />
        <Button variant={open ? "secondary" : "outline"} aria-expanded={open} aria-label="Filtri" data-component="Button" data-variant="outline" className="size-11" onClick={() => setOpen(!open)}>
          <SlidersHorizontal />
        </Button>
      </div>
      <CollapsibleContent>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <SelectField items={servizi} value={s} onChange={setS} />
          <SelectField items={stati} value={t} onChange={setT} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/* da md in su: riga unica, uguale in tutte le varianti */
function DesktopRow() {
  const [s, setS] = React.useState("tutti"); const [t, setT] = React.useState("tutti")
  return (
    <div className="flex gap-2" data-block="filtri-desktop">
      <SearchField />
      <div className="w-44"><SelectField items={servizi} value={s} onChange={setS} className="md:data-[size=default]:h-8" /></div>
      <div className="w-44"><SelectField items={stati} value={t} onChange={setT} className="md:data-[size=default]:h-8" /></div>
    </div>
  )
}

const variants: Record<number, { name: string; node: React.ReactNode }> = {
  1: { name: "Due colonne", node: <F1 /> },
  2: { name: "Foglio dal basso", node: <F2 /> },
  3: { name: "Servizio a pulsanti", node: <F3 /> },
  4: { name: "A scomparsa", node: <F4 /> },
}

export const filterPages: Record<number, React.ReactNode> = Object.fromEntries(
  Object.entries(variants).map(([k, v]) => [
    k,
    <Shell menu={<GroupedFlatMenu />} topbar={crumbs}>
      <PageHeader title="Elenco prenotazioni" description="Prenotazioni di oggi, tutti i canali." />
      <ReservationsList filters={<><div className="md:hidden">{v.node}</div><div className="hidden md:block"><DesktopRow /></div></>} />
    </Shell>,
  ]),
)
