import { describe, expect, it } from 'vitest'

import { adminFreelancerKeys, adminPlanKeys } from './query-keys'

describe('adminFreelancerKeys', () => {
  it('builds stable list keys with optional cursor and status', () => {
    expect(adminFreelancerKeys.lists()).toEqual(['admin-freelancers', 'list'])
    expect(adminFreelancerKeys.list()).toEqual([
      'admin-freelancers',
      'list',
      { cursor: undefined, status: undefined },
    ])
    expect(adminFreelancerKeys.list('cursor-2', 'active')).toEqual([
      'admin-freelancers',
      'list',
      { cursor: 'cursor-2', status: 'active' },
    ])
    expect(adminFreelancerKeys.detail('5')).toEqual(['admin-freelancers', 'detail', '5'])
  })
})

describe('adminPlanKeys', () => {
  it('builds stable list keys with optional active filter', () => {
    expect(adminPlanKeys.lists()).toEqual(['admin-plans', 'list'])
    expect(adminPlanKeys.list()).toEqual(['admin-plans', 'list', { isActive: undefined }])
    expect(adminPlanKeys.list(true)).toEqual(['admin-plans', 'list', { isActive: true }])
  })
})
