'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { AppNavIcon } from '@/components/app/app-nav-icon'
import { findActiveNavItemInNavigation } from '@/lib/app/navRouteMatch'
import type { VisibleAppNavGroup } from '@/lib/app/navigationForUser'

type AppSidebarNavProps = {
  groups: VisibleAppNavGroup[]
}

export function AppSidebarNav({ groups }: AppSidebarNavProps) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const activeItem = findActiveNavItemInNavigation(pathname, groups)

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.id}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = activeItem?.id === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={item.href} />}
                      onClick={() => {
                        if (isMobile) {
                          setOpenMobile(false)
                        }
                      }}
                    >
                      <AppNavIcon name={item.iconKey} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
