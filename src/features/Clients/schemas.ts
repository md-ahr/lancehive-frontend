import { z } from 'zod'

export const clientFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters'),
  contact_email: z
    .string()
    .max(255, 'Email must be at most 255 characters')
    .refine((value) => value === '' || z.email().safeParse(value).success, {
      message: 'Enter a valid email',
    }),
})

export type ClientFormValues = z.infer<typeof clientFormSchema>
