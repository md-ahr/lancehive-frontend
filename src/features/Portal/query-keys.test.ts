import { describe, expect, it } from 'vitest'

import { portalKeys } from './query-keys'

describe('portalKeys', () => {
  it('builds stable portal query keys', () => {
    expect(portalKeys.client()).toEqual(['portal', 'client'])
    expect(portalKeys.projectList()).toEqual(['portal', 'projects', {}])
    expect(portalKeys.projectList({ cursor: 'cursor-2' })).toEqual([
      'portal',
      'projects',
      { cursor: 'cursor-2' },
    ])
    expect(portalKeys.invoiceList({ status: 'sent' })).toEqual([
      'portal',
      'invoices',
      { status: 'sent' },
    ])
  })
})
