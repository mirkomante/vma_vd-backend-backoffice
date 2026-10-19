import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

const ROOT = join(import.meta.dirname, '../../..')
const DAEMON_PORT = Number(process.env.UI_VERIFY_MENU_PAYLOAD_PORT ?? '31997')

const USE_LEGACY_PAYLOAD = process.env.UI_VERIFY_MENU_PAYLOAD_LEGACY === '1'

let daemonChild = null

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

function killDaemonPortListeners() {
  spawnSync('sh', ['-c', `lsof -ti tcp:${DAEMON_PORT} | xargs kill -9 2>/dev/null || true`], { stdio: 'ignore' })
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
  killDaemonPortListeners()
}

export function stopMenuPayloadSession() {
  stopMenuPayloadDaemon()
}

function ensureMenuPayloadDaemon() {
  if (isDaemonPortOpen()) return
  if (daemonChild && !daemonChild.killed) return
  daemonChild = spawn(
    'pnpm',
    ['payload', 'run', 'scripts/ui-verify/menu-payload.ts', '--', '__daemon__'],
    {
      cwd: ROOT,
      env: { ...process.env, UI_VERIFY_MENU_PAYLOAD_PORT: String(DAEMON_PORT) },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )
  const deadline = Date.now() + 90_000
  while (Date.now() < deadline) {
    const probe = spawnSync(
      'node',
      [
        '-e',
        `require('node:net').connect(${DAEMON_PORT},'127.0.0.1',()=>process.exit(0)).on('error',()=>process.exit(1))`,
      ],
      { stdio: 'ignore' },
    )
    if (probe.status === 0) return
    if (daemonChild.exitCode != null) {
      throw new Error(`menu payload daemon terminato (exit ${daemonChild.exitCode})`)
    }
    spawnSync('sleep', ['0.25'])
  }
  throw new Error('menu payload daemon: timeout avvio')
}

export function menuPayloadRun(action, extraArgs = []) {
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
  ensureMenuPayloadDaemon()
  const r = spawnSync(
    'node',
    ['scripts/ui-verify/menu-payload-client.mjs', '--', action, ...extraArgs],
    {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, UI_VERIFY_MENU_PAYLOAD_PORT: String(DAEMON_PORT) },
    },
  )
  if (r.status !== 0) {
    throw new Error(`menu payload ${action}: ${(r.stderr || r.stdout).slice(0, 400)}`)
  }
  return parseStdout(r.stdout)
}

/** Misura creazione + lettura (ms) con il backend attuale (daemon o legacy). */
export function menuPayloadBenchmarkCreateRead(managerEmail) {
  const t0 = Date.now()
  menuPayloadRun('create-menu-service', [managerEmail, JSON.stringify({ name: 'verify-ui-bench-svc' })])
  const tCreate = Date.now() - t0
  const t1 = Date.now()
  menuPayloadRun('find-menu-service', [managerEmail, 'verify-ui-bench-svc'])
  const tRead = Date.now() - t1
  try {
    menuPayloadRun('try-delete-menu-service', [managerEmail, 'verify-ui-bench-svc'])
  } catch {
    /* cleanup best-effort */
  }
  return { createMs: tCreate, readMs: tRead }
}

export function menuDeleteVerifyPrefix() {
  return menuPayloadRun('delete-prefix', ['verify-ui-'])
}

export function menuCountSoldOut(managerEmail) {
  return menuPayloadRun('count-sold-out', [managerEmail])
}

export function menuCreateDishes(managerEmail, specs) {
  return menuPayloadRun('create-dishes', [managerEmail, JSON.stringify(specs)])
}

export function menuUpdateDish(managerEmail, name, patch) {
  return menuPayloadRun('update-dish', [managerEmail, name, JSON.stringify(patch)])
}

export function menuCountDishes() {
  return menuPayloadRun('count-dishes')
}

export function menuFindDish(managerEmail, name) {
  return menuPayloadRun('find-dish', [managerEmail, name])
}

export function menuReadDishEn(managerEmail, name) {
  return menuPayloadRun('read-dish-en', [managerEmail, name])
}

export function menuListTaxonomies(managerEmail) {
  return menuPayloadRun('list-taxonomies', [managerEmail])
}

export function menuTryCreateTaxonomy(managerEmail, kind) {
  return menuPayloadRun('try-create-taxonomy', [managerEmail, kind])
}

export function menuTryCreateDish(email) {
  return menuPayloadRun('try-create-dish', [email])
}

export function menuTryDeleteDish(email, name) {
  return menuPayloadRun('try-delete-dish', [email, name])
}

export function menuFindDeleteLog(managerEmail, dishId, dishName) {
  return menuPayloadRun('find-delete-log', [managerEmail, String(dishId), dishName ?? ''])
}

export function menuCreateFixedMenuFixture(managerEmail, spec) {
  return menuPayloadRun('create-fixed-menu-fixture', [managerEmail, JSON.stringify(spec)])
}

export function menuAddDishToFixedMenu(managerEmail, menuName, dishName) {
  return menuPayloadRun('add-dish-to-fixed-menu', [managerEmail, menuName, dishName])
}

export function menuCreateMenuService(managerEmail, spec) {
  return menuPayloadRun('create-menu-service', [managerEmail, JSON.stringify(spec)])
}

export function menuCreateSpecialDayForMenu(managerEmail, menuName, dateIso) {
  return menuPayloadRun('create-special-day-for-menu', [managerEmail, menuName, dateIso])
}

