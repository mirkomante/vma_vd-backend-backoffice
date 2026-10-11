import { cn } from "cn"

import { Loader2Icon } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon className={cn("size-4 animate-spin", className)} />
  )
}

export { Spinner }
