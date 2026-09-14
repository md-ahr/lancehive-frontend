import { http, HttpResponse } from 'msw'

import { authHandlers } from './auth'
import { clientsHandlers } from './clients'
import { membersHandlers } from './members'
import { projectsHandlers } from './projects'
import { settingsHandlers } from './settings'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const handlers = [
  http.get(`${API_BASE_URL}/health`, () => HttpResponse.json({ status: 'ok' })),
  ...authHandlers,
  ...clientsHandlers,
  ...projectsHandlers,
  ...membersHandlers,
  ...settingsHandlers,
]
