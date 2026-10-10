'use client'

import { usePathname } from 'next/navigation'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { buildAppBreadcrumb } from '@/lib/app/breadcrumb'
import type { VisibleAppNavGroup } from '@/lib/app/navigationForUser'

type AppTopBarProps = {
  navigation: VisibleAppNavGroup[]
}

export function AppTopBar({ navigation }: AppTopBarProps) {
  const pathname = usePathname()
  const parts = buildAppBreadcrumb(pathname, navigation)

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-1 data-vertical:h-4 data-vertical:self-center" />
      <Breadcrumb>
        <BreadcrumbList>
          {parts.map((part, index) => (
            <span key={`${part.label}-${index}`} className="contents">
              <BreadcrumbItem>
                {part.type === 'link' ? (
                  <BreadcrumbLink href={part.href}>{part.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{part.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < parts.length - 1 ? <BreadcrumbSeparator /> : null}
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
