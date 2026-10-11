// Route group Area App: URL `/app` (vedi `app/(app)/app/`). Distinto dalla cartella App Router `app/`.
import type { Metadata } from 'next'
import type React from 'react'
import { Geist, Geist_Mono } from 'next/font/google'

import { APP_THEME_COOKIE, DEFAULT_APP_THEME } from '@/lib/app/theme'

import './app-ui.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Area App',
  description: 'Backoffice operativo',
}

const appThemeInitScript = `(function(){try{var ck='${APP_THEME_COOKIE}';var def='${DEFAULT_APP_THEME}';function readPref(){var m=document.cookie.match(new RegExp('(?:^|; )'+ck+'=([^;]+)'));return m?decodeURIComponent(m[1]):def;}function applyDark(){var p=readPref();var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}applyDark();window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){var p=readPref();if(p!=='system')return;document.documentElement.classList.toggle('dark',window.matchMedia('(prefers-color-scheme: dark)').matches);});}catch(e){}})();`

type AppAreaLayoutProps = {
  children: React.ReactNode
}

export default function AppAreaLayout({ children }: AppAreaLayoutProps) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: appThemeInitScript }} />
      </head>
      <body className="flex min-h-dvh w-full flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  )
}
