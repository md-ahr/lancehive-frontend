import { http, HttpResponse } from 'msw'

import { authHandlers } from './auth'
import { membersHandlers } from './members'
import { settingsHandlers } from './settings'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const handlers = [
  http.get(`${API_BASE_URL}/health`, () => HttpResponse.json({ status: 'ok' })),
  ...authHandlers,
  ...membersHandlers,
  ...settingsHandlers,
]
