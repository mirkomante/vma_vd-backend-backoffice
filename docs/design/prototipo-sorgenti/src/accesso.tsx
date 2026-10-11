import * as React from "react"
import { CircleAlert, CircleCheck, Store } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useTheme } from "./layouts"

/* messaggi esistenti di lib/auth/** (non si riscrivono) */
const M = {
  loginFail: "Accesso non riuscito. Se ritieni di dover avere accesso, contatta l’amministratore.",
  resetOk: "Password aggiornata. Puoi accedere con le nuove credenziali.",
  forgotSent: "Se l’indirizzo è in archivio, riceverai un’email con le istruzioni. Controlla anche lo spam.",
  resetFail: "Il link non è valido o è scaduto. Se ritieni di dover avere accesso, contatta l’amministratore.",
  verifyOk: "Indirizzo confermato. Puoi accedere all’Area App.",
  verifyFail: "Il link non è valido o è già stato usato. Se ritieni di dover avere accesso, contatta l’amministratore.",
}

function Notice({ kind, children }: { kind: "ok" | "err"; children: React.ReactNode }) {
  return (
    <Alert role={kind === "ok" ? "status" : "alert"} variant={kind === "err" ? "destructive" : "default"} data-component="Alert" data-block="avviso">
      {kind === "err" ? <CircleAlert /> : <CircleCheck />}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
function Frame({ title, description, children, links }: { title: string; description?: string; children: React.ReactNode; links: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center p-4 md:p-6" data-block="pagina-accesso">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex flex-col items-center gap-3 text-center" data-block="intestazione-accesso">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Store className="size-5" /></div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        <Card data-component="Card"><CardContent className="flex flex-col gap-4">{children}</CardContent></Card>
        <div className="flex flex-col items-center" data-block="collegamenti">{links}</div>
      </div>
    </main>
  )
}
const LinkBtn = ({ children, muted = false }: { children: string; muted?: boolean }) => (
  <a href="#" data-component="Button" data-variant="link" className={cn(buttonVariants({ variant: "link" }), "underline underline-offset-4", muted && "text-muted-foreground")}>{children}</a>
)
const EmailField = () => (
  <Field><FieldLabel htmlFor="a-email">Email</FieldLabel><Input id="a-email" data-component="Input" type="email" name="email" autoComplete="username" required /></Field>
)

export type AccessoName = "login" | "login-errore" | "login-reset-ok" | "forgot" | "forgot-inviata" | "reset" | "reset-fallito" | "reset-senza-token" | "verify-ok" | "verify-fallita"

export function Accesso({ name }: { name: AccessoName }) {
  useTheme()
  if (name.startsWith("login")) {
    return (
      <Frame title="Area App" description="Accedi con Google oppure con email e password." links={<><LinkBtn>Password dimenticata?</LinkBtn><LinkBtn muted>Torna al sito</LinkBtn></>}>
        {name === "login-errore" && <Notice kind="err">{M.loginFail}</Notice>}
        {name === "login-reset-ok" && <Notice kind="ok">{M.resetOk}</Notice>}
        <a href="#" data-component="Button" data-variant="default" data-size="lg" className={buttonVariants({ size: "lg" })}>Accedi con Google</a>
        <div className="flex items-center gap-3 text-xs tracking-wide text-muted-foreground uppercase" data-block="separatore-oppure"><Separator className="flex-1" />oppure<Separator className="flex-1" /></div>
        <form className="flex flex-col gap-4" method="POST" action="/api/users/login/app" onSubmit={(e) => e.preventDefault()} data-block="modulo-accesso">
          <FieldGroup>
            <EmailField />
            <Field><FieldLabel htmlFor="a-pass">Password</FieldLabel><Input id="a-pass" data-component="Input" type="password" name="password" autoComplete="current-password" required /></Field>
          </FieldGroup>
          <Button variant="outline" size="lg" type="submit" data-component="Button">Accedi</Button>
        </form>
      </Frame>
    )
  }
  if (name.startsWith("forgot")) {
    return (
      <Frame title="Password dimenticata" description="Inserisci l’email dell’account locale. Se è in archivio riceverai le istruzioni." links={<LinkBtn>Torna al login</LinkBtn>}>
        {name === "forgot-inviata" && <Notice kind="ok">{M.forgotSent}</Notice>}
        <form className="flex flex-col gap-4" method="POST" action="/api/users/forgot-password/app" onSubmit={(e) => e.preventDefault()} data-block="modulo-accesso">
          <FieldGroup><EmailField /></FieldGroup>
          <Button size="lg" type="submit" data-component="Button">Invia istruzioni</Button>
        </form>
      </Frame>
    )
  }
  if (name.startsWith("reset")) {
    const noToken = name === "reset-senza-token"
    return (
      <Frame title="Nuova password" description="Scegli una password di almeno 8 caratteri, con una maiuscola, una minuscola e una cifra." links={<LinkBtn>Torna al login</LinkBtn>}>
        {(name === "reset-fallito" || noToken) && <Notice kind="err">{M.resetFail}</Notice>}
        {!noToken && (
          <form className="flex flex-col gap-4" method="POST" action="/api/users/reset-password/app" onSubmit={(e) => e.preventDefault()} data-block="modulo-accesso">
            <FieldGroup><Field><FieldLabel htmlFor="a-newpass">Nuova password</FieldLabel><Input id="a-newpass" data-component="Input" type="password" name="password" autoComplete="new-password" required minLength={8} /></Field></FieldGroup>
            <Button size="lg" type="submit" data-component="Button">Aggiorna password</Button>
          </form>
        )}
      </Frame>
    )
  }
  const ok = name === "verify-ok"
  return (
    <Frame title="Conferma email" links={<LinkBtn>Vai al login</LinkBtn>}>
      <Notice kind={ok ? "ok" : "err"}>{ok ? M.verifyOk : M.verifyFail}</Notice>
    </Frame>
  )
}
