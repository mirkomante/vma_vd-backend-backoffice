"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "cn"
import { CheckIcon } from "lucide-react"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer relative inline-flex size-4 shrink-0 items-center justify-center border-0 bg-transparent outline-none",
        "pointer-coarse:size-11 pointer-coarse:after:absolute pointer-coarse:after:-inset-4 pointer-coarse:after:content-['']",
        "group-has-disabled/field:opacity-50 disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:outline-none",
        className
      )}
      {...props}
    >
      <span
        data-slot="checkbox-box"
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input bg-transparent transition-colors",
          "group-has-[:focus-visible]/field-label:ring-0",
          "group-data-checked/checkbox:border-primary group-data-checked/checkbox:bg-primary group-data-checked/checkbox:text-primary-foreground",
          "group-has-[:focus-visible]/field-label:group-data-checked/checkbox:border-primary",
          "group-focus-visible/checkbox:border-ring group-focus-visible/checkbox:ring-3 group-focus-visible/checkbox:ring-ring/50",
          "group-aria-invalid/checkbox:border-destructive group-aria-invalid/checkbox:ring-3 group-aria-invalid/checkbox:ring-destructive/20",
          "group-aria-invalid/checkbox:group-data-checked/checkbox:border-primary",
          "dark:bg-input/30 dark:group-aria-invalid/checkbox:border-destructive/50 dark:group-aria-invalid/checkbox:ring-destructive/40",
          "dark:group-data-checked/checkbox:bg-primary"
        )}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
        >
          <CheckIcon />
        </CheckboxPrimitive.Indicator>
      </span>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
