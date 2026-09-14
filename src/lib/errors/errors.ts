import type { ApiErrorBody } from '@/types/api'

import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: ApiErrorBody,
  ) {
    super(`API request failed with status ${status}`)
    this.name = 'ApiError'
  }
}

export function getErrorCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError)) {
    return undefined
  }
  return error.body.code
}

export type ValidationApiError = ApiError & {
  status: 422
  body: ApiErrorBody & { errors: Record<string, string[]> }
}

export function isValidationError(error: unknown): error is ValidationApiError {
  if (!(error instanceof ApiError) || error.status !== 422) {
    return false
  }
  return Boolean(error.body.errors)
}

const USER_MESSAGES: Record<string, string> = {
  unauthenticated: 'Your session has expired. Please sign in again.',
  forbidden: "You don't have permission to do that.",
  workspace_read_only: 'Your workspace is read-only. Renew your subscription to make changes.',
  super_admin_required: 'This action requires a super admin account.',
  not_found: 'The requested resource could not be found.',
  export_expired: 'This export has expired. Please generate a new one.',
  plan_limit_exceeded: 'You have reached your plan limit. Upgrade to continue.',
  invoice_not_editable: 'This invoice can no longer be edited.',
  too_many_requests: 'Too many requests. Please wait a moment and try again.',
}

export function getUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const code = getErrorCode(error)
    if (code && USER_MESSAGES[code]) {
      return USER_MESSAGES[code]
    }

    if (isValidationError(error)) {
      return 'Please fix the highlighted fields.'
    }

    if (error.body.message) {
      return error.body.message
    }

    if (error.status >= 500) {
      return 'Something went wrong. Try again.'
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong. Try again.'
}

export function mapValidationErrorsToForm<T extends FieldValues>(
  error: ApiError,
  setError: UseFormSetError<T>,
): void {
  const fieldErrors = error.body.errors
  if (!fieldErrors) {
    return
  }

  for (const [field, messages] of Object.entries(fieldErrors)) {
    const message = messages[0]
    if (!message) {
      continue
    }
    setError(field as Path<T>, { type: 'server', message })
  }
}
