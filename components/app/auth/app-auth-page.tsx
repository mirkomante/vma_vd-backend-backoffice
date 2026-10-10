import type React from 'react'
import { Store } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

type AppAuthPageProps = {
  title: string
  description?: string
  children: React.ReactNode
  links?: React.ReactNode
}

export function AppAuthPage({ title, description, children, links }: AppAuthPageProps) {
  return (
    <main className="flex min-h-dvh w-full flex-1 flex-col items-center justify-center px-4 py-12 md:px-6">
      <div className="flex w-full max-w-sm flex-col items-stretch gap-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="size-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description ? (
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">{children}</CardContent>
        </Card>
        {links ? <div className="flex flex-col items-center gap-3">{links}</div> : null}
      </div>
    </main>
  )
}
