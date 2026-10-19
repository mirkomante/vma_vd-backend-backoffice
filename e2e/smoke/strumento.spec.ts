import { test } from '../fixtures'

test.beforeEach(({ page: _page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'telefono-390-chiaro',
    'prove strumento solo su telefono-390-chiaro',
  )
})

test('strumento: blocco ucciso al timeout', async () => {
  test.setTimeout(3_000)
  await new Promise<void>(() => {
    /* non risolve mai */
  })
})

test('fixture: crea verify-ui-fix e lancia eccezione', async ({ payload }) => {
  const name = `verify-ui-fix-${payload.runId}`
  await payload.crea('dishes', {
    name,
    description: 'probe eccezione',
    price: 1,
    category: payload.defaultDishCategoryId,
  })
  throw new Error('eccezione voluta post-creazione fixture')
})
