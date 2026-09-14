import type { ApiErrorBody } from '@/types/api'

import { getToken } from '../auth-storage'
import { ApiError } from '../errors'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

type RequestOptions = RequestInit & {
  freelancerId?: string
  clientId?: string
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { freelancerId, clientId, headers, ...init } = options
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(freelancerId ? { 'X-Freelancer-Id': freelancerId } : {}),
      ...(clientId ? { 'X-Client-Id': clientId } : {}),
      ...headers,
    },
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorBody
    throw new ApiError(response.status, body)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}
