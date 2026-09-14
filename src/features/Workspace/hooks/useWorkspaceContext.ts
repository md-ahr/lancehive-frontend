import { createContext, useContext } from 'react'

import type { Freelancer, FreelancerMembership } from '@/types/api'

export type WorkspaceContextValue = {
  freelancerId: string | null
  setFreelancerId: (id: string) => void
  memberships: FreelancerMembership[]
  activeFreelancer: Freelancer | null
  isReadOnly: boolean
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function useWorkspaceContext(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspaceContext must be used within WorkspaceProvider')
  }
  return context
}
