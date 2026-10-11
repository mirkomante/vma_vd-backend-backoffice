import * as React from "react"
import {
  UtensilsCrossed, Clock, CalendarDays, ChevronRight, ChevronsUpDown, LogOut, Store,
  Wine, GlassWater, Martini, BookOpen, ExternalLink, PanelsTopLeft, Sun, Moon, Monitor,
} from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub,
  SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarTrigger, SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PageHeader, ReservationsList } from "./sample"

type Sub = { label: string; active?: boolean }
type Section = { key: string; label: string; icon: React.ComponentType<any>; subs?: Sub[]; active?: boolean }

const sections: Section[] = [
  { key: "menu", label: "Menù", icon: UtensilsCrossed,
    subs: [{ label: "Piatti" }, { label: "Vini" }, { label: "Bevande" }, { label: "Distillati" }, { label: "Menù fissi" }] },
  { key: "hours", label: "Orari", icon: Clock },
  { key: "reservations", label: "Prenotazioni", icon: CalendarDays, active: true,
    subs: [{ label: "Elenco", active: true }, { label: "Eccezioni giorno" }, { label: "Impostazioni" }] },
]
const flatIcons: Record<string, React.ComponentType<any>> = {
  Piatti: UtensilsCrossed, Vini: Wine, Bevande: GlassWater, Distillati: Martini, "Menù fissi": BookOpen,
  Elenco: CalendarDays, "Eccezioni giorno": CalendarDays, Impostazioni: CalendarDays,
}

function Brand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" render={<a href="#" />} tooltip="Area App">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"><Store className="size-4" /></div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Area App</span>
            <span className="truncate text-xs text-muted-foreground">Manager</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

type Theme = "system" | "light" | "dark"
export function useTheme() {
  const [theme, setTheme] = React.useState<Theme>("system")
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches)
      document.documentElement.classList.toggle("dark", dark)
      document.documentElement.style.colorScheme = dark ? "dark" : "light"
    }
    apply(); mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [theme])
  return [theme, setTheme] as const
}

