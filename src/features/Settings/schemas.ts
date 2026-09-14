import { z } from 'zod'

export const userSettingsFormSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
  locale: z.enum(['en']),
})

export type UserSettingsFormValues = z.infer<typeof userSettingsFormSchema>

export const workspaceSettingsFormSchema = z.object({
  default_currency: z.string().length(3, 'Currency must be 3 characters'),
  invoice_number_prefix: z
    .string()
    .min(1, 'Prefix is required')
    .max(20, 'Prefix must be at most 20 characters'),
  default_tax_rate: z.string().nullable(),
  invoice_footer_notes: z.string().nullable(),
  business_name: z.string().nullable(),
  business_email: z.string().email('Invalid email').nullable().or(z.literal('')),
  business_address: z.string().nullable(),
})

export type WorkspaceSettingsFormValues = z.infer<typeof workspaceSettingsFormSchema>
