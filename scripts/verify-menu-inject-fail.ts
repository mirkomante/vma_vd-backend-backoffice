/** Fallimento controllato per prove di cleanup (`VERIFY_MENU_INJECT_FAIL`). */
export function maybeInjectControlledFailure(stage: string): void {
  const want = process.env.VERIFY_MENU_INJECT_FAIL?.trim()
  if (want && want === stage) {
    throw new Error(`VERIFY_MENU_INJECT_FAIL=${stage} (fallimento controllato)`)
  }
}
