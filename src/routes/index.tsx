import { Route, Routes } from 'react-router-dom'

import { AuthLayout } from '@/features/Auth/components/AuthLayout'
import { PersonaRedirect } from '@/features/Auth/components/PersonaRedirect'
import { RequireAuth } from '@/features/Auth/components/RequireAuth'
import { RequireFreelancer } from '@/features/Auth/components/RequireFreelancer'
import { ForgotPasswordPage } from '@/features/Auth/pages/ForgotPasswordPage'
import { LoginPage } from '@/features/Auth/pages/LoginPage'
import { ResetPasswordPage } from '@/features/Auth/pages/ResetPasswordPage'
import { ClientDetailPage } from '@/features/Clients/pages/ClientDetailPage'
import { ClientsPage } from '@/features/Clients/pages/ClientsPage'
import { AppLayout } from '@/features/Layout/components/AppLayout'
import { DashboardPage } from '@/features/Layout/pages/DashboardPage'
import { NotFoundPage } from '@/features/Layout/pages/NotFoundPage'
import { PlaceholderPage } from '@/features/Layout/pages/PlaceholderPage'
import { MembersPage } from '@/features/Members/pages/MembersPage'
import { ProjectDetailPage } from '@/features/Projects/pages/ProjectDetailPage'
import { ProjectsPage } from '@/features/Projects/pages/ProjectsPage'
import { UserSettingsPage } from '@/features/Settings/pages/UserSettingsPage'
import { WorkspaceSettingsPage } from '@/features/Settings/pages/WorkspaceSettingsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PersonaRedirect />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<RequireFreelancer />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:id" element={<ClientDetailPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="invoices" element={<PlaceholderPage title="Invoices" />} />
            <Route path="invoices/:id" element={<PlaceholderPage title="Invoice detail" />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="settings" element={<UserSettingsPage />} />
            <Route path="workspace" element={<WorkspaceSettingsPage />} />
            <Route path="subscription" element={<PlaceholderPage title="Subscription" />} />
          </Route>
        </Route>

        <Route path="/portal" element={<PlaceholderPage title="Portal Dashboard" />} />
        <Route path="/portal/*" element={<PlaceholderPage title="Portal" />} />

        <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />
        <Route path="/admin/*" element={<PlaceholderPage title="Admin" />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
