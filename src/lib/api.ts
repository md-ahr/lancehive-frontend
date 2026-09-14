const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

type RequestOptions = RequestInit & {
  freelancerId?: string
  clientId?: string
}

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { freelancerId, clientId, headers, ...init } = options
  const token = getAuthToken()

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
    const error = await response.json().catch(() => ({}))
    throw new ApiError(response.status, error)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API request failed with status ${status}`)
    this.name = 'ApiError'
  }
}
