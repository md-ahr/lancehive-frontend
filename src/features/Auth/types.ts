import type { MeResponse, User } from '@/types/api'

export type { MeResponse }

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: User
}

export type ForgotPasswordRequest = {
  email: string
}

export type ResetPasswordRequest = {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export type MessageResponse = {
  message: string
}
