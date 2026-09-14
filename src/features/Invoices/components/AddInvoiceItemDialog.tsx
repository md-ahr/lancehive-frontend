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

import { useAddInvoiceItem } from '../hooks/useAddInvoiceItem'
import { addInvoiceItemFormSchema, type AddInvoiceItemFormValues } from '../schemas'

type AddInvoiceItemDialogProps = {
  invoiceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultValues: AddInvoiceItemFormValues = {
  description: '',
  quantity: '',
  rate: '',
}

export function AddInvoiceItemDialog({ invoiceId, open, onOpenChange }: AddInvoiceItemDialogProps) {
  const canWrite = useCanWrite()
  const addItem = useAddInvoiceItem()

  const form = useForm<AddInvoiceItemFormValues>({
    resolver: zodResolver(addInvoiceItemFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await addItem.mutateAsync({
        invoiceId,
        description: values.description,
        quantity: values.quantity,
        rate: values.rate,
      })
      toast.success('Line item added')
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

      if (error instanceof ApiError && getErrorCode(error) === 'invoice_not_editable') {
        toast.error('This invoice can no longer be edited.')
        return
      }

      toast.error(getUserMessage(error))
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add line item</DialogTitle>
          <DialogDescription>Add a manual line item to this draft invoice.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Work description" disabled={!canWrite} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
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
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="tabular-nums"
                        disabled={!canWrite}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!canWrite || addItem.isPending}>
                {addItem.isPending ? 'Adding…' : 'Add item'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
