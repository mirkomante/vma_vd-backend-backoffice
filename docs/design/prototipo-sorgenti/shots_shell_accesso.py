import sys, io, os
sys.path.insert(0,'/home/claude/mock')
from it_browser import *
from PIL import Image, ImageChops
OUT='/mnt/user-data/outputs/docs/design/schermate'; DIST='file:///home/claude/mock/dist'
def save(pkg,png,name): Image.open(io.BytesIO(png)).convert('RGB').save(f'{OUT}/{pkg}/{name}',optimize=True)
def pct(A,B):
    if A.size!=B.size: return ('dimensioni diverse',A.size,B.size)
    d=ImageChops.difference(A,B).convert('L').point(lambda v:255 if v>24 else 0); return round(100*d.histogram()[255]/(A.size[0]*A.size[1]),3)
with sync_playwright() as p:
    b=launch(p); errs=[]
    # fedeltà statico/prototipo a 1280
    for pkg,page,file in [('shell','home-senza-righe','mockup.html'),('accesso','acc-login','mockup-login.html'),('accesso','acc-forgot','mockup-forgot.html'),('accesso','acc-reset','mockup-reset.html'),('accesso','acc-verify-ok','mockup-verify.html')]:
        for sch in ('light','dark'):
            S=[]
            for url in (f'{DIST}/{page}.html',f'file://{OUT}/{pkg}/{file}'):
                c=b.new_context(viewport={'width':1280,'height':900},locale='it-IT',color_scheme=sch); pg=c.new_page(); pg.goto(url); pg.wait_for_timeout(1000)
                if sch=='dark' and url.startswith('file://'+OUT): pg.evaluate("document.documentElement.classList.add('dark')"); pg.wait_for_timeout(300)
                S.append(Image.open(io.BytesIO(pg.screenshot(full_page=True))).convert('RGB')); c.close()
            print('fedeltà',pkg,page,sch,'-> %',pct(*S))
    c=b.new_context(viewport={'width':1280,'height':900}); pg=c.new_page()
    for pkg,file in [('shell','mockup.html'),('accesso','mockup-login.html')]:
        pg.goto(f'file://{OUT}/{pkg}/{file}')
        print('annotazioni',pkg,file,pg.evaluate("({slot:document.querySelectorAll('[data-slot]').length,senza:[...document.querySelectorAll('[data-slot]')].filter(e=>!e.hasAttribute('data-component')).length,demo:document.querySelectorAll('[data-demo]').length,script:document.scripts.length,blocchi:[...new Set([...document.querySelectorAll('[data-block]')].map(e=>e.dataset.block))]})"))
    c.close()
    def page(url,w=390,h=844,touch=True,scheme='light'):
        kw=dict(viewport={'width':w,'height':h},locale='it-IT',color_scheme=scheme)
        if touch: kw.update(is_mobile=True,has_touch=True)
        c=b.new_context(**kw); pg=c.new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); pg.goto(url); pg.wait_for_timeout(900); return c,pg
    # --- accesso ---
    for tag,w,h,t in [('390',390,844,True),('1280',1280,900,False)]:
        for sch,it in [('light','chiaro'),('dark','scuro')]:
            c,pg=page(f'{DIST}/acc-login.html',w,h,t,sch); save('accesso',pg.screenshot(full_page=True),f'{tag}-{it}.png'); c.close()
    for n in ['login-errore','login-reset-ok','forgot','forgot-inviata','reset','reset-fallito','reset-senza-token','verify-ok','verify-fallita']:
        c,pg=page(f'{DIST}/acc-{n}.html'); save('accesso',pg.screenshot(full_page=True),f'390-{n}-chiaro.png'); c.close()
    c,pg=page(f'{DIST}/acc-login-errore.html',1280,900,False); save('accesso',pg.screenshot(full_page=True),'1280-login-errore-chiaro.png'); c.close()
    # --- shell ---
    H=lambda v:f'{DIST}/home-{v}.html'
    for tag,w,h,t in [('390',390,844,True),('1280',1280,900,False)]:
        for sch,it in [('light','chiaro'),('dark','scuro')]:
            c,pg=page(H('senza-righe'),w,h,t,sch); save('shell',pg.screenshot(full_page=True),f'{tag}-{it}.png'); c.close()
    c,pg=page(H('con-righe')); save('shell',pg.screenshot(full_page=True),'390-con-righe-di-stato-chiaro.png'); c.close()
    c,pg=page(H('con-righe'),1280,900,False); save('shell',pg.screenshot(full_page=True),'1280-con-righe-di-stato-chiaro.png'); c.close()
    c,pg=page(H('segnaposto-piatti')); save('shell',pg.screenshot(full_page=True),'390-segnaposto-chiaro.png'); c.close()
    c,pg=page(H('segnaposto-prenotazioni'),1280,900,False); save('shell',pg.screenshot(full_page=True),'1280-segnaposto-chiaro.png'); c.close()
    c,pg=page(H('vuota')); save('shell',pg.screenshot(full_page=True),'390-vuota-chiaro.png'); c.close()
    c,pg=page(H('vuota'),1280,900,False); save('shell',pg.screenshot(full_page=True),'1280-vuota-chiaro.png'); c.close()
    c,pg=page(H('senza-righe')); pg.locator('[data-slot=sidebar-trigger]').click(); pg.wait_for_timeout(800); save('shell',pg.screenshot(),'390-menu-aperto-chiaro.png')
    pg.get_by_text('marco.rossi@esempio.it').click(); pg.wait_for_timeout(600); save('shell',pg.screenshot(),'390-menu-utente-chiaro.png'); c.close()
    c,pg=page(H('senza-righe'),1280,900,False); pg.get_by_text('marco.rossi@esempio.it').click(); pg.wait_for_timeout(600); save('shell',pg.screenshot(),'1280-menu-utente-chiaro.png')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(300); pg.locator('[data-slot=sidebar-trigger]').click(); pg.wait_for_timeout(600); save('shell',pg.screenshot(),'1280-menu-chiuso-chiaro.png'); c.close()
    c,pg=page(H('senza-righe'),1280,900,False,'dark'); pg.get_by_text('marco.rossi@esempio.it').click(); pg.wait_for_timeout(600); save('shell',pg.screenshot(),'1280-menu-utente-scuro.png'); c.close()
    print('errori pagina:',errs); b.close()
for pkg in ('shell','accesso'):
    print(pkg,len([f for f in os.listdir(f'{OUT}/{pkg}') if f.endswith('.png')]),'PNG')
