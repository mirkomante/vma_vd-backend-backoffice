import * as React from "react"
import { Plus, Search, Phone, Globe, User, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

type Row = { id: string; ora: string; nome: string; coperti: number; canale: "Sito" | "Telefono" | "Di persona"; stato: "Confermata" | "In attesa" | "Annullata" }
const rows: Row[] = [
  { id: "1", ora: "19:30", nome: "Rossi Marta", coperti: 4, canale: "Sito", stato: "Confermata" },
  { id: "2", ora: "20:00", nome: "Bianchi Luca", coperti: 2, canale: "Telefono", stato: "In attesa" },
  { id: "3", ora: "20:00", nome: "Conti Elena", coperti: 6, canale: "Di persona", stato: "Confermata" },
  { id: "4", ora: "20:30", nome: "Greco Paolo", coperti: 3, canale: "Sito", stato: "Annullata" },
  { id: "5", ora: "21:00", nome: "Ferrari Anna", coperti: 2, canale: "Sito", stato: "Confermata" },
]
const statoVariant = (s: Row["stato"]) =>
  s === "Confermata" ? "default" : s === "In attesa" ? "secondary" : "outline"
const CanaleIcon = ({ c }: { c: Row["canale"] }) =>
  c === "Sito" ? <Globe /> : c === "Telefono" ? <Phone /> : <User />

export const servizi = [
  { value: "tutti", label: "Tutti i servizi" },
  { value: "pranzo", label: "Pranzo" },
  { value: "cena", label: "Cena" },
]
export const stati = [
  { value: "tutti", label: "Tutti gli stati" },
  { value: "confermata", label: "Confermata" },
  { value: "attesa", label: "In attesa" },
]

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button size="lg" data-component="Button" data-variant="default" data-size="lg" className="w-full sm:w-auto">
        <Plus data-icon="inline-start" /> Nuova prenotazione
      </Button>
    </div>
  )
}

export function ReservationsList({ filters }: { filters?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      {filters ?? <div className="flex flex-col gap-2 sm:flex-row" data-block="filtri">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input data-component="Input" placeholder="Cerca per nome" className="pl-8" />
        </div>
        <Select items={servizi} defaultValue="tutti">
          <SelectTrigger data-component="Select" className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{servizi.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
        </Select>
        <Select items={stati} defaultValue="tutti">
          <SelectTrigger data-component="Select" className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{stati.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
        </Select>
      </div>}

      {/* schermo largo: tabella */}
      <div className="hidden rounded-lg border md:block" data-block="elenco-tabella">
        <Table data-component="Table">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Ora</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-24">Coperti</TableHead>
              <TableHead>Canale</TableHead>
              <TableHead>Stato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.ora}</TableCell>
                <TableCell>{r.nome}</TableCell>
                <TableCell>{r.coperti}</TableCell>
                <TableCell><span className="inline-flex items-center gap-1.5 text-muted-foreground [&_svg]:size-3.5"><CanaleIcon c={r.canale} />{r.canale}</span></TableCell>
                <TableCell><Badge data-component="Badge" variant={statoVariant(r.stato)}>{r.stato}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* telefono: schede */}
      <div className="flex flex-col gap-2 md:hidden" data-block="elenco-schede">
        {rows.map((r) => (
          <Card key={r.id} size="sm" data-component="Card" data-size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="w-12 text-base font-semibold tabular-nums">{r.ora}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{r.nome}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground [&_svg]:size-3"><UtensilsCrossed />{r.coperti} coperti · <CanaleIcon c={r.canale} />{r.canale}</div>
              </div>
              <Badge variant={statoVariant(r.stato)}>{r.stato}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
