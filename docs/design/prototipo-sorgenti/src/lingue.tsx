import * as React from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const cats = [{ value: "antipasti", label: "Antipasti" }, { value: "primi", label: "Primi" }, { value: "secondi", label: "Secondi" }]
const HINT = "Facoltativa. Se resta vuota, il menù mostra il testo italiano."

function Rest() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field><FieldLabel htmlFor="g-price">Prezzo (€)</FieldLabel><Input id="g-price" inputMode="decimal" defaultValue="9,00" /></Field>
        <Field><FieldLabel htmlFor="g-cat">Categoria</FieldLabel>
          <Select items={cats} defaultValue="antipasti"><SelectTrigger id="g-cat" className="w-full"><SelectValue /></SelectTrigger><SelectContent>{cats.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></Field>
      </div>
      <p className="text-sm text-muted-foreground">… allergeni, flag, «terminato» e «disabilitato» seguono.</p>
    </>
  )
}
const IT = () => (<>
  <Field><FieldLabel htmlFor="g-nome">Nome</FieldLabel><Input id="g-nome" defaultValue="Nem di carne" /></Field>
  <Field><FieldLabel htmlFor="g-desc">Descrizione</FieldLabel><Textarea id="g-desc" defaultValue="Involtini fritti di maiale con verdure e vermicelli, serviti con salsa agrodolce." /></Field>
</>)

function A() {
  return (
    <Tabs defaultValue="it" className="gap-4" data-variant="schede">
      <TabsList data-component="Tabs" className="w-full"><TabsTrigger value="it">Italiano</TabsTrigger><TabsTrigger value="en">Inglese <Badge variant="outline" className="ml-1.5">Manca</Badge></TabsTrigger></TabsList>
      <TabsContent value="it" className="flex flex-col gap-4"><IT /></TabsContent>
      <TabsContent value="en" className="flex flex-col gap-4">
        <Field><FieldLabel htmlFor="g-nome-en">Name</FieldLabel><Input id="g-nome-en" placeholder="Nem di carne" /></Field>
        <Field><FieldLabel htmlFor="g-desc-en">Description</FieldLabel><Textarea id="g-desc-en" /><FieldDescription>{HINT}</FieldDescription></Field>
      </TabsContent>
    </Tabs>
  )
}
function B() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex flex-col gap-4" data-variant="inglese-a-scomparsa">
      <IT />
      <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border">
        <CollapsibleTrigger render={<button type="button" className="flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm font-medium" />}>
          Traduzione inglese <span className="font-normal text-muted-foreground">(facoltativa)</span><Badge variant="outline" className="ml-auto">Manca</Badge><ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent><div className="flex flex-col gap-4 border-t p-3">
          <Field><FieldLabel htmlFor="g-nome-en">Name</FieldLabel><Input id="g-nome-en" placeholder="Nem di carne" /></Field>
          <Field><FieldLabel htmlFor="g-desc-en">Description</FieldLabel><Textarea id="g-desc-en" /><FieldDescription>{HINT}</FieldDescription></Field>
        </div></CollapsibleContent>
      </Collapsible>
    </div>
  )
}
function C() {
  return (
    <div className="flex flex-col gap-4" data-variant="tutto-visibile">
      <Field><FieldLabel htmlFor="g-nome">Nome (italiano)</FieldLabel><Input id="g-nome" defaultValue="Nem di carne" /></Field>
      <Field><FieldLabel htmlFor="g-nome-en">Nome (inglese)</FieldLabel><Input id="g-nome-en" /></Field>
      <Field><FieldLabel htmlFor="g-desc">Descrizione (italiano)</FieldLabel><Textarea id="g-desc" defaultValue="Involtini fritti di maiale con verdure e vermicelli, serviti con salsa agrodolce." /></Field>
      <Field><FieldLabel htmlFor="g-desc-en">Descrizione (inglese)</FieldLabel><Textarea id="g-desc-en" /><FieldDescription>{HINT}</FieldDescription></Field>
    </div>
  )
}
const VARIANTS: Record<number, React.ReactNode> = { 1: <A />, 2: <B />, 3: <C /> }
export function LingueVariant({ n }: { n: number }) {
  return (
    <div className="bg-popover text-popover-foreground flex min-h-svh flex-col gap-4 py-4 text-sm" data-block="foglio-piatto">
      <div className="px-4"><h1 className="text-base font-medium">Modifica piatto</h1><p className="text-muted-foreground">Antipasti · 9,00 €</p></div>
      <FieldGroup className="px-4" data-block="modulo-piatto">{VARIANTS[n]}<Rest /></FieldGroup>
      <div className="mt-auto flex flex-col gap-2 p-4"><Button size="lg">Salva</Button><Button size="lg" variant="outline">Annulla</Button></div>
    </div>
  )
}
