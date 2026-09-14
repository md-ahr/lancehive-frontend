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

import { useCreateFreelancer } from '../hooks/useCreateFreelancer'
import { usePlanList } from '../hooks/usePlanList'
import { createFreelancerFormSchema, type CreateFreelancerFormValues } from '../schemas'

type CreateFreelancerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultValues: CreateFreelancerFormValues = {
  workspace_name: '',
  owner_name: '',
  owner_email: '',
  plan_id: '',
  trial_days: '14',
}

export function CreateFreelancerDialog({ open, onOpenChange }: CreateFreelancerDialogProps) {
  const createFreelancer = useCreateFreelancer()
  const plans = usePlanList(true)

  const form = useForm<CreateFreelancerFormValues>({
    resolver: zodResolver(createFreelancerFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = {
      workspace_name: values.workspace_name,
      owner_name: values.owner_name,
      owner_email: values.owner_email,
      ...(values.plan_id ? { plan_id: Number(values.plan_id) } : {}),
      ...(values.trial_days ? { trial_days: Number(values.trial_days) } : {}),
    }

    try {
      await createFreelancer.mutateAsync(payload)
      toast.success('Workspace created')
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
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            Provision a new freelancer workspace, owner account, and trialing subscription.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)} noValidate>
            <FormField
              control={form.control}
              name="workspace_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="organization" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="owner_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="owner_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" autoComplete="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plan_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan (optional)</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Default plan" />
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
              name="trial_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trial days (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={1} max={90} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createFreelancer.isPending}>
                Create workspace
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
