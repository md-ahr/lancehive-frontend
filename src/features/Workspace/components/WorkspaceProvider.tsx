import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { FreelancerMembership } from '@/types/api'

import { useMe } from '@/features/Auth/hooks/useMe'
import { getFreelancerId, setFreelancerId as persistFreelancerId } from '@/lib/workspace-storage'

import { WorkspaceContext } from '../hooks/useWorkspaceContext'

type WorkspaceProviderProps = {
  children: ReactNode
}

const EMPTY_MEMBERSHIPS: FreelancerMembership[] = []

function resolveFreelancerId(
  memberships: Array<{ freelancer_id: number }>,
  activeFreelancerId: number | null,
  persistedId: string | null,
): string | null {
  const membershipIds = memberships.map((membership) => String(membership.freelancer_id))

  if (persistedId && membershipIds.includes(persistedId)) {
    return persistedId
  }

  if (activeFreelancerId && membershipIds.includes(String(activeFreelancerId))) {
    return String(activeFreelancerId)
  }

  return membershipIds[0] ?? null
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const me = useMe()
  const memberships = me.data?.memberships ?? EMPTY_MEMBERSHIPS
  const activeFreelancer = me.data?.active_freelancer ?? null
  const isReadOnly = me.data?.subscription?.read_only ?? false

  const [selectedId, setSelectedId] = useState<string | null>(null)

  const defaultId = useMemo(() => {
    if (!me.data) {
      return null
    }

    return resolveFreelancerId(memberships, activeFreelancer?.id ?? null, getFreelancerId())
  }, [me.data, memberships, activeFreelancer?.id])

  const freelancerId = selectedId ?? defaultId

  useEffect(() => {
    if (defaultId && !selectedId) {
      persistFreelancerId(defaultId)
    }
  }, [defaultId, selectedId])

  const setFreelancerId = useCallback((id: string) => {
    setSelectedId(id)
    persistFreelancerId(id)
  }, [])

  const value = useMemo(
    () => ({
      freelancerId,
      setFreelancerId,
      memberships,
      activeFreelancer,
      isReadOnly,
    }),
    [freelancerId, memberships, activeFreelancer, isReadOnly, setFreelancerId],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}
