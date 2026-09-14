import { describe, expect, it, vi } from 'vitest'

import {
  ApiError,
  getErrorCode,
  getUserMessage,
  isValidationError,
  mapValidationErrorsToForm,
} from './errors'

describe('error helpers', () => {
  it('getErrorCode returns code from ApiError body', () => {
    const error = new ApiError(403, { code: 'forbidden', message: 'Denied' })
    expect(getErrorCode(error)).toBe('forbidden')
  })

  it('getErrorCode returns undefined for non-ApiError', () => {
    expect(getErrorCode(new Error('fail'))).toBeUndefined()
  })

  it('isValidationError identifies 422 with errors object', () => {
    const error = new ApiError(422, {
      message: 'Validation failed',
      errors: { email: ['Invalid email'] },
    })
    expect(isValidationError(error)).toBe(true)
  })

  it('isValidationError rejects non-validation errors', () => {
    expect(isValidationError(new ApiError(422, { code: 'plan_limit_exceeded' }))).toBe(false)
    expect(isValidationError(new ApiError(500, {}))).toBe(false)
  })

  it('getUserMessage maps cheat sheet codes', () => {
    expect(getUserMessage(new ApiError(401, { code: 'unauthenticated' }))).toMatch(/sign in/i)
    expect(getUserMessage(new ApiError(403, { code: 'forbidden' }))).toMatch(/permission/i)
    expect(getUserMessage(new ApiError(403, { code: 'workspace_read_only' }))).toMatch(/read-only/i)
    expect(getUserMessage(new ApiError(403, { code: 'super_admin_required' }))).toMatch(
      /super admin/i,
    )
    expect(getUserMessage(new ApiError(404, { code: 'not_found' }))).toMatch(/not be found/i)
    expect(getUserMessage(new ApiError(422, { code: 'plan_limit_exceeded' }))).toMatch(
      /plan limit/i,
    )
    expect(getUserMessage(new ApiError(429, { code: 'too_many_requests' }))).toMatch(
      /too many requests/i,
    )
  })

  it('getUserMessage handles validation envelope without code', () => {
    const error = new ApiError(422, {
      message: 'The name field is required.',
      errors: { name: ['The name field is required.'] },
    })
    expect(getUserMessage(error)).toBe('Please fix the highlighted fields.')
  })

  it('getUserMessage falls back for 5xx', () => {
    expect(getUserMessage(new ApiError(500, {}))).toBe('Something went wrong. Try again.')
  })

  it('mapValidationErrorsToForm maps first message per field', () => {
    const setError = vi.fn()
    const error = new ApiError(422, {
      errors: {
        email: ['Invalid email', 'Required'],
        name: ['Name is required'],
      },
    })

    mapValidationErrorsToForm(error, setError)

    expect(setError).toHaveBeenCalledWith('email', { type: 'server', message: 'Invalid email' })
    expect(setError).toHaveBeenCalledWith('name', { type: 'server', message: 'Name is required' })
  })
})
