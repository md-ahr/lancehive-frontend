import { Navigate, Outlet } from 'react-router-dom'

import { LoadingSkeleton } from '@/components/LoadingSkeleton'

import { useMe } from '../hooks/useMe'

export function RequireSuperAdmin() {
  const me = useMe()

  if (me.isLoading) {
    return <LoadingSkeleton variant="page" />
  }

  if (me.isError || !me.data) {
    return <Navigate to="/login" replace />
  }

  const { user } = me.data

  if (user.role === 'client') {
    return <Navigate to="/portal" replace />
  }

  if (user.role === 'freelancer') {
    return <Navigate to="/app" replace />
  }

  if (user.role !== 'super_admin') {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
