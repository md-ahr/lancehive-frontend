import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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

import type { FreelancerResource } from '../types'

import { useOverrideSubscription } from '../hooks/useOverrideSubscription'
import { usePlanList } from '../hooks/usePlanList'
import { subscriptionOverrideFormSchema, type SubscriptionOverrideFormValues } from '../schemas'

type SubscriptionOverrideDialogProps = {
  freelancer: FreelancerResource
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultValues: SubscriptionOverrideFormValues = {
  plan_id: '',
  provider: 'manual',
}

export function SubscriptionOverrideDialog({
  freelancer,
  open,
  onOpenChange,
}: SubscriptionOverrideDialogProps) {
  const plans = usePlanList()
  const overrideSubscription = useOverrideSubscription()

  const form = useForm<SubscriptionOverrideFormValues>({
    resolver: zodResolver(subscriptionOverrideFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await overrideSubscription.mutateAsync({
        freelancerId: String(freelancer.id),
        plan_id: Number(values.plan_id),
        provider: values.provider,
      })
      toast.success('Subscription updated')
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ApiError && isValidationError(error)) {
        mapValidationErrorsToForm(error, form.setError)
        return
      }

      toast.error(getUserMessage(error))
    }
  })

  const planOptions = plans.data?.data ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Override subscription</DialogTitle>
          <DialogDescription>
            Assign a plan to {freelancer.name}. This is for custom deals and manual provisioning.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <FormField
              control={form.control}
              name="plan_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {planOptions.map((plan) => (
                        <SelectItem key={plan.id} value={String(plan.id)}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={overrideSubscription.isPending}>
                Save override
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
