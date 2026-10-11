import json,sys
CSS='''
:root{--bg:#fafafa;--fg:#171717;--mut:#737373;--bd:#e5e5e5;--card:#fff;--pri:#171717;--prf:#fafafa;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0a0a0a;--fg:#fafafa;--mut:#a3a3a3;--bd:#262626;--card:#171717;--pri:#fafafa;--prf:#171717}}
:root[data-theme="dark"]{--bg:#0a0a0a;--fg:#fafafa;--mut:#a3a3a3;--bd:#262626;--card:#171717;--pri:#fafafa;--prf:#171717}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.45 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
header{padding:14px 16px 0;max-width:1320px;margin:0 auto}h1{font-size:16px;margin:0 0 2px}p.s{margin:0;color:var(--mut);font-size:13px}
.bar{display:flex;flex-wrap:wrap;gap:8px;padding:12px 16px;max-width:1320px;margin:0 auto;align-items:center}
.seg{display:flex;gap:4px;flex-wrap:wrap}
button{font:inherit;color:var(--fg);background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px 12px;min-height:44px;min-width:44px;cursor:pointer}
button[aria-pressed=true]{background:var(--pri);color:var(--prf);border-color:var(--pri)}
.sp{flex:1}
.cap{max-width:1320px;margin:0 auto;padding:0 16px 12px}.cap b{display:block}.cap span{color:var(--mut);display:block}
.stage{max-width:1320px;margin:0 auto;padding:0 16px 24px;overflow:hidden}
.frame{border:1px solid var(--bd);border-radius:12px;overflow:hidden;background:#fff;transform-origin:top left}
iframe{display:block;border:0;width:100%;height:100%}
.note{max-width:1320px;margin:0 auto;padding:0 16px 24px;color:var(--mut);font-size:12px}
'''
JS='''
var TPL=__TPL__;var INFO=__INFO__;var DEVS=__DEVS__;var cur=1,dev=DEVS.length===1?DEVS[0]:(window.innerWidth<700?'p':'n');
var lay=document.getElementById('lay'),cap=document.getElementById('cap'),fr=document.getElementById('fr'),frame=document.getElementById('frame'),stage=document.getElementById('stage'),dv=document.getElementById('dev');
INFO.forEach(function(i){var b=document.createElement('button');b.textContent=i[0];b.title=i[1];b.setAttribute('data-l',i[0]);lay.appendChild(b)});
if(DEVS.length>1){[['p','Telefono 390'],['n','Notebook 1280']].forEach(function(d){var b=document.createElement('button');b.textContent=d[1];b.setAttribute('data-d',d[0]);dv.appendChild(b)})}
function fit(){var W=stage.clientWidth-32;var w=dev==='p'?390:1280,h=dev==='p'?844:800;var sc=Math.min(1,W/w);frame.style.width=w+'px';frame.style.height=h+'px';frame.style.transform='scale('+sc+')';stage.style.height=(h*sc+24)+'px';frame.style.marginLeft=(dev==='p'?Math.max(0,(W-w*sc)/2):0)+'px'}
function render(){var i=INFO[cur-1];cap.innerHTML='<b>'+i[0]+'. '+i[1]+'</b><span>'+i[2]+'</span><span>'+i[3]+'</span>';
[].forEach.call(lay.children,function(b){b.setAttribute('aria-pressed',String(Number(b.getAttribute('data-l'))===cur))});
[].forEach.call(dv.children,function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-d')===dev))});
fit();fr.srcdoc=TPL.replace('/*L*/0',String(cur))}
lay.addEventListener('click',function(e){var l=e.target.getAttribute&&e.target.getAttribute('data-l');if(l){cur=Number(l);render()}});
dv.addEventListener('click',function(e){var d=e.target.getAttribute&&e.target.getAttribute('data-d');if(d){dev=d;render()}});
window.addEventListener('resize',fit);render();
'''
def gallery(out,title,sub,tplhtml,marker,info,devs,note):
    tpl=tplhtml.replace(marker,marker.rsplit('=',1)[0]+'=/*L*/0')
    s=json.dumps(tpl).replace('</','<\\/')
    inf=json.dumps(info,ensure_ascii=False).replace('</','<\\/')
    js=JS.replace('__TPL__',s).replace('__INFO__',inf).replace('__DEVS__',json.dumps(devs))
    html=f'''<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>{title}</title><style>{CSS}</style></head><body>
<header><h1>{title}</h1><p class="s">{sub}</p></header>
<div class="bar"><div class="seg" id="lay" role="group" aria-label="Variante"></div><span class="sp"></span><div class="seg" id="dev" role="group" aria-label="Dispositivo"></div></div>
<div class="cap" id="cap"></div>
<div class="stage" id="stage"><div class="frame" id="frame"><iframe id="fr" title="Anteprima"></iframe></div></div>
<div class="note">{note}</div>
<script>{js}</script></body></html>'''
    open(out,'w').write(html); print(out, round(len(html)/1e6,2),'MB')

