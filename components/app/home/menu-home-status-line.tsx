import { Skeleton } from '@/components/ui/skeleton'

/** Altezza fissa con la riga di testo (controllo home-riga-menu-altezza, tolleranza 2 px). */
export const menuHomeStatusLineClassName =
  'mt-1 min-h-4 text-xs leading-4 text-muted-foreground'

export function MenuHomeStatusLineSkeleton() {
  return (
    <div className={menuHomeStatusLineClassName} aria-hidden>
      <Skeleton className="h-4 w-36 max-w-full" />
    </div>
  )
}

type MenuHomeStatusLineTextProps = {
  text: string
}

export function MenuHomeStatusLineText({ text }: MenuHomeStatusLineTextProps) {
  return <p className={menuHomeStatusLineClassName}>{text}</p>
}
