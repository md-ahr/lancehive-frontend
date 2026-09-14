import { describe, expect, it } from 'vitest'

import { settingsKeys } from './query-keys'

describe('settingsKeys', () => {
  it('builds stable me and workspace keys', () => {
    expect(settingsKeys.me()).toEqual(['settings', 'me'])
    expect(settingsKeys.workspace()).toEqual(['settings', 'workspace'])
  })
})
