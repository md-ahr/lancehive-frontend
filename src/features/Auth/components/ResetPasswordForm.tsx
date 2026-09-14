import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'

import { ErrorAlert } from '@/components/ErrorAlert'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ApiError, isValidationError, mapValidationErrorsToForm } from '@/lib/errors'

import { useResetPassword } from '../hooks/useResetPassword'
import { resetPasswordFormSchema, type ResetPasswordFormValues } from '../schemas'
import { AuthFooterLink } from './AuthFooterLink'

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams()
  const resetPassword = useResetPassword()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token: searchParams.get('token') ?? '',
      email: searchParams.get('email') ?? '',
      password: '',
      password_confirmation: '',
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await resetPassword.mutateAsync(values)
    } catch (error) {
      if (error instanceof ApiError && isValidationError(error)) {
        mapValidationErrorsToForm(error, form.setError)
      }
    }
  })

  const apiError =
    resetPassword.error instanceof ApiError && !isValidationError(resetPassword.error)
      ? resetPassword.error
      : null

  if (resetPassword.isSuccess) {
    return (
      <div className="space-y-5">
        <Alert>
          <AlertTitle>Password updated</AlertTitle>
          <AlertDescription>
            Your password has been reset. You can sign in with your new password.
          </AlertDescription>
        </Alert>
        <AuthFooterLink to="/login">Back to sign in</AuthFooterLink>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        {apiError ? <ErrorAlert error={apiError} /> : null}

        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reset token</FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Paste token from your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="you@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={resetPassword.isPending}>
          {resetPassword.isPending ? 'Resetting…' : 'Reset password'}
        </Button>

        <AuthFooterLink to="/login">Back to sign in</AuthFooterLink>
      </form>
    </Form>
  )
}
