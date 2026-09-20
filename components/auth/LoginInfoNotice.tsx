type LoginInfoNoticeProps = {
  show: boolean
  children: string
}

export function LoginInfoNotice({ show, children }: LoginInfoNoticeProps) {
  if (!show) {
    return null
  }

  return (
    <p
      role="status"
      className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-left text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100"
    >
      {children}
    </p>
  )
}
