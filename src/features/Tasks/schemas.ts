import { z } from 'zod'

const decimalPattern = /^\d+(\.\d{1,2})?$/

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  status: z.enum(['todo', 'in_progress', 'done']),
  due_date: z.string(),
  estimated_hours: z
    .string()
    .refine((value) => value === '' || (decimalPattern.test(value) && Number(value) >= 0), {
      message: 'Enter valid estimated hours',
    }),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
