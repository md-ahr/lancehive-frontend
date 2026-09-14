import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

import { TooltipProvider } from '@/components/ui/tooltip'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'

export type TestProvidersWrapperProps = {
  children?: ReactNode
  route?: string
  queryClient?: QueryClient
  withWorkspace?: boolean
}

export function TestProvidersWrapper({
  children,
  route = '/',
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  withWorkspace = false,
}: TestProvidersWrapperProps) {
  const content = withWorkspace ? <WorkspaceProvider>{children}</WorkspaceProvider> : children

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MemoryRouter initialEntries={[route]}>{content}</MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
