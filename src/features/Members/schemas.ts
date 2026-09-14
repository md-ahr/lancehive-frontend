import { z } from 'zod'

export const inviteMemberFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(255, 'Email must be at most 255 characters')
    .refine((value) => z.email().safeParse(value).success, {
      message: 'Enter a valid email',
    }),
  role: z.enum(['admin', 'member']),
})

export type InviteMemberFormValues = z.infer<typeof inviteMemberFormSchema>
