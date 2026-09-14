import { Navigate } from 'react-router-dom'

import { LoadingSkeleton } from '@/components/LoadingSkeleton'

import { useMe } from '../hooks/useMe'
import { getPersonaPath } from '../lib/getPersonaPath'
import { useAuthStore } from '../stores/useAuthStore'

export function PersonaRedirect() {
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

  if (me.isError || !me.data) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getPersonaPath(me.data.user.role)} replace />
}
