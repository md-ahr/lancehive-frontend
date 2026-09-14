import { beforeEach, describe, expect, it } from 'vitest'

import { clearToken, getToken, setToken } from './auth-storage'

describe('auth-storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('set/get/clear token cycle', () => {
    expect(getToken()).toBeNull()

    setToken('test-token')
    expect(getToken()).toBe('test-token')

    clearToken()
    expect(getToken()).toBeNull()
  })
})
