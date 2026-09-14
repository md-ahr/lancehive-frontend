import { describe, expect, it } from 'vitest'

import { timeLogKeys } from './query-keys'

describe('timeLogKeys', () => {
  it('builds stable task list, detail, and project summary keys', () => {
    expect(timeLogKeys.taskLists()).toEqual(['time-logs', 'task-list'])
    expect(timeLogKeys.taskList('30')).toEqual(['time-logs', 'task-list', '30', {}])
    expect(timeLogKeys.taskList('30', { cursor: 'page-2' })).toEqual([
      'time-logs',
      'task-list',
      '30',
      { cursor: 'page-2' },
    ])
    expect(timeLogKeys.detail('40')).toEqual(['time-logs', 'detail', '40'])
    expect(timeLogKeys.projectSummary('20')).toEqual(['time-logs', 'project-summary', '20'])
  })
})
