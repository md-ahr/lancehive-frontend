import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'

import { ClientProfileCard } from '../components/ClientProfileCard'
import { usePortalClient } from '../hooks/usePortalClient'

export function PortalDashboardPage() {
  const { isPending, isError, error, data: clientData, refetch } = usePortalClient()

  if (isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <PageHeader title="Dashboard" description="Your organization overview." />
        <ErrorAlert error={error} onRetry={() => void refetch()} />
      </div>
    )
  }

  if (!clientData) {
    return null
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Your organization overview." />
      <ClientProfileCard client={clientData} />
    </div>
  )
}
