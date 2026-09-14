import { describe, expect, it } from 'vitest'

import { projectKeys } from './query-keys'

describe('projectKeys', () => {
  it('builds stable list, client list, and detail keys', () => {
    expect(projectKeys.lists()).toEqual(['projects', 'list'])
    expect(projectKeys.list()).toEqual(['projects', 'list', {}])
    expect(projectKeys.list({ cursor: 'cursor-2', client_id: '10' })).toEqual([
      'projects',
      'list',
      { cursor: 'cursor-2', client_id: '10' },
    ])
    expect(projectKeys.clientList('10')).toEqual(['projects', 'client-list', '10', {}])
    expect(projectKeys.clientList('10', { cursor: 'page-2' })).toEqual([
      'projects',
      'client-list',
      '10',
      { cursor: 'page-2' },
    ])
    expect(projectKeys.detail('20')).toEqual(['projects', 'detail', '20'])
  })
})
