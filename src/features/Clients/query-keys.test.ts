import { describe, expect, it } from 'vitest'

import { clientKeys, clientMemberKeys } from './query-keys'

describe('clientKeys', () => {
  it('builds stable list and detail keys', () => {
    expect(clientKeys.lists()).toEqual(['clients', 'list'])
    expect(clientKeys.list()).toEqual(['clients', 'list', { cursor: undefined }])
    expect(clientKeys.list('cursor-2')).toEqual(['clients', 'list', { cursor: 'cursor-2' }])
    expect(clientKeys.detail('10')).toEqual(['clients', 'detail', '10'])
  })
})

describe('clientMemberKeys', () => {
  it('builds stable list keys with client id and optional cursor', () => {
    expect(clientMemberKeys.lists()).toEqual(['client-members', 'list'])
    expect(clientMemberKeys.list('10')).toEqual([
      'client-members',
      'list',
      '10',
      { cursor: undefined },
    ])
    expect(clientMemberKeys.list('10', 'cursor-2')).toEqual([
      'client-members',
      'list',
      '10',
      { cursor: 'cursor-2' },
    ])
  })
})
