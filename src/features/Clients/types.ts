import type { PaginatedResponse } from '@/types/api'

export type ClientStatus = 'active' | 'archived'

export type ClientResource = {
  id: number
  name: string
  status: ClientStatus
  contact_email: string | null
  created_at: string
  updated_at: string
}

export type ClientListResponse = PaginatedResponse<ClientResource>

export type CreateClientRequest = {
  name: string
  contact_email?: string
}

export type UpdateClientRequest = {
  name?: string
  contact_email?: string | null
  status?: ClientStatus
}