function User({ adminItem = false, themeSwitch = false }: { adminItem?: boolean; themeSwitch?: boolean }) {
  const [theme, setTheme] = useTheme()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip="Account" />}>
            <Avatar className="size-8"><AvatarFallback>MR</AvatarFallback></Avatar>
            <span className="min-w-0 flex-1 truncate text-left text-sm">marco.rossi@esempio.it</span>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="min-w-56">
            {themeSwitch && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Tema</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
                    <DropdownMenuRadioItem value="light"><Sun /> Chiaro</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark"><Moon /> Scuro</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system"><Monitor /> Sistema</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            {adminItem && <DropdownMenuItem render={<a href="#" />}><PanelsTopLeft /> Vai all'Admin <ExternalLink className="ml-auto size-3.5 text-muted-foreground" /></DropdownMenuItem>}
            <DropdownMenuItem><LogOut /> Esci</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

/* ---- voci di menu: tre stili ---- */
function NestedMenu() {
  return (
    <SidebarMenu>
      {sections.map((s) =>
        s.subs ? (
          <Collapsible key={s.key} defaultOpen={s.active} render={<SidebarMenuItem />} className="group/collapsible">
            <CollapsibleTrigger render={<SidebarMenuButton tooltip={s.label} isActive={s.active && false} />}>
              <s.icon /> <span>{s.label}</span>
              <ChevronRight className="ml-auto transition-transform group-data-[open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {s.subs.map((u) => (
                  <SidebarMenuSubItem key={u.label}>
                    <SidebarMenuSubButton render={<a href="#" />} isActive={u.active}><span>{u.label}</span></SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={s.key}>
            <SidebarMenuButton render={<a href="#" />} tooltip={s.label}><s.icon /><span>{s.label}</span></SidebarMenuButton>
          </SidebarMenuItem>
        ),
      )}
    </SidebarMenu>
  )
}

function ThreeItemsMenu() {
  return (
    <SidebarMenu>
      {sections.map((s) => (
        <SidebarMenuItem key={s.key}>
          <SidebarMenuButton render={<a href="#" />} isActive={s.active} tooltip={s.label}><s.icon /><span>{s.label}</span></SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export function GroupedFlatMenu({ activeNone = false, adminGroup = false, activeLabel, none = false, limited = false }: { activeNone?: boolean; adminGroup?: boolean; activeLabel?: string; none?: boolean; limited?: boolean }) {
  if (none) return null
  return (
    <>
      {sections.map((s) => (
        <SidebarGroup key={s.key}>
          <SidebarGroupLabel>{s.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {(s.subs ?? [{ label: s.label, active: s.key === "hours" && false }]).slice(0, limited ? 1 : undefined).map((u) => {
                const Icon = s.subs ? flatIcons[u.label] ?? s.icon : s.icon
                return (
                  <SidebarMenuItem key={u.label}>
                    <SidebarMenuButton render={<a href="#" />} isActive={activeNone ? false : activeLabel ? u.label === activeLabel : (u as Sub).active} tooltip={u.label}><Icon /><span>{u.label}</span></SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
      {adminGroup && (
        <SidebarGroup>
          <SidebarGroupLabel>Amministrazione</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<a href="#" />} tooltip="Admin"><PanelsTopLeft /><span>Admin</span><ExternalLink className="ml-auto size-3.5 text-muted-foreground" /></SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </>
  )
}

export function Shell({
  variant = "sidebar", collapsible = "offcanvas", defaultOpen = true, menu, topbar, children, adminInUserMenu = false, themeSwitch = false, footerBar = null,
}: {
  variant?: "sidebar" | "inset" | "floating"; collapsible?: "offcanvas" | "icon"; defaultOpen?: boolean
  menu: React.ReactNode; topbar: React.ReactNode; children: React.ReactNode; adminInUserMenu?: boolean; themeSwitch?: boolean; footerBar?: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar variant={variant} collapsible={collapsible} data-component="Sidebar" data-variant={variant} data-collapsible={collapsible}>
        <SidebarHeader><Brand /></SidebarHeader>
        <SidebarContent>{menu}</SidebarContent>
        <SidebarFooter><User adminItem={adminInUserMenu} themeSwitch={themeSwitch} /></SidebarFooter>
        {collapsible === "icon" && <SidebarRail />}
      </Sidebar>
      <SidebarInset data-component="SidebarInset">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 md:px-6" data-block="topbar">
          <SidebarTrigger className="-ml-1 size-9 md:size-7" />
          <Separator orientation="vertical" className="mx-1 data-vertical:h-4 data-vertical:self-center" />
          {topbar}
        </header>
        <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">{children}</div>
        {footerBar}
      </SidebarInset>
    </SidebarProvider>
  )
}

export const crumbs = (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="#">Prenotazioni</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>Elenco</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
)
const titleOnly = <span className="text-sm font-medium">Prenotazioni</span>

const pageBody = (
  <>
    <PageHeader title="Elenco prenotazioni" description="Prenotazioni di oggi, tutti i canali." />
    <ReservationsList />
  </>
)
const tabsBody = (
  <Tabs defaultValue="elenco" className="gap-5">
    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0" data-block="sotto-navigazione">
      <TabsList variant="line" data-component="Tabs" data-variant="line">
        <TabsTrigger value="elenco">Elenco</TabsTrigger>
        <TabsTrigger value="eccezioni">Eccezioni giorno</TabsTrigger>
        <TabsTrigger value="impostazioni">Impostazioni</TabsTrigger>
      </TabsList>
    </div>
    <TabsContent value="elenco" className="flex flex-col gap-5">
      <PageHeader title="Elenco prenotazioni" description="Prenotazioni di oggi, tutti i canali." />
      <ReservationsList />
    </TabsContent>
  </Tabs>
)

export const layouts: Record<number, { name: string; node: React.ReactNode }> = {
  1: { name: "Classica, sottoaree nel menu", node: <Shell menu={<SidebarGroup><SidebarGroupContent><NestedMenu /></SidebarGroupContent></SidebarGroup>} topbar={crumbs}>{pageBody}</Shell> },
  2: { name: "Classica, 3 voci + schede in pagina", node: <Shell menu={<SidebarGroup><SidebarGroupContent><ThreeItemsMenu /></SidebarGroupContent></SidebarGroup>} topbar={titleOnly}>{tabsBody}</Shell> },
  3: { name: "Inset, sottoaree nel menu", node: <Shell variant="inset" menu={<SidebarGroup><SidebarGroupContent><NestedMenu /></SidebarGroupContent></SidebarGroup>} topbar={crumbs}>{pageBody}</Shell> },
  4: { name: "Compatta a icone + schede in pagina", node: <Shell collapsible="icon" defaultOpen={false} menu={<SidebarGroup><SidebarGroupContent><ThreeItemsMenu /></SidebarGroupContent></SidebarGroup>} topbar={titleOnly}>{tabsBody}</Shell> },
  5: { name: "Gruppi con tutte le destinazioni visibili", node: <Shell menu={<GroupedFlatMenu />} topbar={crumbs}>{pageBody}</Shell> },
}
