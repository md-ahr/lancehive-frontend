import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { PlanResource } from '@/features/Subscription/types'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ApiError,
  getUserMessage,
  isValidationError,
  mapValidationErrorsToForm,
} from '@/lib/errors'

import { useCreatePlan } from '../hooks/useCreatePlan'
import { useUpdatePlan } from '../hooks/useUpdatePlan'
import { planFormSchema, type PlanFormValues } from '../schemas'

type PlanFormDialogProps = {
  plan?: PlanResource
  open: boolean
  onOpenChange: (open: boolean) => void
}

function toFormValues(plan?: PlanResource): PlanFormValues {
  return {
    name: plan?.name ?? '',
    slug: plan?.slug ?? '',
    price_monthly: plan?.price_monthly ?? '',
    price_yearly: plan?.price_yearly ?? '',
    currency: plan?.currency ?? 'BDT',
    max_clients:
      plan?.max_clients !== null && plan?.max_clients !== undefined ? String(plan.max_clients) : '',
    max_projects:
      plan?.max_projects !== null && plan?.max_projects !== undefined
        ? String(plan.max_projects)
        : '',
    max_team_members:
      plan?.max_team_members !== null && plan?.max_team_members !== undefined
        ? String(plan.max_team_members)
        : '',
    is_custom: plan?.is_custom ?? false,
    is_active: plan?.is_active ?? true,
    sort_order:
      plan?.sort_order !== null && plan?.sort_order !== undefined ? String(plan.sort_order) : '',
  }
}

function toPayload(values: PlanFormValues) {
  return {
    name: values.name,
    slug: values.slug,
    ...(values.price_monthly ? { price_monthly: values.price_monthly } : {}),
    ...(values.price_yearly ? { price_yearly: values.price_yearly } : {}),
    ...(values.currency ? { currency: values.currency } : {}),
    max_clients: values.max_clients ? Number(values.max_clients) : null,
    max_projects: values.max_projects ? Number(values.max_projects) : null,
    max_team_members: values.max_team_members ? Number(values.max_team_members) : null,
    is_custom: values.is_custom,
    is_active: values.is_active,
    ...(values.sort_order ? { sort_order: Number(values.sort_order) } : {}),
  }
}

export function PlanFormDialog({ plan, open, onOpenChange }: PlanFormDialogProps) {
  const createPlan = useCreatePlan()
  const updatePlan = useUpdatePlan()
  const isEditing = Boolean(plan)
  const mutation = isEditing ? updatePlan : createPlan

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: toFormValues(plan),
  })

  useEffect(() => {
    if (open) {
      form.reset(toFormValues(plan))
    }
  }, [open, plan, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = toPayload(values)

    try {
      if (isEditing && plan) {
        await updatePlan.mutateAsync({ id: String(plan.id), ...payload })
        toast.success('Plan updated')
      } else {
        await createPlan.mutateAsync(payload)
        toast.success('Plan created')
      }
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ApiError && isValidationError(error)) {
        mapValidationErrorsToForm(error, form.setError)
        return
      }

      toast.error(getUserMessage(error))
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit plan' : 'Create plan'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update pricing tiers and limits for this plan.'
              : 'Add a new platform pricing tier.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)} noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price_monthly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly price</FormLabel>
                    <FormControl>
                      <Input {...field} inputMode="decimal" className="tabular-nums" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_yearly"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly price</FormLabel>
                    <FormControl>
                      <Input {...field} inputMode="decimal" className="tabular-nums" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="max_clients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max clients</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} placeholder="Unlimited" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_projects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max projects</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} placeholder="Unlimited" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_team_members"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max members</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} placeholder="Unlimited" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort order</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Active for new signups</FormLabel>
                    <Select
                      value={field.value ? 'true' : 'false'}
                      onValueChange={(value) => field.onChange(value === 'true')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_custom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom plan</FormLabel>
                    <Select
                      value={field.value ? 'true' : 'false'}
                      onValueChange={(value) => field.onChange(value === 'true')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {isEditing ? 'Save changes' : 'Create plan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
