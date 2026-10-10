import Link from 'next/link'
import { Store } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import type { UserAccessFields } from '@/lib/auth/roles'
import { canAccessAdminPanel } from '@/lib/auth/userAccess'
import { appAreaRoleLabel } from '@/lib/app/userDisplay'
import type { VisibleAppNavGroup } from '@/lib/app/navigationForUser'

import { AppSidebarNav } from './app-sidebar-nav'
import { AppUserMenu } from './app-user-menu'

type AppSidebarProps = {
  user: UserAccessFields & { email: string }
  navigation: VisibleAppNavGroup[]
}

export function AppSidebar({ user, navigation }: AppSidebarProps) {
  const roleLabel = appAreaRoleLabel(user)

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/app" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Store className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Area App</span>
                {roleLabel ? (
                  <span className="truncate text-xs text-muted-foreground">{roleLabel}</span>
                ) : null}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarNav groups={navigation} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <AppUserMenu email={user.email} showAdminLink={canAccessAdminPanel(user)} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
