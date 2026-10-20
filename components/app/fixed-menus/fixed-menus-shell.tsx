'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'

import { MenuPageHeader } from '@/components/app/menu/menu-page-header'
import { cn } from '@/lib/utils'
import {
  MENU_FISSI_PAGE_DESCRIPTION,
  MENU_FISSI_PAGE_TITLE,
  MENU_FISSI_TAB_CATEGORIES,
  MENU_FISSI_TAB_MENUS,
} from '@/lib/menu/fixed-menus/copy'

type FixedMenusShellProps = {
  activeTab: 'menus' | 'categories'
  children: ReactNode
}

export function FixedMenusShell({ activeTab, children }: FixedMenusShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <MenuPageHeader title={MENU_FISSI_PAGE_TITLE} description={MENU_FISSI_PAGE_DESCRIPTION} />

      <div
        className="flex gap-4 overflow-x-auto border-b border-border"
        role="tablist"
        aria-label={MENU_FISSI_PAGE_TITLE}
      >
        <Link
          href="/app/menu/fixed"
          role="tab"
          aria-selected={activeTab === 'menus'}
          aria-current={activeTab === 'menus' ? 'page' : undefined}
          className={cn(
            'shrink-0 border-b-2 border-transparent px-1 pb-2 text-sm font-medium text-muted-foreground',
            activeTab === 'menus' && 'border-primary text-foreground',
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
            'shrink-0 border-b-2 border-transparent px-1 pb-2 text-sm font-medium text-muted-foreground',
            activeTab === 'categories' && 'border-primary text-foreground',
          )}
        >
          {MENU_FISSI_TAB_CATEGORIES}
        </Link>
      </div>

      {children}
    </div>
  )
}
