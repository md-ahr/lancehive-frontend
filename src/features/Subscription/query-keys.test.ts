import { describe, expect, it } from 'vitest'

import { subscriptionKeys } from './query-keys'

describe('subscriptionKeys', () => {
  it('returns stable key segments', () => {
    expect(subscriptionKeys.all).toEqual(['subscription'])
    expect(subscriptionKeys.detail()).toEqual(['subscription', 'detail'])
  })

  it('returns new array references for detail()', () => {
    expect(subscriptionKeys.detail()).not.toBe(subscriptionKeys.detail())
    expect(subscriptionKeys.detail()).toEqual(subscriptionKeys.detail())
  })
})
