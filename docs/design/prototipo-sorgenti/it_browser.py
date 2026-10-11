from playwright.sync_api import sync_playwright
IT_ENV={'LANG':'it_IT.UTF-8','LC_ALL':'it_IT.UTF-8','LANGUAGE':'it'}
def launch(p): return p.chromium.launch(args=['--lang=it-IT','--accept-lang=it-IT'],env=IT_ENV)
PHONE=dict(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,locale='it-IT')
