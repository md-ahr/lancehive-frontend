import { Route, Routes } from 'react-router-dom'

import { AuthLayout } from '@/features/Auth/components/AuthLayout'
import { PersonaRedirect } from '@/features/Auth/components/PersonaRedirect'
import { RequireAuth } from '@/features/Auth/components/RequireAuth'
import { ForgotPasswordPage } from '@/features/Auth/pages/ForgotPasswordPage'
import { LoginPage } from '@/features/Auth/pages/LoginPage'
import { ResetPasswordPage } from '@/features/Auth/pages/ResetPasswordPage'
import { NotFoundPage } from '@/features/Layout/pages/NotFoundPage'
import { PlaceholderPage } from '@/features/Layout/pages/PlaceholderPage'

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
        <Route path="/app" element={<PlaceholderPage title="App Dashboard" />} />
        <Route path="/app/*" element={<PlaceholderPage title="App" />} />

        <Route path="/portal" element={<PlaceholderPage title="Portal Dashboard" />} />
        <Route path="/portal/*" element={<PlaceholderPage title="Portal" />} />

        <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />
        <Route path="/admin/*" element={<PlaceholderPage title="Admin" />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
