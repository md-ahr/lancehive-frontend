import { describe, expect, it } from 'vitest'

import { clientKeys } from './query-keys'

describe('clientKeys', () => {
  it('builds stable list and detail keys', () => {
    expect(clientKeys.lists()).toEqual(['clients', 'list'])
    expect(clientKeys.list()).toEqual(['clients', 'list', { cursor: undefined }])
    expect(clientKeys.list('cursor-2')).toEqual(['clients', 'list', { cursor: 'cursor-2' }])
    expect(clientKeys.detail('10')).toEqual(['clients', 'detail', '10'])
  })
})
