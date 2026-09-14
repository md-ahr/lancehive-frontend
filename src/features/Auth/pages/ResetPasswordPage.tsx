import { AuthPageHeader } from '../components/AuthPageHeader'
import { AuthPageShell } from '../components/AuthPageShell'
import { ResetPasswordForm } from '../components/ResetPasswordForm'

export function ResetPasswordPage() {
  return (
    <AuthPageShell>
      <AuthPageHeader
        title="Reset password"
        description="Choose a new password for your account."
      />
      <ResetPasswordForm />
    </AuthPageShell>
  )
}
