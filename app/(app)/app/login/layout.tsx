import type { Metadata } from 'next'
import type React from 'react'

export const metadata: Metadata = {
  title: 'Accesso · Area App',
}

export default function AppLoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