L=[
 (1,"Classica, sottoaree nel menu","Barra laterale standard. Sotto «Prenotazioni» si aprono Elenco, Eccezioni giorno, Impostazioni.","Tutto in un unico posto. Su telefono: menu, sezione, sottoarea (3 tocchi)."),
 (2,"Classica, 3 voci + schede","Il menu ha solo le tre sezioni; le sottoaree sono schede in cima alla pagina.","Cambio sottoarea con 1 tocco. Il Menù ha 5 sottoaree: su telefono le schede scorrono di lato."),
 (3,"Inset, sottoaree nel menu","Come il 1, ma il contenuto sta in un riquadro arrotondato sullo sfondo della barra.","Solo estetica, e solo da 768 px in su: su telefono è identico al 1."),
 (4,"Compatta a icone + schede","Su notebook la barra è ridotta alle icone (apribile). Sottoarea nelle schede.","Massimo spazio alle tabelle. Icone senza etichetta: meno chiare per chi usa l'app di rado. Su telefono è identico al 2."),
 (5,"Gruppi con tutto visibile","Tre gruppi con etichetta; tutte le 9 destinazioni sempre visibili, nessuna apertura.","2 tocchi da qualsiasi punto e regge 5 sottoaree. Lista più lunga."),
]
gallery('/mnt/user-data/outputs/layout-navigazione-5-alternative.html','Area App: 5 layout di navigazione (strada B, Sidebar shadcn)','Componenti reali di shadcn <code>base-nova</code> con i token di <code>app-ui.css</code>. Dati di esempio. Prova il menu, i filtri e le schede.',open('dist/l1.html').read(),'window.__L__=1',L,['p','n'],'Su telefono il menu si apre dal pulsante in alto a sinistra. Il passaggio tra telefono e schermo largo è a 768 px (fisso nella Sidebar di shadcn).')
F=[
 (1,"Due colonne","Ricerca sopra, i due filtri affiancati sotto. Nessun componente nuovo. L'elenco parte a 300 px dall'alto.","Tutti i filtri sempre visibili, ma restano due righe. Con più di due filtri non regge."),
 (2,"Foglio dal basso","Una riga: ricerca + «Filtri» con il numero dei filtri attivi. I filtri si impostano in un foglio dal basso con Applica e Azzera. L'elenco parte a 248 px.","Regge qualunque numero di filtri, stesso schema in tutte le liste. Contro: 2 tocchi per cambiare un filtro e da chiuso si vede solo il numero (rimedio: etichette rimovibili sotto la riga)."),
 (3,"Servizio a pulsanti","Il filtro principale (Tutti, Pranzo, Cena) è a pulsanti, a 1 tocco; sotto ricerca e stato. L'elenco parte a 300 px.","Ottimo se pranzo/cena è il filtro più usato (da confermare). Non scala se i filtri crescono."),
 (4,"A scomparsa","Una riga: ricerca + pulsante filtri che apre i due filtri nella pagina, senza finestre. L'elenco parte a 248 px da chiuso.","Niente finestre, ma da chiuso i filtri attivi non si vedono e l'elenco si sposta quando si apre."),
]
gallery('/mnt/user-data/outputs/filtri-telefono-4-alternative.html','Filtri dell\'elenco su telefono: 4 alternative','Stessa schermata (elenco prenotazioni) nel layout 5. Da 768 px in su tutte le varianti diventano la stessa riga unica di filtri.',open('dist/f1.html').read(),'window.__F__=1',F,['p'],'Controlli a 44 px nel mockup. Nel progetto l\'altezza va impostata dentro components/ui, non nelle schermate (rilievo P già segnalato). Manca il filtro per data, da definire con la specifica della schermata.')