export function menuEnsureMenuListFixtures(managerEmail) {
  return menuPayloadRun('ensure-menu-list-fixtures', [managerEmail])
}

export function menuFindMenuService(managerEmail, name) {
  return menuPayloadRun('find-menu-service', [managerEmail, name])
}

export function menuFindFixedMenu(managerEmail, name, depth = '2') {
  return menuPayloadRun('find-fixed-menu', [managerEmail, name, String(depth)])
}

export function menuReadFixedMenuEn(managerEmail, name) {
  return menuPayloadRun('read-fixed-menu-en', [managerEmail, name])
}

export function menuCreateFixedMenuWithServices(managerEmail, spec) {
  return menuPayloadRun('create-fixed-menu-with-services', [managerEmail, JSON.stringify(spec)])
}

export function menuTryDeleteFixedMenuCategory(managerEmail, name) {
  return menuPayloadRun('try-delete-fixed-menu-category', [managerEmail, name])
}

export function menuTryCreateFixedMenuDuplicateDishes(managerEmail, menuName) {
  return menuPayloadRun('try-create-fixed-menu-duplicate-dishes', [managerEmail, menuName])
}

export function menuFindMenuServiceDeleteLog(managerEmail, docId, itemName, refCount) {
  return menuPayloadRun('find-menu-service-delete-log', [
    managerEmail,
    String(docId),
    itemName ?? '',
    String(refCount ?? 0),
  ])
}

export function menuFindFixedMenuDeleteLog(managerEmail, docId, itemName, refCount) {
  return menuPayloadRun('find-fixed-menu-delete-log', [
    managerEmail,
    String(docId),
    itemName ?? '',
    String(refCount ?? 0),
  ])
}

export function menuTryCreateMenuService(managerEmail) {
  return menuPayloadRun('try-create-menu-service', [managerEmail])
}

export function menuTryDeleteMenuService(managerEmail, name) {
  return menuPayloadRun('try-delete-menu-service', [managerEmail, name])
}

export function menuFindStaffUser(role) {
  return menuPayloadRun('find-staff-user', [role])
}

export function menuEnsureNoroleUser() {
  return menuPayloadRun('ensure-norole-user')
}

export function menuDeleteUserEmail(email) {
  return menuPayloadRun('delete-user-email', [email])
}

export function menuCountCatalog(collectionSlug) {
  return menuPayloadRun('count-catalog', [collectionSlug])
}

export function menuCreateCatalogItems(managerEmail, collectionSlug, specs) {
  return menuPayloadRun('create-catalog-items', [managerEmail, collectionSlug, JSON.stringify(specs)])
}

export function menuFindCatalogItem(managerEmail, collectionSlug, name) {
  return menuPayloadRun('find-catalog-item', [managerEmail, collectionSlug, name])
}

export function menuTryDeleteCatalog(managerEmail, collectionSlug, name) {
  return menuPayloadRun('try-delete-catalog', [managerEmail, collectionSlug, name])
}

export function menuFindCatalogDeleteLog(managerEmail, collectionSlug, docId, itemName) {
  return menuPayloadRun('find-catalog-delete-log', [managerEmail, collectionSlug, String(docId), itemName ?? ''])
}

export function menuTryCreateCatalogDoc(managerEmail, collectionSlug, dataPatch) {
  return menuPayloadRun('try-create-catalog-doc', [managerEmail, collectionSlug, JSON.stringify(dataPatch)])
}

export function menuReadCatalogEn(managerEmail, collectionSlug, name) {
  return menuPayloadRun('read-catalog-en', [managerEmail, collectionSlug, name])
}

export function menuListWineOriginTaxonomies() {
  return menuPayloadRun('list-wine-origin-taxonomies')
}

export function menuSetCountryEnabled(name, enabled) {
  return menuPayloadRun('set-country-enabled', [name, enabled ? 'true' : 'false'])
}

export function menuPatchCatalogDoc(managerEmail, collectionSlug, name, patch) {
  return menuPayloadRun('patch-catalog-doc', [managerEmail, collectionSlug, name, JSON.stringify(patch)])
}

export function menuTryCreateWineTaxonomy(managerEmail, kind) {
  return menuPayloadRun('try-create-wine-taxonomy', [managerEmail, kind])
}

export function menuCreateWineWithGradeSql(managerEmail, wineName) {
  return menuPayloadRun('create-wine-with-grade-sql', [managerEmail, wineName ?? 'verify-ui-grade-fmt'])
}

export function menuTryUpdateCatalogDisabledOnly(managerEmail, collectionSlug, name) {
  return menuPayloadRun('try-update-catalog-disabled-only', [managerEmail, collectionSlug, name])
}

export function menuAdminSetSpiritVolume(name, volume = '75 cl') {
  return menuPayloadRun('admin-set-spirit-volume', [name, volume])
}

export function menuAdminSetSpiritAbv(name, abv = '12,8%') {
  return menuPayloadRun('admin-set-spirit-abv', [name, abv])
}

export function menuMisalignWineGeography(managerEmail, wineName) {
  return menuPayloadRun('misalign-wine-geography', [managerEmail, wineName])
}

export function menuValidateWineFormatsProbe(managerEmail) {
  return menuPayloadRun('validate-wine-formats-probe', [managerEmail])
}

export function menuValidateSpiritFormatsProbe(managerEmail) {
  return menuPayloadRun('validate-spirit-formats-probe', [managerEmail])
}

export function menuValidateDrinkFormatsProbe(managerEmail) {
  return menuPayloadRun('validate-drink-formats-probe', [managerEmail])
}
