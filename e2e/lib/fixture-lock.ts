let tail: Promise<void> = Promise.resolve()

/** Serializza le scritture fixture tra worker paralleli (R5). */
export function withFixtureLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = tail.then(fn, fn)
  tail = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}
