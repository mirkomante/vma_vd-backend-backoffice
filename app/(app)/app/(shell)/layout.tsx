import type React from 'react'

import { AppShell } from '@/components/app/shell/app-shell'
import { getVisibleNavigation } from '@/lib/app/navigationForUser'
import { requireAppAccess } from '@/lib/app/requireAppAccess'

export const metadata = {
  description: 'Backoffice operativo',
}

type ShellLayoutProps = {
  children: React.ReactNode
}

export default async function ShellLayout({ children }: ShellLayoutProps) {
  const user = await requireAppAccess()
  const navigation = getVisibleNavigation(user)

  return (
    <AppShell user={user} navigation={navigation}>
      {children}
    </AppShell>
  )
}
