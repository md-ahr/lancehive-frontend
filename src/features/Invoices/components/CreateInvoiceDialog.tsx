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
import { Textarea } from '@/components/ui/textarea'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import {
  ApiError,
  getErrorCode,
  getUserMessage,
  isValidationError,
  mapValidationErrorsToForm,
} from '@/lib/errors'

import { useCreateClientInvoice } from '../hooks/useCreateClientInvoice'
import { createInvoiceFormSchema, type CreateInvoiceFormValues } from '../schemas'

type CreateInvoiceDialogProps = {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (invoiceId: number) => void
}

const defaultValues: CreateInvoiceFormValues = {
  due_date: '',
  notes: '',
  tax_rate: '',
  prefill_unbilled_time: 'yes',
}

export function CreateInvoiceDialog({
  projectId,
  open,
  onOpenChange,
  onCreated,
}: CreateInvoiceDialogProps) {
  const canWrite = useCanWrite()
  const createInvoice = useCreateClientInvoice()

  const form = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const created = await createInvoice.mutateAsync({
        projectId,
        ...(values.due_date ? { due_date: values.due_date } : {}),
        ...(values.notes ? { notes: values.notes } : {}),
        ...(values.tax_rate ? { tax_rate: values.tax_rate } : {}),
        prefill_unbilled_time: values.prefill_unbilled_time === 'yes',
      })
      toast.success('Invoice created')
      onOpenChange(false)
      onCreated?.(created.id)
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
          <DialogTitle>Create invoice</DialogTitle>
          <DialogDescription>
            Create a draft invoice for this project. You can add items before sending.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <FormField
              control={form.control}
              name="prefill_unbilled_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prefill from unbilled time</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={!canWrite}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yes">Yes — add unbilled time logs</SelectItem>
                      <SelectItem value="no">No — start empty</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due date</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={!canWrite} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="tabular-nums"
                      disabled={!canWrite}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Payment instructions or footer notes"
                      disabled={!canWrite}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!canWrite || createInvoice.isPending}>
                {createInvoice.isPending ? 'Creating…' : 'Create invoice'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
