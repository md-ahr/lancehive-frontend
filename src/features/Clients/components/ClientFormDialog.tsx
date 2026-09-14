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
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import {
  ApiError,
  getErrorCode,
  getUserMessage,
  isValidationError,
  mapValidationErrorsToForm,
} from '@/lib/errors'

import type { ClientResource } from '../types'

import { useCreateClient } from '../hooks/useCreateClient'
import { useUpdateClient } from '../hooks/useUpdateClient'
import { clientFormSchema, type ClientFormValues } from '../schemas'

type ClientFormDialogProps = {
  client?: ClientResource
  open: boolean
  onOpenChange: (open: boolean) => void
}

function toFormValues(client?: ClientResource): ClientFormValues {
  return {
    name: client?.name ?? '',
    contact_email: client?.contact_email ?? '',
  }
}

export function ClientFormDialog({ client, open, onOpenChange }: ClientFormDialogProps) {
  const canWrite = useCanWrite()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const isEditing = Boolean(client)
  const mutation = isEditing ? updateClient : createClient

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: toFormValues(client),
  })

  useEffect(() => {
    if (open) {
      form.reset(toFormValues(client))
    }
  }, [open, client, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      ...(values.contact_email ? { contact_email: values.contact_email } : {}),
    }

    try {
      if (isEditing && client) {
        await updateClient.mutateAsync({ id: String(client.id), ...payload })
        toast.success('Client updated')
      } else {
        await createClient.mutateAsync(payload)
        toast.success('Client created')
      }
      onOpenChange(false)
    } catch (error) {
      if (error instanceof ApiError && isValidationError(error)) {
        mapValidationErrorsToForm(error, form.setError)
        return
      }

      if (error instanceof ApiError && getErrorCode(error) === 'workspace_read_only') {
        toast.error('Your workspace is read-only. Renew your subscription to make changes.')
        return
      }

      toast.error(getUserMessage(error))
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit client' : 'Create client'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update client details for this workspace.'
              : 'Add a new client organization to your workspace.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="organization" placeholder="Client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="email"
                      placeholder="billing@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canWrite || mutation.isPending}>
                {mutation.isPending
                  ? isEditing
                    ? 'Saving…'
                    : 'Creating…'
                  : isEditing
                    ? 'Save changes'
                    : 'Create client'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
