import { describe, expect, it } from 'vitest'

import { authKeys } from './query-keys'

describe('authKeys', () => {
  it('exposes stable key segments', () => {
    expect(authKeys.all).toEqual(['auth'])
    expect(authKeys.me()).toEqual(['auth', 'me'])
  })

  it('returns new array references for me()', () => {
    expect(authKeys.me()).not.toBe(authKeys.me())
    expect(authKeys.me()).toEqual(authKeys.me())
  })
})
