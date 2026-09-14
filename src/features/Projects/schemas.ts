import { z } from 'zod'

const decimalPattern = /^\d+(\.\d{1,2})?$/

export const projectFormSchema = z.object({
  client_id: z.string().min(1, 'Client is required'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters'),
  hourly_rate: z
    .string()
    .min(1, 'Hourly rate is required')
    .refine((value) => decimalPattern.test(value) && Number(value) >= 0, {
      message: 'Enter a valid hourly rate',
    }),
  currency: z.string().refine((value) => value === '' || value.length === 3, {
    message: 'Currency must be a 3-letter code',
  }),
  deadline: z.string(),
  status: z.enum(['active', 'on_hold', 'completed']),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>
