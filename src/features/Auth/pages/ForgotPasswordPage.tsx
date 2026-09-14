import { AuthPageHeader } from '../components/AuthPageHeader'
import { AuthPageShell } from '../components/AuthPageShell'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'

export function ForgotPasswordPage() {
  return (
    <AuthPageShell>
      <AuthPageHeader
        title="Forgot password"
        description="Enter your email and we'll send you a reset link if an account exists."
      />
      <ForgotPasswordForm />
    </AuthPageShell>
  )
}
