export function matrixParallelism() {
  const raw = process.env.UI_VERIFY_PARALLEL
  if (raw == null || raw === '') return 4
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 1) throw new Error(`UI_VERIFY_PARALLEL non valido: ${raw}`)
  return Math.floor(n)
}

/**
 * Esegue le celle in parallelo (limite UI_VERIFY_PARALLEL) e restituisce i risultati ordinati per sortKey.
 * @template T
 * @template R
 * @param {T[]} cells
 * @param {(cell: T, index: number) => Promise<R & { sortKey: string }>} runCell
 * @param {{ limit?: number }} [opts]
 */
export async function runMatrixCellsParallel(cells, runCell, opts = {}) {
  if (!cells.length) return []
  const limit = opts.limit ?? matrixParallelism()
  const results = []
  let next = 0

  async function worker() {
    while (true) {
      const i = next
      next += 1
      if (i >= cells.length) break
      const row = await runCell(cells[i], i)
      results.push(row)
    }
  }

  const workers = Array.from({ length: Math.min(limit, cells.length) }, () => worker())
  await Promise.all(workers)
  results.sort((a, b) => a.sortKey.localeCompare(b.sortKey, 'it'))
  return results
}

/** Stati che richiedono server sim o setup non parallelizzabile. */
export const MATRIX_SERIAL_STATES = new Set(['caricamento', 'errore-caricamento'])
