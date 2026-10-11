import sys, io, os
sys.path.insert(0,'/home/claude/mock')
from it_browser import *
from PIL import Image, ImageChops
OUT='/mnt/user-data/outputs/docs/design'; PK=f'{OUT}/schermate/piatti'
PROTO='file:///home/claude/mock/dist/piatti.html'; STATIC=f'file://{PK}/mockup.html'; HIDE="[data-demo]{display:none!important}"
def save(png,name): Image.open(io.BytesIO(png)).convert('RGB').save(f'{PK}/{name}',optimize=True)
def pct(A,B):
    if A.size!=B.size: return ('dimensioni diverse',A.size,B.size)
    d=ImageChops.difference(A,B).convert('L').point(lambda v:255 if v>24 else 0); return round(100*d.histogram()[255]/(A.size[0]*A.size[1]),3)
with sync_playwright() as p:
    b=launch(p); errs=[]
    for sch in ('light','dark'):
        S=[]
        for url in (PROTO,STATIC):
            c=b.new_context(viewport={'width':1280,'height':900},locale='it-IT',color_scheme=sch); pg=c.new_page(); pg.goto(url); pg.add_style_tag(content=HIDE); pg.wait_for_timeout(1200)
            if sch=='dark' and url==STATIC: pg.evaluate("document.documentElement.classList.add('dark')"); pg.wait_for_timeout(300)
            S.append(Image.open(io.BytesIO(pg.screenshot(full_page=True))).convert('RGB')); c.close()
        print('fedeltà piatti',sch,'-> %',pct(*S))
    c=b.new_context(viewport={'width':1280,'height':900}); pg=c.new_page(); pg.goto(STATIC)
    print('annotazioni piatti:',pg.evaluate("({slot:document.querySelectorAll('[data-slot]').length,senza:[...document.querySelectorAll('[data-slot]')].filter(e=>!e.hasAttribute('data-component')).length,demo:document.querySelectorAll('[data-demo]').length,script:document.scripts.length,blocchi:[...new Set([...document.querySelectorAll('[data-block]')].map(e=>e.dataset.block))]})")); c.close()
    def page(w=390,h=844,touch=True,scheme='light'):
        kw=dict(viewport={'width':w,'height':h},locale='it-IT',color_scheme=scheme)
        if touch: kw.update(is_mobile=True,has_touch=True)
        c=b.new_context(**kw); pg=c.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); pg.goto(PROTO); pg.add_style_tag(content=HIDE); pg.wait_for_timeout(900); return c,pg
    def demo(pg,v): pg.evaluate(f"""(()=>{{const s=document.querySelector('select[aria-label="Stato demo"]');s.value='{v}';s.dispatchEvent(new Event('change',{{bubbles:true}}))}})()"""); pg.wait_for_timeout(500)
    def edit(pg): pg.locator('button[aria-label^="Nem di carne"]').click(); pg.wait_for_timeout(800)
    def scroll_sheet(pg,y): pg.evaluate(f"document.querySelector('[data-slot=sheet-content]').scrollTo(0,{y})"); pg.wait_for_timeout(300)
    for tag,w,h,t in [('390',390,844,True),('1280',1280,900,False)]:
        for sch,it in [('light','chiaro'),('dark','scuro')]:
            c,pg=page(w,h,t,sch); save(pg.screenshot(full_page=True),f'{tag}-{it}.png'); c.close()
    steps={}
    steps['390-filtri-chiaro.png']=lambda pg:pg.get_by_role('button',name='Filtri').click()
    def filtri_attivi(pg):
        pg.get_by_role('button',name='Filtri').click(); pg.wait_for_timeout(500); pg.locator('#f-stato').click(); pg.wait_for_timeout(300); pg.get_by_role('option',name='Disabilitati').click(); pg.wait_for_timeout(300); pg.get_by_role('button',name='Applica').click()
    steps['390-filtri-attivi-chiaro.png']=filtri_attivi
    steps['390-modulo-chiaro.png']=edit
    steps['390-modulo-allergeni-chiaro.png']=lambda pg:(edit(pg),scroll_sheet(pg,320))
    steps['390-modulo-fondo-chiaro.png']=lambda pg:(edit(pg),scroll_sheet(pg,3000))
    steps['390-modulo-inglese-aperto-chiaro.png']=lambda pg:(edit(pg),pg.get_by_role('button',name='Traduzione inglese').click(),pg.wait_for_timeout(300),scroll_sheet(pg,120))
    steps['390-nuovo-chiaro.png']=lambda pg:pg.get_by_role('button',name='Nuovo piatto').click()
    steps['390-nuovo-errori-chiaro.png']=lambda pg:(pg.get_by_role('button',name='Nuovo piatto').click(),pg.wait_for_timeout(500),pg.get_by_role('button',name='Salva',exact=True).click())
    steps['390-terminato-chiaro.png']=lambda pg:(pg.locator('[role=switch][aria-label="Terminato: Nem di carne"]:visible').click(),pg.wait_for_timeout(700))
    steps['390-menu-azioni-chiaro.png']=lambda pg:pg.locator('button[aria-label="Azioni per Nem di carne"]:visible').click()
    steps['390-ricompila-chiaro.png']=lambda pg:pg.get_by_role('button',name='Ricompila il menù pubblico').click()
    steps['390-ricompila-avviata-chiaro.png']=lambda pg:(pg.get_by_role('button',name='Ricompila il menù pubblico').click(),pg.wait_for_timeout(500),pg.get_by_role('alertdialog').get_by_role('button',name='Ricompila').click(),pg.wait_for_timeout(1400))
    steps['390-ricompilazione-in-corso-chiaro.png']=lambda pg:(demo(pg,'ricompilazione-in-corso'),pg.get_by_role('button',name='Ricompila il menù pubblico').click(),pg.wait_for_timeout(500),pg.get_by_role('alertdialog').get_by_role('button',name='Ricompila').click(),pg.wait_for_timeout(1400))
    steps['390-piu-di-100-piatti-chiaro.png']=lambda pg:demo(pg,'molti-piatti')
    steps['390-caricamento-chiaro.png']=lambda pg:demo(pg,'caricamento')
    steps['390-errore-caricamento-chiaro.png']=lambda pg:demo(pg,'errore-caricamento')
    steps['390-vuoto-chiaro.png']=lambda pg:demo(pg,'vuoto')
    steps['390-nessun-risultato-chiaro.png']=lambda pg:pg.fill('input[aria-label=Cerca]','zzz')
    def errore_azione(pg):
        demo(pg,'errore-azione'); edit(pg); pg.get_by_role('button',name='Salva',exact=True).click(); pg.wait_for_timeout(1300)
    steps['390-errore-azione-chiaro.png']=errore_azione
    for name,fn in steps.items():
        c,pg=page(); fn(pg); pg.wait_for_timeout(600)
        if name in('390-terminato-chiaro.png','390-ricompila-avviata-chiaro.png','390-ricompilazione-in-corso-chiaro.png'): pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(300)
        save(pg.screenshot(),name); c.close()
    c,pg=page(1280,900,False); pg.get_by_role('button',name='Nem di carne').first.click(); pg.wait_for_timeout(800); save(pg.screenshot(),'1280-modulo-chiaro.png'); c.close()
    c,pg=page(1280,900,False); pg.locator('button[aria-label="Azioni per Nem di carne"]:visible').click(); pg.wait_for_timeout(500); save(pg.screenshot(),'1280-menu-azioni-chiaro.png'); c.close()
    print('errori pagina:',errs); b.close()
print(len([f for f in os.listdir(PK) if f.endswith('.png')]),'PNG')
