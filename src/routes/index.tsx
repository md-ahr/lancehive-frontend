import { Route, Routes } from 'react-router-dom'

import { AdminDashboardPage } from '@/features/Admin/pages/AdminDashboardPage'
import { FreelancersPage } from '@/features/Admin/pages/FreelancersPage'
import { PlansPage } from '@/features/Admin/pages/PlansPage'
import { AuthLayout } from '@/features/Auth/components/AuthLayout'
import { PersonaRedirect } from '@/features/Auth/components/PersonaRedirect'
import { RequireAuth } from '@/features/Auth/components/RequireAuth'
import { RequireClient } from '@/features/Auth/components/RequireClient'
import { RequireFreelancer } from '@/features/Auth/components/RequireFreelancer'
import { RequireSuperAdmin } from '@/features/Auth/components/RequireSuperAdmin'
import { ForgotPasswordPage } from '@/features/Auth/pages/ForgotPasswordPage'
import { LoginPage } from '@/features/Auth/pages/LoginPage'
import { ResetPasswordPage } from '@/features/Auth/pages/ResetPasswordPage'
import { ClientDetailPage } from '@/features/Clients/pages/ClientDetailPage'
import { ClientsPage } from '@/features/Clients/pages/ClientsPage'
import { InvoiceDetailPage } from '@/features/Invoices/pages/InvoiceDetailPage'
import { InvoicesPage } from '@/features/Invoices/pages/InvoicesPage'
import { AdminLayout } from '@/features/Layout/components/AdminLayout'
import { AppLayout } from '@/features/Layout/components/AppLayout'
import { DashboardPage } from '@/features/Layout/pages/DashboardPage'
import { NotFoundPage } from '@/features/Layout/pages/NotFoundPage'
import { MembersPage } from '@/features/Members/pages/MembersPage'
import { PortalLayout } from '@/features/Portal/components/PortalLayout'
import { PortalDashboardPage } from '@/features/Portal/pages/PortalDashboardPage'
import { PortalInvoicesPage } from '@/features/Portal/pages/PortalInvoicesPage'
import { PortalProjectsPage } from '@/features/Portal/pages/PortalProjectsPage'
import { ProjectDetailPage } from '@/features/Projects/pages/ProjectDetailPage'
import { ProjectsPage } from '@/features/Projects/pages/ProjectsPage'
import { UserSettingsPage } from '@/features/Settings/pages/UserSettingsPage'
import { WorkspaceSettingsPage } from '@/features/Settings/pages/WorkspaceSettingsPage'
import { SubscriptionPage } from '@/features/Subscription/pages/SubscriptionPage'

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
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="invoices/:id" element={<InvoiceDetailPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="settings" element={<UserSettingsPage />} />
            <Route path="workspace" element={<WorkspaceSettingsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
          </Route>
        </Route>

        <Route element={<RequireClient />}>
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<PortalDashboardPage />} />
            <Route path="projects" element={<PortalProjectsPage />} />
            <Route path="invoices" element={<PortalInvoicesPage />} />
          </Route>
        </Route>

        <Route element={<RequireSuperAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="freelancers" element={<FreelancersPage />} />
            <Route path="plans" element={<PlansPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
