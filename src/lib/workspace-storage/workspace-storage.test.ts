import { beforeEach, describe, expect, it } from 'vitest'

import { clearFreelancerId, getFreelancerId, setFreelancerId } from './workspace-storage'

describe('workspace-storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists and reads freelancer id', () => {
    setFreelancerId('42')
    expect(getFreelancerId()).toBe('42')
  })

  it('clears freelancer id', () => {
    setFreelancerId('42')
    clearFreelancerId()
    expect(getFreelancerId()).toBeNull()
  })
})
