import { z } from 'zod'

const decimalString = z
  .string()
  .trim()
  .min(1, 'Required')
  .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, 'Must be 0 or greater')

export const createInvoiceFormSchema = z.object({
  due_date: z.string().optional(),
  notes: z.string().optional(),
  tax_rate: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === undefined || value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0),
      'Must be 0 or greater',
    ),
  prefill_unbilled_time: z.enum(['yes', 'no']),
})

export type CreateInvoiceFormValues = z.infer<typeof createInvoiceFormSchema>

export const addInvoiceItemFormSchema = z.object({
  description: z.string().trim().min(1, 'Description is required').max(255, 'Max 255 characters'),
  quantity: decimalString,
  rate: decimalString,
})

export type AddInvoiceItemFormValues = z.infer<typeof addInvoiceItemFormSchema>

export const recordPaymentFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Amount is required')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0.01, 'Minimum 0.01'),
  payment_method: z.enum(['manual', 'bank_transfer', 'cash', 'other']),
  reference: z.string().optional(),
  paid_at: z.string().min(1, 'Payment date is required'),
  notes: z.string().optional(),
})

export type RecordPaymentFormValues = z.infer<typeof recordPaymentFormSchema>
