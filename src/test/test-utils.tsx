import { type ReactElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { TooltipProvider } from '@/components/ui/tooltip'
import { WorkspaceProvider } from '@/features/Workspace/components/WorkspaceProvider'

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  route?: string
  queryClient?: QueryClient
  withWorkspace?: boolean
}

function createAppWrapper(options: {
  route?: string
  queryClient?: QueryClient
  withWorkspace?: boolean
} = {}) {
  const {
    route = '/',
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
    withWorkspace = false,
  } = options

  return function Wrapper({ children }: { children: ReactNode }) {
    const content = withWorkspace ? <WorkspaceProvider>{children}</WorkspaceProvider> : children

    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <MemoryRouter initialEntries={[route]}>{content}</MemoryRouter>
        </TooltipProvider>
      </QueryClientProvider>
    )
  }
}

export function createWrapper(options: {
  route?: string
  queryClient?: QueryClient
  withWorkspace?: boolean
} = {}) {
  return createAppWrapper(options)
}

export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const { route, queryClient, withWorkspace, ...renderOptions } = options
  return render(ui, {
    wrapper: createAppWrapper({ route, queryClient, withWorkspace }),
    ...renderOptions,
  })
}
