import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { ClientMembership } from '@/types/api'

import { useMe } from '@/features/Auth/hooks/useMe'
import { getClientId, setClientId as persistClientId } from '@/lib/client-storage'

import { PortalContext } from '../hooks/usePortalContext'

type PortalProviderProps = {
  children: ReactNode
}

const EMPTY_MEMBERSHIPS: ClientMembership[] = []

function resolveClientId(
  memberships: Array<{ client_id: number }>,
  activeClientId: number | null,
  persistedId: string | null,
): string | null {
  const membershipIds = memberships.map((membership) => String(membership.client_id))

  if (persistedId && membershipIds.includes(persistedId)) {
    return persistedId
  }

  if (activeClientId && membershipIds.includes(String(activeClientId))) {
    return String(activeClientId)
  }

  return membershipIds[0] ?? null
}

export function PortalProvider({ children }: PortalProviderProps) {
  const me = useMe()
  const memberships = me.data?.client_memberships ?? EMPTY_MEMBERSHIPS
  const activeClient = me.data?.active_client ?? null

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const defaultId = useMemo(() => {
    if (!me.data) {
      return null
    }

    return resolveClientId(memberships, activeClient?.id ?? null, getClientId())
  }, [me.data, memberships, activeClient?.id])

  const clientId = selectedId ?? defaultId

  useEffect(() => {
    if (defaultId && !selectedId) {
      persistClientId(defaultId)
    }
  }, [defaultId, selectedId])

  const setClientId = useCallback((id: string) => {
    setSelectedId(id)
    persistClientId(id)
  }, [])

  const value = useMemo(
    () => ({
      clientId,
      setClientId,
      memberships,
      activeClient,
    }),
    [clientId, memberships, activeClient, setClientId],
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}
