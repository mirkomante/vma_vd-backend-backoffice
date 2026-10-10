import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AppAuthLinkProps = {
  href: string
  children: string
  muted?: boolean
}

export function AppAuthLink({ href, children, muted }: AppAuthLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: 'link', size: 'lg' }),
        muted
          ? 'h-auto px-0 py-0 text-sm text-muted-foreground underline underline-offset-4'
          : 'h-auto px-0 py-0 text-sm underline underline-offset-4',
      )}
    >
      {children}
    </Link>
  )
}
