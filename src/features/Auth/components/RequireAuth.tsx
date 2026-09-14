import { Navigate, Outlet } from 'react-router-dom'

import { LoadingSkeleton } from '@/components/LoadingSkeleton'

import { useMe } from '../hooks/useMe'
import { useAuthStore } from '../stores/useAuthStore'

export function RequireAuth() {
  const hasToken = useAuthStore((state) => state.hasToken)
  const isHydrated = useAuthStore((state) => state.isHydrated)
  const me = useMe()

  if (!isHydrated) {
    return <LoadingSkeleton variant="page" />
  }

  if (!hasToken) {
    return <Navigate to="/login" replace />
  }

  if (me.isLoading) {
    return <LoadingSkeleton variant="page" />
  }

  if (me.isError) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
