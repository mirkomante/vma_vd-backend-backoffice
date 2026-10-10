import { AlertCircle, CheckCircle2 } from 'lucide-react'

import { Alert, AlertDescription } from '@/components/ui/alert'

type AppAuthAlertProps = {
  variant: 'error' | 'success'
  children: string
}

export function AppAuthAlert({ variant, children }: AppAuthAlertProps) {
  const isError = variant === 'error'

  return (
    <Alert
      variant={isError ? 'destructive' : 'default'}
      role={isError ? 'alert' : 'status'}
      className="text-left"
    >
      {isError ? <AlertCircle /> : <CheckCircle2 />}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
