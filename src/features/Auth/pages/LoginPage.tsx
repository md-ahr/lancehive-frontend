import { useNavigate } from 'react-router-dom'

import { AuthPageHeader } from '../components/AuthPageHeader'
import { AuthPageShell } from '../components/AuthPageShell'
import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <AuthPageShell>
      <AuthPageHeader
        title="Sign in"
        description="Use your LanceHive account credentials to continue."
      />
      <LoginForm onSuccess={() => navigate('/', { replace: true })} />
    </AuthPageShell>
  )
}
