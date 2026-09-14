import { describe, expect, it } from 'vitest'

import { invoiceKeys } from './query-keys'

describe('invoiceKeys', () => {
  it('builds stable list keys', () => {
    expect(invoiceKeys.list()).toEqual(['client-invoices', 'list', {}])
    expect(invoiceKeys.list({ cursor: 'page-2', status: 'draft' })).toEqual([
      'client-invoices',
      'list',
      { cursor: 'page-2', status: 'draft' },
    ])
  })

  it('builds project list and detail keys', () => {
    expect(invoiceKeys.projectList('20')).toEqual(['client-invoices', 'project-list', '20', {}])
    expect(invoiceKeys.detail('50')).toEqual(['client-invoices', 'detail', '50'])
  })
})
