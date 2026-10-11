import { createRoot } from "react-dom/client"
import { layouts } from "./layouts"
import { filterPages } from "./filters"
import { homePages, adminLinkPages, themePage } from "./home"
import { orariPage } from "./orari"
import { prenotazioniPage } from "./prenotazioni"
import { LingueVariant } from "./lingue"
import { Accesso } from "./accesso"
import { shellHome } from "./home"
import { piattiPage } from "./piatti"
const n = Number((window as any).__L__ || new URLSearchParams(location.search).get("l") || 1)
const f = Number((window as any).__F__ || 0)
const h = Number((window as any).__H__ || 0)
const a = Number((window as any).__A__ || 0)
createRoot(document.getElementById("root")!).render((window as any).__Z__ ? (()=>{const n=Number((window as any).__Z__);const names=["login","login-errore","login-reset-ok","forgot","forgot-inviata","reset","reset-fallito","reset-senza-token","verify-ok","verify-fallita"];return n<=10?<Accesso name={names[n-1] as any} />:shellHome(["senza-righe","con-righe","vuota","segnaposto-piatti"][n-11] as any)})() : (window as any).__X__ ? <Accesso name={(window as any).__X__} /> : (window as any).__H2__ ? shellHome((window as any).__H2__) : (window as any).__D__ ? piattiPage : (window as any).__G__ ? <LingueVariant n={Number((window as any).__G__)} /> : (window as any).__P__ ? prenotazioniPage : (window as any).__O__ ? orariPage : (window as any).__T__ ? themePage : a ? adminLinkPages[a] : h ? homePages[h] : f ? filterPages[f] : layouts[n].node)
