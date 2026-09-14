import { useState, type ReactNode } from 'react'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'

import { TooltipProvider } from '@/components/ui/tooltip'
import { clearToken } from '@/lib/auth-storage'
import { getErrorCode } from '@/lib/errors'

function handleGlobalQueryError(error: unknown): void {
  const code = getErrorCode(error)
  if (code === 'unauthenticated') {
    clearToken()
    window.location.assign('/login')
  }
}

function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: handleGlobalQueryError,
    }),
    mutationCache: new MutationCache({
      onError: handleGlobalQueryError,
    }),
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })
}

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          {children}
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
