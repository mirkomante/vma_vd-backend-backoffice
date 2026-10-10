'use client'

import Link from 'next/link'
import { ChevronsUpDown, ExternalLink, LogOut } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import {
  APP_THEME_COOKIE,
  type AppThemePreference,
  DEFAULT_APP_THEME,
  parseAppThemePreference,
} from '@/lib/app/theme'
import { initialsFromEmail } from '@/lib/app/userDisplay'

const LOGOUT_FORM_ID = 'app-logout-form'

type AppUserMenuProps = {
  email: string
  showAdminLink: boolean
}

function readThemeFromCookie(): AppThemePreference {
  if (typeof document === 'undefined') {
    return DEFAULT_APP_THEME
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${APP_THEME_COOKIE}=([^;]+)`))
  return parseAppThemePreference(match ? decodeURIComponent(match[1]) : undefined)
}

function applyThemeToDocument(preference: AppThemePreference) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark =
    preference === 'dark' || (preference === 'system' && prefersDark)
  document.documentElement.classList.toggle('dark', dark)
  const maxAge = 60 * 60 * 24 * 365
  document.cookie = `${APP_THEME_COOKIE}=${encodeURIComponent(preference)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function AppUserMenu({ email, showAdminLink }: AppUserMenuProps) {
  const [theme, setTheme] = useState<AppThemePreference>(() =>
    typeof document !== 'undefined' ? readThemeFromCookie() : DEFAULT_APP_THEME,
  )

  return (
    <>
      <form id={LOGOUT_FORM_ID} method="POST" action="/app/logout" className="hidden" />
      <DropdownMenu>
        <DropdownMenuTrigger nativeButton render={<SidebarMenuButton size="lg" />}>
          <Avatar className="size-8 rounded-lg">
            <AvatarFallback className="rounded-lg">{initialsFromEmail(email)}</AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1 truncate text-left text-sm">{email}</span>
          <ChevronsUpDown className="ml-auto size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-56 rounded-lg"
          side="top"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{initialsFromEmail(email)}</AvatarFallback>
                </Avatar>
                <span className="truncate font-medium">{email}</span>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Tema</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value: string) => {
                const next = parseAppThemePreference(value)
                setTheme(next)
                applyThemeToDocument(next)
              }}
            >
              <DropdownMenuRadioItem value="light">Chiaro</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Scuro</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">Sistema</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
          {showAdminLink ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem nativeButton={false} render={<Link href="/admin" />}>
                <ExternalLink />
                Vai all&apos;Admin
              </DropdownMenuItem>
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              const form = document.getElementById(LOGOUT_FORM_ID)
              if (form instanceof HTMLFormElement) {
                form.requestSubmit()
              }
            }}
          >
            <LogOut />
            Esci
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
