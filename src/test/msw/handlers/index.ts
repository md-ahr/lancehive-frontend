import { http, HttpResponse } from 'msw'

import { authHandlers } from './auth'
import { clientMembersHandlers } from './client-members'
import { clientsHandlers } from './clients'
import { invoicesHandlers } from './invoices'
import { membersHandlers } from './members'
import { portalHandlers } from './portal'
import { projectsHandlers } from './projects'
import { settingsHandlers } from './settings'
import { subscriptionHandlers } from './subscription'
import { tasksHandlers } from './tasks'
import { timeLogsHandlers } from './time-logs'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const handlers = [
  http.get(`${API_BASE_URL}/health`, () => HttpResponse.json({ status: 'ok' })),
  ...authHandlers,
  ...clientsHandlers,
  ...clientMembersHandlers,
  ...projectsHandlers,
  ...tasksHandlers,
  ...timeLogsHandlers,
  ...invoicesHandlers,
  ...membersHandlers,
  ...portalHandlers,
  ...settingsHandlers,
  ...subscriptionHandlers,
]
