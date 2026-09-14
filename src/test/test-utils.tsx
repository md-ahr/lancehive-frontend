import { type ReactElement, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  route?: string
  queryClient?: QueryClient
}

export function createWrapper(options: { route?: string; queryClient?: QueryClient } = {}) {
  const {
    route = '/',
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
  } = options

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const { route, queryClient, ...renderOptions } = options
  return render(ui, {
    wrapper: createWrapper({ route, queryClient }),
    ...renderOptions,
  })
}
