import Link from 'next/link'

import { Button } from '@/components/ui/button'

type AppAuthLinkProps = {
  href: string
  children: string
  muted?: boolean
}

export function AppAuthLink({ href, children, muted }: AppAuthLinkProps) {
  return (
    <Button
      variant="link"
      size="lg"
      className={
        muted
          ? 'h-auto px-0 py-0 text-sm text-muted-foreground underline underline-offset-4'
          : 'h-auto px-0 py-0 text-sm underline underline-offset-4'
      }
      nativeButton={false}
      render={<Link href={href} />}
    >
      {children}
    </Button>
  )
}
