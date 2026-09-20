import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'

const inputClassName =
  'w-full min-w-0 rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-500 focus-visible:border-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:focus-visible:border-neutral-300 dark:focus-visible:ring-neutral-100/10'

type AppAuthFieldProps = {
  label: string
  children: ReactNode
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>
}

/** Campo form Area App — full width nel contenitore `max-w-sm`, allineato al bottone Google. */
export function AppAuthField({ label, children, labelProps }: AppAuthFieldProps) {
  return (
    <label
      {...labelProps}
      className={`flex w-full min-w-0 flex-col gap-1.5 text-left text-sm font-medium text-neutral-800 dark:text-neutral-200 ${labelProps?.className ?? ''}`}
    >
      {label}
      {children}
    </label>
  )
}

export function AppAuthInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props
  return <input className={`${inputClassName}${className ? ` ${className}` : ''}`} {...rest} />
}
