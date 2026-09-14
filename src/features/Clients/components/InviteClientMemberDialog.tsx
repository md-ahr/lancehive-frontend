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
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import {
  ApiError,
  getErrorCode,
  getUserMessage,
  isValidationError,
  mapValidationErrorsToForm,
} from '@/lib/errors'

import { useInviteClientMember } from '../hooks/useInviteClientMember'
import { inviteClientMemberFormSchema, type InviteClientMemberFormValues } from '../schemas'

type InviteClientMemberDialogProps = {
  clientId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

const defaultValues: InviteClientMemberFormValues = {
  name: '',
  email: '',
  role: 'member',
}

export function InviteClientMemberDialog({
  clientId,
  open,
  onOpenChange,
}: InviteClientMemberDialogProps) {
  const canWrite = useCanWrite()
  const inviteClientMember = useInviteClientMember()

  const form = useForm<InviteClientMemberFormValues>({
    resolver: zodResolver(inviteClientMemberFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (open) {
      form.reset(defaultValues)
    }
  }, [open, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await inviteClientMember.mutateAsync({
        clientId: String(clientId),
        ...values,
      })
      toast.success('Portal invitation sent')
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
          <DialogTitle>Invite portal member</DialogTitle>
          <DialogDescription>
            Give a client contact read-only portal access. New users receive a password-setup email.
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
                    <Input autoComplete="name" placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="email"
                      placeholder="contact@client.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={inviteClientMember.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!canWrite || inviteClientMember.isPending}>
                {inviteClientMember.isPending ? 'Sending…' : 'Send invitation'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
