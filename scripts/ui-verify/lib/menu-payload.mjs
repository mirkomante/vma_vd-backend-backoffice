import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = join(import.meta.dirname, '../../..')

function parseStdout(stdout) {
  const lines = stdout.trim().split('\n')
  const line = [...lines].reverse().find((l) => l.startsWith('{') || l.startsWith('['))
  if (!line) throw new Error(`Output JSON mancante: ${stdout.slice(0, 160)}`)
  return JSON.parse(line)
}

export function menuPayloadRun(action, extraArgs = []) {
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
