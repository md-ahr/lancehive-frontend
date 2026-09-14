import { z } from 'zod'

export const checkoutFormSchema = z.object({
  plan_id: z.number().int().positive(),
  billing_interval: z.enum(['monthly', 'yearly']),
})

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>
