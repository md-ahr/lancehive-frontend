import { afterEach, describe, expect, it, vi } from 'vitest'

import { redirectToCheckout } from './redirect-to-checkout'

describe('redirectToCheckout', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('assigns checkout url to window.location', () => {
    const assign = vi.fn()
    vi.stubGlobal('location', { assign })

    redirectToCheckout('https://checkout.stripe.com/test-session')

    expect(assign).toHaveBeenCalledWith('https://checkout.stripe.com/test-session')
  })
})
