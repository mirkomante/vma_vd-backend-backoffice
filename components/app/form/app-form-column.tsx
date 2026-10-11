import type { ReactNode } from 'react'

type AppFormColumnProps = {
  children: ReactNode
}

/** Colonna modulo centrata (D8): max-w-xl. */
export function AppFormColumn({ children }: AppFormColumnProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-5">{children}</div>
  )
}
