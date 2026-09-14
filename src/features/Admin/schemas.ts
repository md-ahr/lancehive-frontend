import { z } from 'zod'

export const createFreelancerFormSchema = z.object({
  workspace_name: z
    .string()
    .min(1, 'Workspace name is required')
    .max(255, 'Workspace name must be at most 255 characters'),
  owner_name: z
    .string()
    .min(1, 'Owner name is required')
    .max(255, 'Owner name must be at most 255 characters'),
  owner_email: z
    .string()
    .min(1, 'Owner email is required')
    .max(255, 'Email must be at most 255 characters')
    .refine((value) => z.email().safeParse(value).success, {
      message: 'Enter a valid email',
    }),
  plan_id: z.string().optional(),
  trial_days: z.string().optional(),
})

export type CreateFreelancerFormValues = z.infer<typeof createFreelancerFormSchema>

export const planFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug must be at most 255 characters'),
  price_monthly: z.string().optional(),
  price_yearly: z.string().optional(),
  currency: z.string().max(3, 'Currency must be 3 characters').optional(),
  max_clients: z.string().optional(),
  max_projects: z.string().optional(),
  max_team_members: z.string().optional(),
  is_custom: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.string().optional(),
})

export type PlanFormValues = z.infer<typeof planFormSchema>

export const subscriptionOverrideFormSchema = z.object({
  plan_id: z.string().min(1, 'Plan is required'),
  provider: z.enum(['manual', 'stripe']),
})

export type SubscriptionOverrideFormValues = z.infer<typeof subscriptionOverrideFormSchema>
