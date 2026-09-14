import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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

import { useForgotPassword } from '../hooks/useForgotPassword'
import { forgotPasswordFormSchema, type ForgotPasswordFormValues } from '../schemas'
import { AuthFooterLink } from './AuthFooterLink'

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await forgotPassword.mutateAsync(values)
    } catch (error) {
      if (error instanceof ApiError && isValidationError(error)) {
        mapValidationErrorsToForm(error, form.setError)
      }
    }
  })

  if (forgotPassword.isSuccess) {
    return (
      <div className="space-y-5">
        <Alert>
          <AlertTitle>Check your email</AlertTitle>
          <AlertDescription>
            If your email is registered, you will receive a password reset link shortly.
          </AlertDescription>
        </Alert>
        <AuthFooterLink to="/login">Back to sign in</AuthFooterLink>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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

        <Button type="submit" size="lg" className="w-full" disabled={forgotPassword.isPending}>
          {forgotPassword.isPending ? 'Sending…' : 'Send reset link'}
        </Button>

        <AuthFooterLink to="/login">Back to sign in</AuthFooterLink>
      </form>
    </Form>
  )
}
