'use client'

import type React from 'react'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { UserAccessFields } from '@/lib/auth/roles'
import type { VisibleAppNavGroup } from '@/lib/app/navigationForUser'

import { AppSaveBarAnchor, AppSaveBarProvider } from './save-bar-slot'
import { AppSidebar } from './app-sidebar'
import { AppTopBar } from './app-top-bar'

type AppShellProps = {
  user: UserAccessFields & { email: string }
  navigation: VisibleAppNavGroup[]
  children: React.ReactNode
}

export function AppShell({ user, navigation, children }: AppShellProps) {
  return (
    <TooltipProvider>
      <AppSaveBarProvider>
        <SidebarProvider>
          <AppSidebar user={user} navigation={navigation} />
          <SidebarInset>
            <AppTopBar navigation={navigation} />
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">{children}</div>
              <AppSaveBarAnchor />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AppSaveBarProvider>
    </TooltipProvider>
  )
}
