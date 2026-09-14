import { createElement, type ReactElement, type ReactNode } from 'react'

import { QueryClient } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'

import { TestProvidersWrapper, type TestProvidersWrapperProps } from './test-providers'

type WrapperOptions = Pick<TestProvidersWrapperProps, 'route' | 'queryClient' | 'withWorkspace'>

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & WrapperOptions

function buildWrapper(options: WrapperOptions = {}) {
  const {
    route = '/',
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }),
    withWorkspace = false,
  } = options

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(TestProvidersWrapper, { route, queryClient, withWorkspace }, children)
  }
}

export function createWrapper(options: WrapperOptions = {}) {
  return buildWrapper(options)
}

export function renderWithProviders(ui: ReactElement, options: RenderWithProvidersOptions = {}) {
  const { route, queryClient, withWorkspace, ...renderOptions } = options
  return render(ui, {
    wrapper: buildWrapper({ route, queryClient, withWorkspace }),
    ...renderOptions,
  })
}
