import { describe, expect, it } from 'vitest'

import { memberKeys } from './query-keys'

describe('memberKeys', () => {
  it('builds stable list keys with optional cursor', () => {
    expect(memberKeys.lists()).toEqual(['members', 'list'])
    expect(memberKeys.list()).toEqual(['members', 'list', { cursor: undefined }])
    expect(memberKeys.list('cursor-2')).toEqual(['members', 'list', { cursor: 'cursor-2' }])
  })
})
