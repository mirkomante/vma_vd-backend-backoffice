import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

const ROOT = join(import.meta.dirname, '../../..')
const DAEMON_PORT = Number(process.env.UI_VERIFY_MENU_PAYLOAD_PORT ?? '31997')
const PID_PATH = join(ROOT, '.next/ui-verify-daemon.pid')

const USE_LEGACY_PAYLOAD = process.env.UI_VERIFY_MENU_PAYLOAD_LEGACY === '1'

let daemonChild = null
let daemonBootStderr = ''
let daemonBootStdout = ''

const DAEMON_READY_MS = Number(process.env.UI_VERIFY_MENU_PAYLOAD_READY_MS ?? '20000')

function sleepMs(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function parseStdout(stdout) {
  const lines = stdout.trim().split('\n')
  const line = [...lines].reverse().find((l) => l.startsWith('{') || l.startsWith('['))
  if (!line) throw new Error(`Output JSON mancante: ${stdout.slice(0, 160)}`)
  return JSON.parse(line)
}

function isDaemonPortOpen() {
  const probe = spawnSync(
    'node',
    [
      '-e',
      `require('node:net').connect(${DAEMON_PORT},'127.0.0.1',()=>process.exit(0)).on('error',()=>process.exit(1))`,
    ],
    { stdio: 'ignore' },
  )
  return probe.status === 0
}

function listenPids(port) {
  try {
    const out = spawnSync('lsof', ['-ti', `tcp:${port}`, '-sTCP:LISTEN'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).stdout.trim()
    if (!out) return []
    return [...new Set(out.split('\n').map((s) => Number(s.trim())).filter((n) => n > 0))]
  } catch {
    return []
  }
}

function processCommand(pid) {
  try {
    return spawnSync('ps', ['-p', String(pid), '-o', 'command='], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).stdout
  } catch {
    return ''
  }
}

export function isOrphanMenuPayloadDaemonPid(pid) {
  const cmd = processCommand(pid)
  return cmd.includes('menu-payload') && cmd.includes('__daemon__')
}

function killPidForce(pid) {
  try {
    process.kill(pid, 'SIGKILL')
  } catch {
    /* ignore */
  }
}

function killDaemonPortListeners() {
  for (const pid of listenPids(DAEMON_PORT)) {
    killPidForce(pid)
  }
}

function writeDaemonPid(pid) {
  writeFileSync(PID_PATH, `${pid}\n`, 'utf8')
}

function clearDaemonPidFile() {
  try {
    if (existsSync(PID_PATH)) unlinkSync(PID_PATH)
  } catch {
    /* ignore */
  }
}

/** Uccide daemon orfani sulla porta fixture prima di un nuovo giro. */
export function killOrphanMenuPayloadDaemons() {
  if (!isDaemonPortOpen()) return
  for (const pid of listenPids(DAEMON_PORT)) {
    if (isOrphanMenuPayloadDaemonPid(pid)) {
      try {
        process.kill(pid, 'SIGTERM')
      } catch {
        /* ignore */
      }
    }
  }
  if (isDaemonPortOpen()) killDaemonPortListeners()
  clearDaemonPidFile()
}

function spawnMenuPayloadDaemon() {
  if (isDaemonPortOpen()) return
  if (daemonChild && daemonChild.exitCode == null && !daemonChild.killed) return
  daemonBootStderr = ''
  daemonBootStdout = ''
  daemonChild = spawn(
    'pnpm',
    ['payload', 'run', 'scripts/ui-verify/menu-payload.ts', '--', '__daemon__'],
    {
      cwd: ROOT,
      env: { ...process.env, UI_VERIFY_MENU_PAYLOAD_PORT: String(DAEMON_PORT) },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )
  daemonChild.stdout?.on('data', (chunk) => {
    daemonBootStdout += chunk.toString()
  })
  daemonChild.stderr?.on('data', (chunk) => {
    daemonBootStderr += chunk.toString()
  })
  if (daemonChild.pid) writeDaemonPid(daemonChild.pid)
  process.stderr.write(
    `[ui:verify] menu-payload: spawn __daemon__ pid=${daemonChild.pid} porta=${DAEMON_PORT} (non singola azione payload)\n`,
  )
}

/** Attesa asincrona (non blocca timer/Playwright). Errore esplicito dopo `ms` ms. */
export async function waitMenuPayloadDaemonReady(ms = DAEMON_READY_MS) {
  killOrphanMenuPayloadDaemons()
  spawnMenuPayloadDaemon()
  if (isDaemonPortOpen()) return
  const start = Date.now()
  let lastLog = 0
  while (Date.now() - start < ms) {
    if (isDaemonPortOpen()) {
      process.stderr.write(`[ui:verify] menu-payload daemon in ascolto su :${DAEMON_PORT} (${Date.now() - start}ms)\n`)
      return
    }
    if (daemonChild?.exitCode != null) {
      const cmd = daemonChild.pid ? processCommand(daemonChild.pid) : ''
      throw new Error(
        `menu-payload daemon exit ${daemonChild.exitCode} prima di :${DAEMON_PORT}; cmd=${cmd.trim().slice(0, 140)}; stderr=${daemonBootStderr.slice(0, 350)}`,
      )
    }
    const elapsed = Date.now() - start
    if (elapsed - lastLog >= 3000) {
      const cmd = daemonChild?.pid ? processCommand(daemonChild.pid) : ''
      const pgrep = spawnSync('pgrep', ['-fl', 'payload'], { encoding: 'utf8' })
      const payloadLines = (pgrep.stdout || '')
        .split('\n')
        .filter((l) => l.includes('menu-payload') || l.includes('payload run'))
        .slice(0, 4)
        .join(' | ')
      process.stderr.write(
        `[ui:verify] menu-payload: attesa :${DAEMON_PORT} ${Math.round(elapsed / 1000)}s — figlio pid=${daemonChild?.pid} __daemon__=${cmd.includes('__daemon__')}; payload: ${payloadLines || '(nessun pgrep)'}\n`,
      )
      lastLog = elapsed
    }
    await sleepMs(250)
  }
  const listen = listenPids(DAEMON_PORT)
  throw new Error(
    `menu-payload daemon: porta ${DAEMON_PORT} non in ascolto dopo ${ms}ms (pid=${daemonChild?.pid}; listen=${listen.join(',') || '—'}; stderr=${daemonBootStderr.slice(0, 350)}; stdout=${daemonBootStdout.slice(0, 200)})`,
  )
}

function requestDaemonShutdown() {
  const r = spawnSync(
    'node',
    ['scripts/ui-verify/menu-payload-client.mjs', '--', '__shutdown__'],
    {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, UI_VERIFY_MENU_PAYLOAD_PORT: String(DAEMON_PORT) },
      timeout: 8000,
    },
  )
  return r.status === 0
}

function stopMenuPayloadDaemon() {
  if (daemonChild) {
    try {
      daemonChild.kill('SIGTERM')
    } catch {
      /* ignore */
    }
    daemonChild = null
  }
  const pidFromFile = existsSync(PID_PATH) ? Number(readFileSync(PID_PATH, 'utf8').trim()) : null
  if (pidFromFile && pidFromFile > 0) {
    try {
      process.kill(pidFromFile, 'SIGKILL')
    } catch {
      /* ignore */
    }
  }
  killDaemonPortListeners()
  clearDaemonPidFile()
}

export async function stopMenuPayloadSession() {
  if (isDaemonPortOpen()) {
    try {
      requestDaemonShutdown()
    } catch {
      /* ignore */
    }
    const deadline = Date.now() + 5000
    while (Date.now() < deadline && isDaemonPortOpen()) {
      await sleepMs(150)
    }
  }
  stopMenuPayloadDaemon()
}

export async function menuPayloadRun(action, extraArgs = []) {
  if (USE_LEGACY_PAYLOAD) {
    const r = spawnSync(
      'pnpm',
      ['payload', 'run', 'scripts/ui-verify/menu-payload.ts', '--', action, ...extraArgs],
      { cwd: ROOT, encoding: 'utf8', env: { ...process.env } },
    )
    if (r.status !== 0) {
      throw new Error(`menu payload ${action}: ${(r.stderr || r.stdout).slice(0, 400)}`)
    }
    return parseStdout(r.stdout)
  }
  function callClient() {
    return spawnSync(
      'node',
      ['scripts/ui-verify/menu-payload-client.mjs', '--', action, ...extraArgs],
      {
        cwd: ROOT,
        encoding: 'utf8',
        env: { ...process.env, UI_VERIFY_MENU_PAYLOAD_PORT: String(DAEMON_PORT) },
      },
    )
  }
  await waitMenuPayloadDaemonReady()
  let r = callClient()
  const errText = `${r.stderr || ''}${r.stdout || ''}`
  if (r.status !== 0 && /ECONNREFUSED|menu-payload-client: timeout/i.test(errText)) {
    daemonChild = null
    clearDaemonPidFile()
    killDaemonPortListeners()
    await waitMenuPayloadDaemonReady()
    r = callClient()
  }
  if (r.status !== 0) {
    throw new Error(`menu payload ${action}: ${(r.stderr || r.stdout).slice(0, 400)}`)
  }
  return parseStdout(r.stdout)
}

/** Misura creazione + lettura (ms) con il backend attuale (daemon o legacy). */
export async function menuPayloadBenchmarkCreateRead(managerEmail) {
  const t0 = Date.now()
  await menuPayloadRun('create-menu-service', [managerEmail, JSON.stringify({ name: 'verify-ui-bench-svc' })])
  const tCreate = Date.now() - t0
  const t1 = Date.now()
  await menuPayloadRun('find-menu-service', [managerEmail, 'verify-ui-bench-svc'])
  const tRead = Date.now() - t1
  try {
    await menuPayloadRun('try-delete-menu-service', [managerEmail, 'verify-ui-bench-svc'])
  } catch {
    /* cleanup best-effort */
  }
  return { createMs: tCreate, readMs: tRead }
}

export async function menuDeleteVerifyPrefix() {
  return menuPayloadRun('delete-prefix', ['verify-ui-'])
}

export async function menuCountSoldOut(managerEmail) {
  return menuPayloadRun('count-sold-out', [managerEmail])
}

export async function menuCreateDishes(managerEmail, specs) {
  return menuPayloadRun('create-dishes', [managerEmail, JSON.stringify(specs)])
}

export async function menuUpdateDish(managerEmail, name, patch) {
  return menuPayloadRun('update-dish', [managerEmail, name, JSON.stringify(patch)])
}

export async function menuCountDishes() {
  return menuPayloadRun('count-dishes')
}

export async function menuFindDish(managerEmail, name) {
  return menuPayloadRun('find-dish', [managerEmail, name])
}

export async function menuReadDishEn(managerEmail, name) {
  return menuPayloadRun('read-dish-en', [managerEmail, name])
}

export async function menuListTaxonomies(managerEmail) {
  return menuPayloadRun('list-taxonomies', [managerEmail])
}

export async function menuTryCreateTaxonomy(managerEmail, kind) {
  return menuPayloadRun('try-create-taxonomy', [managerEmail, kind])
}

export async function menuTryCreateDish(email) {
  return menuPayloadRun('try-create-dish', [email])
}

export async function menuTryDeleteDish(email, name) {
  return menuPayloadRun('try-delete-dish', [email, name])
}

export async function menuFindDeleteLog(managerEmail, dishId, dishName) {
  return menuPayloadRun('find-delete-log', [managerEmail, String(dishId), dishName ?? ''])
}

export async function menuCreateFixedMenuFixture(managerEmail, spec) {
  return menuPayloadRun('create-fixed-menu-fixture', [managerEmail, JSON.stringify(spec)])
}

export async function menuAddDishToFixedMenu(managerEmail, menuName, dishName) {
  return menuPayloadRun('add-dish-to-fixed-menu', [managerEmail, menuName, dishName])
}

export async function menuCreateMenuService(managerEmail, spec) {
  return menuPayloadRun('create-menu-service', [managerEmail, JSON.stringify(spec)])
}

export async function menuCreateSpecialDayForMenu(managerEmail, menuName, dateIso) {
  return menuPayloadRun('create-special-day-for-menu', [managerEmail, menuName, dateIso])
}

export async function menuEnsureMenuListFixtures(managerEmail) {
  return menuPayloadRun('ensure-menu-list-fixtures', [managerEmail])
}

export async function menuFindMenuService(managerEmail, name) {
  return menuPayloadRun('find-menu-service', [managerEmail, name])
}

export async function menuFindFixedMenu(managerEmail, name, depth = '2') {
  return menuPayloadRun('find-fixed-menu', [managerEmail, name, String(depth)])
}

export async function menuReadFixedMenuEn(managerEmail, name) {
  return menuPayloadRun('read-fixed-menu-en', [managerEmail, name])
}

export async function menuCreateFixedMenuWithServices(managerEmail, spec) {
  return menuPayloadRun('create-fixed-menu-with-services', [managerEmail, JSON.stringify(spec)])
}

export async function menuTryDeleteFixedMenuCategory(managerEmail, name) {
  return menuPayloadRun('try-delete-fixed-menu-category', [managerEmail, name])
}

export async function menuTryCreateFixedMenuDuplicateDishes(managerEmail, menuName) {
  return menuPayloadRun('try-create-fixed-menu-duplicate-dishes', [managerEmail, menuName])
}

export async function menuFindMenuServiceDeleteLog(managerEmail, docId, itemName, refCount) {
  return menuPayloadRun('find-menu-service-delete-log', [
    managerEmail,
    String(docId),
    itemName ?? '',
    String(refCount ?? 0),
  ])
}

export async function menuFindFixedMenuDeleteLog(managerEmail, docId, itemName, refCount) {
  return menuPayloadRun('find-fixed-menu-delete-log', [
    managerEmail,
    String(docId),
    itemName ?? '',
    String(refCount ?? 0),
  ])
}

export async function menuTryCreateMenuService(managerEmail) {
  return menuPayloadRun('try-create-menu-service', [managerEmail])
}

export async function menuTryDeleteMenuService(managerEmail, name) {
  return menuPayloadRun('try-delete-menu-service', [managerEmail, name])
}

export async function menuFindStaffUser(role) {
  return menuPayloadRun('find-staff-user', [role])
}

export async function menuEnsureNoroleUser() {
  return menuPayloadRun('ensure-norole-user')
}

export async function menuDeleteUserEmail(email) {
  return menuPayloadRun('delete-user-email', [email])
}

export async function menuCountCatalog(collectionSlug) {
  return menuPayloadRun('count-catalog', [collectionSlug])
}

export async function menuCreateCatalogItems(managerEmail, collectionSlug, specs) {
  return menuPayloadRun('create-catalog-items', [managerEmail, collectionSlug, JSON.stringify(specs)])
}

export async function menuFindCatalogItem(managerEmail, collectionSlug, name) {
  return menuPayloadRun('find-catalog-item', [managerEmail, collectionSlug, name])
}

export async function menuTryDeleteCatalog(managerEmail, collectionSlug, name) {
  return menuPayloadRun('try-delete-catalog', [managerEmail, collectionSlug, name])
}

export async function menuFindCatalogDeleteLog(managerEmail, collectionSlug, docId, itemName) {
  return menuPayloadRun('find-catalog-delete-log', [managerEmail, collectionSlug, String(docId), itemName ?? ''])
}

export async function menuTryCreateCatalogDoc(managerEmail, collectionSlug, dataPatch) {
  return menuPayloadRun('try-create-catalog-doc', [managerEmail, collectionSlug, JSON.stringify(dataPatch)])
}

export async function menuReadCatalogEn(managerEmail, collectionSlug, name) {
  return menuPayloadRun('read-catalog-en', [managerEmail, collectionSlug, name])
}

export async function menuListWineOriginTaxonomies() {
  return menuPayloadRun('list-wine-origin-taxonomies')
}

export async function menuSetCountryEnabled(name, enabled) {
  return menuPayloadRun('set-country-enabled', [name, enabled ? 'true' : 'false'])
}

export async function menuPatchCatalogDoc(managerEmail, collectionSlug, name, patch) {
  return menuPayloadRun('patch-catalog-doc', [managerEmail, collectionSlug, name, JSON.stringify(patch)])
}

export async function menuTryCreateWineTaxonomy(managerEmail, kind) {
  return menuPayloadRun('try-create-wine-taxonomy', [managerEmail, kind])
}

export async function menuCreateWineWithGradeSql(managerEmail, wineName) {
  return menuPayloadRun('create-wine-with-grade-sql', [managerEmail, wineName ?? 'verify-ui-grade-fmt'])
}

export async function menuTryUpdateCatalogDisabledOnly(managerEmail, collectionSlug, name) {
  return menuPayloadRun('try-update-catalog-disabled-only', [managerEmail, collectionSlug, name])
}

export async function menuAdminSetSpiritVolume(name, volume = '75 cl') {
  return menuPayloadRun('admin-set-spirit-volume', [name, volume])
}

export async function menuAdminSetSpiritAbv(name, abv = '12,8%') {
  return menuPayloadRun('admin-set-spirit-abv', [name, abv])
}

export async function menuMisalignWineGeography(managerEmail, wineName) {
  return menuPayloadRun('misalign-wine-geography', [managerEmail, wineName])
}

export async function menuValidateWineFormatsProbe(managerEmail) {
  return menuPayloadRun('validate-wine-formats-probe', [managerEmail])
}

export async function menuValidateSpiritFormatsProbe(managerEmail) {
  return menuPayloadRun('validate-spirit-formats-probe', [managerEmail])
}

export async function menuValidateDrinkFormatsProbe(managerEmail) {
  return menuPayloadRun('validate-drink-formats-probe', [managerEmail])
}
