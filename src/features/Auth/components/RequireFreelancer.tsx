import { Navigate, Outlet } from 'react-router-dom'

import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'

import { useMe } from '../hooks/useMe'

export function RequireFreelancer() {
  const me = useMe()

  if (me.isLoading) {
    return <LoadingSkeleton variant="page" />
  }

  if (me.isError || !me.data) {
    return <Navigate to="/login" replace />
  }

  const { user, memberships } = me.data

  if (user.role === 'super_admin') {
    return <Navigate to="/admin" replace />
  }

  if (user.role === 'client') {
    return <Navigate to="/portal" replace />
  }

  if (memberships.length === 0) {
    return <Navigate to="/login" replace />
  }

  return (
    <WorkspaceProvider>
      <Outlet />
    </WorkspaceProvider>
  )
}
