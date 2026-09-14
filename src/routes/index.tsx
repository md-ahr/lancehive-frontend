import { Navigate, Route, Routes } from 'react-router-dom'

import { NotFoundPage } from '@/features/Layout/pages/NotFoundPage'
import { PlaceholderPage } from '@/features/Layout/pages/PlaceholderPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<PlaceholderPage title="Login" />} />
      <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />
      <Route path="/reset-password" element={<PlaceholderPage title="Reset Password" />} />

      <Route path="/app" element={<PlaceholderPage title="App Dashboard" />} />
      <Route path="/app/*" element={<PlaceholderPage title="App" />} />

      <Route path="/portal" element={<PlaceholderPage title="Portal Dashboard" />} />
      <Route path="/portal/*" element={<PlaceholderPage title="Portal" />} />

      <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />
      <Route path="/admin/*" element={<PlaceholderPage title="Admin" />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
