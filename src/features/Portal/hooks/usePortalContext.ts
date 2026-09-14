import { createContext, useContext } from 'react'

import type { Client, ClientMembership } from '@/types/api'

export type PortalContextValue = {
  clientId: string | null
  setClientId: (id: string) => void
  memberships: ClientMembership[]
  activeClient: Client | null
}

export const PortalContext = createContext<PortalContextValue | null>(null)

export function usePortalContext(): PortalContextValue {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error('usePortalContext must be used within PortalProvider')
  }
  return context
}
