import * as React from "react"
import { UtensilsCrossed, Clock, CalendarDays, ChevronRight, ExternalLink, PanelsTopLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Shell, GroupedFlatMenu } from "./layouts"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

type Item = { key: string; title: string; desc: string; status?: string; icon: React.ComponentType<any> }
const items: Item[] = [
  { key: "reservations", title: "Prenotazioni", desc: "Elenco, eccezioni giorno, impostazioni", status: "Oggi 18 coperti · prossima alle 19:30", icon: CalendarDays },
  { key: "menu", title: "Menù", desc: "Piatti, vini, bevande, distillati, menù fissi", status: "3 piatti non disponibili", icon: UtensilsCrossed },
  { key: "hours", title: "Orari", desc: "Ristorante, B&B, giorni di riposo, chiusure", status: "Oggi: 12:00–15:00 e 19:00–23:00", icon: Clock },
]

function SectionCard({ it, withStatus, external = false }: { it: Item; withStatus: boolean; external?: boolean }) {
  return (
    <a href="#" className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50" data-component="Card" data-block={`scheda-${it.key}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted"><it.icon className="size-5" /></div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{it.title}</div>
            <div className="text-xs text-muted-foreground">{it.desc}</div>
            {withStatus && <div className="mt-1 text-xs font-medium">{it.status}</div>}
          </div>
          {external ? <ExternalLink className="size-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
        </CardContent>
      </Card>
    </a>
  )
}

function Home({ withStatus, mode = "none", themeSwitch = false, empty = false, limited = false }: { withStatus: boolean; mode?: "none" | "menu" | "group" | "card"; themeSwitch?: boolean; empty?: boolean; limited?: boolean }) {
  return (
    <Shell themeSwitch={themeSwitch} adminInUserMenu={mode === "menu"} menu={<GroupedFlatMenu activeNone none={empty} limited={limited} adminGroup={mode === "group"} />} topbar={<span className="text-sm font-medium">Area App</span>}>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{withStatus ? "Oggi" : "Area App"}</h1>
        <p className="text-sm text-muted-foreground">{withStatus ? "Situazione di oggi e accesso alle sezioni." : "Scegli una sezione."}</p>
      </div>
      {empty ? (
        <div className="flex flex-col items-start gap-1 rounded-lg border border-dashed p-6" data-block="vuoto"><p className="text-sm font-medium">Nessuna sezione disponibile</p><p className="text-sm text-muted-foreground">Il tuo account non ha accesso a nessuna sezione. Se ritieni di dover avere accesso, contatta l’amministratore.</p></div>
      ) : (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" data-block="schede-sezioni">
        {items.map((it) => <SectionCard key={it.key} it={it} withStatus={withStatus} />)}
        {mode === "card" && <SectionCard it={{ key: "admin", title: "Admin", desc: "Contenuti dei siti e amministrazione", icon: PanelsTopLeft }} withStatus={false} external />}
      </div>
      )}
    </Shell>
  )
}
export const homePages: Record<number, React.ReactNode> = { 1: <Home withStatus={false} />, 2: <Home withStatus={true} /> }
export const adminLinkPages: Record<number, React.ReactNode> = { 1: <Home withStatus mode="menu" />, 2: <Home withStatus mode="group" />, 3: <Home withStatus mode="card" /> }

export const themePage = <Home withStatus mode="menu" themeSwitch />
export const shellHome = (variant: "senza-righe" | "con-righe" | "vuota" | "segnaposto-piatti" | "segnaposto-orari" | "segnaposto-prenotazioni") => {
  if (variant.startsWith("segnaposto-")) return <Segnaposto which={variant.slice(11) as "piatti" | "orari" | "prenotazioni"} />
  return <Home withStatus={variant === "con-righe"} mode="menu" themeSwitch empty={variant === "vuota"} limited={variant === "senza-righe"} />
}

const SEGNAPOSTO = {
  piatti: { title: "Piatti", label: "Piatti", group: "Menù" },
  orari: { title: "Orari", label: "Orari", group: null },
  prenotazioni: { title: "Prenotazioni", label: "Elenco", group: "Prenotazioni" },
} as const
function Segnaposto({ which }: { which: keyof typeof SEGNAPOSTO }) {
  const s = SEGNAPOSTO[which]
  const crumbs = (
    <Breadcrumb><BreadcrumbList>
      {s.group && <><BreadcrumbItem><BreadcrumbLink href="#">{s.group}</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /></>}
      <BreadcrumbItem><BreadcrumbPage>{s.label}</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList></Breadcrumb>
  )
  return (
    <Shell themeSwitch adminInUserMenu menu={<GroupedFlatMenu limited activeLabel={s.label} />} topbar={crumbs}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5" data-block="segnaposto">
        <div data-block="intestazione-pagina"><h1 className="text-xl font-semibold tracking-tight">{s.title}</h1><p className="text-sm text-muted-foreground">Questa sezione sarà disponibile a breve.</p></div>
      </div>
    </Shell>
  )
}
