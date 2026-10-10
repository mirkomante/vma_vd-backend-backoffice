'use client'

import type React from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

type SaveBarContextValue = {
  setSaveBar: (node: React.ReactNode) => void
  saveBar: React.ReactNode
}

const SaveBarContext = createContext<SaveBarContextValue | null>(null)

export function AppSaveBarProvider({ children }: { children: React.ReactNode }) {
  const [saveBar, setSaveBar] = useState<React.ReactNode>(null)
  const value = useMemo(() => ({ saveBar, setSaveBar }), [saveBar])

  return <SaveBarContext.Provider value={value}>{children}</SaveBarContext.Provider>
}

export function AppSaveBarAnchor() {
  const ctx = useContext(SaveBarContext)
  if (!ctx?.saveBar) {
    return null
  }

  return (
    <div
      data-slot="app-save-bar"
      className="sticky bottom-0 z-10 w-full border-t bg-background"
    >
      <div className="mx-auto w-full max-w-xl px-4 pb-4 md:px-6 md:pb-6">{ctx.saveBar}</div>
    </div>
  )
}

/** Per pagine-modulo future (8.5+): imposta il contenuto della barra di salvataggio. */
export function useAppSaveBar() {
  const ctx = useContext(SaveBarContext)
  if (!ctx) {
    throw new Error('useAppSaveBar deve essere usato dentro AppSaveBarProvider')
  }
  return ctx
}
