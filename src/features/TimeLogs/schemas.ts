import { z } from 'zod'

const decimalPattern = /^\d+(\.\d{1,2})?$/

export const timeLogFormSchema = z.object({
  hours: z
    .string()
    .min(1, 'Hours is required')
    .refine((value) => decimalPattern.test(value), {
      message: 'Enter valid hours',
    })
    .refine((value) => Number(value) >= 0.01, {
      message: 'Hours must be at least 0.01',
    })
    .refine((value) => Number(value) <= 24, {
      message: 'Hours cannot exceed 24',
    }),
  description: z.string().max(1000, 'Description must be at most 1000 characters'),
  logged_at: z.string().min(1, 'Date and time is required'),
})

export type TimeLogFormValues = z.infer<typeof timeLogFormSchema>
