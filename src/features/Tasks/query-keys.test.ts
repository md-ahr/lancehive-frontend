import { describe, expect, it } from 'vitest'

import { taskKeys } from './query-keys'

describe('taskKeys', () => {
  it('builds stable project list and detail keys', () => {
    expect(taskKeys.projectLists()).toEqual(['tasks', 'project-list'])
    expect(taskKeys.projectList('20')).toEqual(['tasks', 'project-list', '20', {}])
    expect(taskKeys.projectList('20', { cursor: 'page-2', status: 'todo' })).toEqual([
      'tasks',
      'project-list',
      '20',
      { cursor: 'page-2', status: 'todo' },
    ])
    expect(taskKeys.detail('30')).toEqual(['tasks', 'detail', '30'])
  })
})
