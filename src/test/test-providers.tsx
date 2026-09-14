import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

import { TooltipProvider } from '@/components/ui/tooltip'
import { PortalProvider } from '@/features/Portal/components/PortalProvider'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'

export type TestProvidersWrapperProps = {
  children?: ReactNode
  route?: string
  queryClient?: QueryClient
  withWorkspace?: boolean
  withPortal?: boolean
}

export function TestProvidersWrapper({
  children,
  route = '/',
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  withWorkspace = false,
  withPortal = false,
}: TestProvidersWrapperProps) {
  let content = children

  if (withWorkspace) {
    content = <WorkspaceProvider>{content}</WorkspaceProvider>
  }

  if (withPortal) {
    content = <PortalProvider>{content}</PortalProvider>
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MemoryRouter initialEntries={[route]}>{content}</MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
