import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { getUserMessage, type ApiError } from '@/lib/errors'

type ErrorAlertProps = {
  error: ApiError | Error
  onRetry?: () => void
}

export function ErrorAlert({ error, onRetry }: ErrorAlertProps) {
  const message = getUserMessage(error)

  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{message}</span>
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  )
}
