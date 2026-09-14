import { AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function ReadOnlyBanner() {
  return (
    <Alert>
      <AlertTriangle className="size-4" />
      <AlertTitle>Workspace is read-only</AlertTitle>
      <AlertDescription>
        Your subscription has lapsed. Renew your plan to restore write access.{' '}
        <Link
          to="/app/subscription"
          className="text-primary font-medium underline-offset-4 hover:underline"
        >
          Manage subscription
        </Link>
      </AlertDescription>
    </Alert>
  )
}
