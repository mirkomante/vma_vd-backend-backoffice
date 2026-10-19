'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'

import { MenuPageHeader } from '@/components/app/menu/menu-page-header'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  MENU_FISSI_PAGE_DESCRIPTION,
  MENU_FISSI_PAGE_TITLE,
  MENU_FISSI_TAB_CATEGORIES,
  MENU_FISSI_TAB_MENUS,
} from '@/lib/menu/fixed-menus/copy'

type FixedMenusShellProps = {
  activeTab: 'menus' | 'categories'
  tabAction?: ReactNode
  children: ReactNode
}

export function FixedMenusShell({ activeTab, tabAction, children }: FixedMenusShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <MenuPageHeader
        title={MENU_FISSI_PAGE_TITLE}
        description={MENU_FISSI_PAGE_DESCRIPTION}
        primaryAction={tabAction}
      />

      <div
        className="flex gap-1 overflow-x-auto border-b border-border pb-px"
        role="tablist"
        aria-label={MENU_FISSI_PAGE_TITLE}
      >
        <Link
          href="/app/menu/fixed"
          role="tab"
          aria-selected={activeTab === 'menus'}
          aria-current={activeTab === 'menus' ? 'page' : undefined}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'default' }),
            'shrink-0 rounded-b-none',
            activeTab === 'menus' && 'border-b-2 border-primary',
          )}
        >
          {MENU_FISSI_TAB_MENUS}
        </Link>
        <Link
          href="/app/menu/fixed/categories"
          role="tab"
          aria-selected={activeTab === 'categories'}
          aria-current={activeTab === 'categories' ? 'page' : undefined}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'default' }),
            'shrink-0 rounded-b-none',
            activeTab === 'categories' && 'border-b-2 border-primary',
          )}
        >
          {MENU_FISSI_TAB_CATEGORIES}
        </Link>
      </div>

      {children}
    </div>
  )
}
