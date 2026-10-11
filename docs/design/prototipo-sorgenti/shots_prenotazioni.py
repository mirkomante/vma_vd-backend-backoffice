import sys, io, os
sys.path.insert(0,'/home/claude/mock')
from it_browser import *
from PIL import Image, ImageChops
OUT='/mnt/user-data/outputs/docs/design'; PK=f'{OUT}/schermate/prenotazioni'; PO=f'{OUT}/schermate/orari'
PROTO='file:///home/claude/mock/dist/prenotazioni.html'; HIDE="[data-demo]{display:none!important}"
def save(png,name): Image.open(io.BytesIO(png)).convert('RGB').save(f'{PK}/{name}',optimize=True)
def pct(A,B):
    if A.size!=B.size: return ('dimensioni diverse',A.size,B.size)
    d=ImageChops.difference(A,B).convert('L').point(lambda v:255 if v>24 else 0); h=d.histogram(); return round(100*h[255]/(A.size[0]*A.size[1]),3)
with sync_playwright() as p:
    b=launch(p); errs=[]
    # fedeltà statico vs prototipo, entrambe le schermate
    for name,proto,static in [('prenotazioni',PROTO,f'file://{PK}/mockup.html'),('orari','file:///home/claude/mock/dist/orari.html',f'file://{PO}/mockup.html')]:
        for sch in ('light','dark'):
            S=[]
            for url in (proto,static):
                c=b.new_context(viewport={'width':1280,'height':900},locale='it-IT',color_scheme=sch); pg=c.new_page(); pg.goto(url); pg.add_style_tag(content=HIDE); pg.wait_for_timeout(900)
                if sch=='dark' and url==static: pg.evaluate("document.documentElement.classList.add('dark')"); pg.wait_for_timeout(200)
                S.append(Image.open(io.BytesIO(pg.screenshot(full_page=True))).convert('RGB')); c.close()
            print('fedeltà',name,sch,'-> %',pct(*S))
    c=b.new_context(viewport={'width':1280,'height':900}); pg=c.new_page(); pg.goto(f'file://{PK}/mockup.html')
    print('annotazioni prenotazioni:',pg.evaluate("({slot:document.querySelectorAll('[data-slot]').length,senza:[...document.querySelectorAll('[data-slot]')].filter(e=>!e.hasAttribute('data-component')).length,demo:document.querySelectorAll('[data-demo]').length,script:document.scripts.length,blocchi:[...new Set([...document.querySelectorAll('[data-block]')].map(e=>e.dataset.block))]})")); c.close()
    # screenshot di riferimento
    def ctx(w,h,touch,scheme='light'):
        kw=dict(viewport={'width':w,'height':h},locale='it-IT',color_scheme=scheme)
        if touch: kw.update(is_mobile=True,has_touch=True)
        return b.new_context(**kw)
    def page(w=390,h=844,touch=True,scheme='light'):
        c=ctx(w,h,touch,scheme); pg=c.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); pg.goto(PROTO); pg.add_style_tag(content=HIDE); pg.wait_for_timeout(800); return c,pg
    def demo(pg,v): pg.evaluate(f"""(()=>{{const s=document.querySelector('select[aria-label="Stato demo"]');s.value='{v}';s.dispatchEvent(new Event('change',{{bubbles:true}}))}})()"""); pg.wait_for_timeout(500)
    def rd(pg,prefix): pg.locator(f'button[aria-label^="{prefix}"]').first.click(); pg.wait_for_timeout(500)
    for tag,w,h,t in [('390',390,844,True),('1280',1280,900,False)]:
        for sch,it in [('light','chiaro'),('dark','scuro')]:
            c,pg=page(w,h,t,sch); save(pg.screenshot(full_page=True),f'{tag}-{it}.png'); c.close()
    steps={}
    steps['390-da-confermare-chiaro.png']=lambda pg:pg.get_by_role('tab',name='Da confermare').click()
    steps['390-dettaglio-confermata-passata-chiaro.png']=lambda pg:rd(pg,'Rossi Marta')
    steps['390-dettaglio-in-attesa-chiaro.png']=lambda pg:rd(pg,'Esposito Giulia')
    steps['390-dettaglio-cancellata-chiaro.png']=lambda pg:rd(pg,'Greco Paolo')
    steps['390-filtri-chiaro.png']=lambda pg:pg.get_by_role('button',name='Filtri').click()
    def filtri_attivi(pg):
        pg.get_by_role('button',name='Filtri').click(); pg.wait_for_timeout(500); pg.locator('#f-stato').click(); pg.wait_for_timeout(300); pg.get_by_role('option',name='In attesa di conferma').click(); pg.wait_for_timeout(300); pg.get_by_role('button',name='Applica').click()
    steps['390-filtri-attivi-chiaro.png']=filtri_attivi
    steps['390-nuova-chiaro.png']=lambda pg:pg.get_by_role('button',name='Nuova prenotazione').first.click()
    steps['390-nuova-errori-chiaro.png']=lambda pg:(pg.get_by_role('button',name='Nuova prenotazione').first.click(),pg.wait_for_timeout(500),pg.get_by_role('button',name='Salva',exact=True).click())
    steps['390-conferma-cancella-chiaro.png']=lambda pg:(rd(pg,'Ferrari Anna'),pg.get_by_role('button',name='Cancella prenotazione').click())
    steps['390-conferma-rifiuta-chiaro.png']=lambda pg:(rd(pg,'Esposito Giulia'),pg.get_by_role('button',name='Rifiuta',exact=True).click())
    steps['390-conferma-noshow-chiaro.png']=lambda pg:(rd(pg,'Rossi Marta'),pg.get_by_role('button',name='Segna no-show').click())
    steps['390-conferma-anonimizza-chiaro.png']=lambda pg:(rd(pg,'Greco Paolo'),pg.get_by_role('button',name='Anonimizza ora').click())
    steps['390-avviso-chiaro.png']=lambda pg:(pg.get_by_role('tab',name='Da confermare').click(),pg.wait_for_timeout(300),pg.locator('[data-block=scheda-da-confermare]').first.get_by_role('button',name='Conferma').click(),pg.wait_for_timeout(1300),pg.evaluate("window.scrollTo(0,0)"))
    steps['390-caricamento-chiaro.png']=lambda pg:demo(pg,'caricamento')
    steps['390-errore-caricamento-chiaro.png']=lambda pg:demo(pg,'errore-caricamento')
    steps['390-giorno-vuoto-chiaro.png']=lambda pg:demo(pg,'giorno-vuoto')
    steps['390-anonimizzate-chiaro.png']=lambda pg:demo(pg,'anonimizzate')
    steps['390-nessun-risultato-chiaro.png']=lambda pg:pg.fill('input[aria-label=Cerca]','zzz')
    def errore_azione(pg):
        demo(pg,'errore-azione'); rd(pg,'Ferrari Anna'); pg.get_by_role('button',name='Cancella prenotazione').click(); pg.wait_for_timeout(400); pg.get_by_role('alertdialog').get_by_role('button',name='Cancella prenotazione').click(); pg.wait_for_timeout(1300)
    steps['390-errore-azione-chiaro.png']=errore_azione
    for name,fn in steps.items():
        c,pg=page(); fn(pg); pg.wait_for_timeout(700); save(pg.screenshot(),name); c.close()
    c,pg=page(1280,900,False); pg.get_by_label('Azioni per Esposito Giulia').click(); pg.wait_for_timeout(500); save(pg.screenshot(),'1280-menu-azioni-chiaro.png'); c.close()
    c,pg=page(1280,900,False); rd(pg,'Rossi Marta') if False else pg.get_by_role('button',name='Rossi Marta').first.click(); pg.wait_for_timeout(600); save(pg.screenshot(),'1280-dettaglio-chiaro.png'); c.close()
    print('errori pagina:',errs); b.close()
print(len([f for f in os.listdir(PK) if f.endswith('.png')]),'PNG')
