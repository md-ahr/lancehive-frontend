import { z } from 'zod'

function requiredEmail() {
  return z
    .string()
    .min(1, 'Email is required')
    .refine((value) => z.email().safeParse(value).success, {
      message: 'Enter a valid email',
    })
}

export const loginFormSchema = z.object({
  email: requiredEmail(),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

export const forgotPasswordFormSchema = z.object({
  email: requiredEmail(),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>

export const resetPasswordFormSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    email: requiredEmail(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
