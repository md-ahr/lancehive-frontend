import { Navigate, Outlet } from 'react-router-dom'

import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PortalProvider } from '@/features/Portal/components/PortalProvider'

import { useMe } from '../hooks/useMe'

export function RequireClient() {
  const me = useMe()

  if (me.isLoading) {
    return <LoadingSkeleton variant="page" />
  }

  if (me.isError || !me.data) {
    return <Navigate to="/login" replace />
  }

  const { user, client_memberships } = me.data

  if (user.role === 'super_admin') {
    return <Navigate to="/admin" replace />
  }

  if (user.role === 'freelancer') {
    return <Navigate to="/app" replace />
  }

  if (client_memberships.length === 0) {
    return <Navigate to="/login" replace />
  }

  return (
    <PortalProvider>
      <Outlet />
    </PortalProvider>
  )
}
