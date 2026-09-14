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
import { useClientList } from '@/features/Clients/hooks/useClientList'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import {
  ApiError,
  getErrorCode,
  getUserMessage,
  isValidationError,
  mapValidationErrorsToForm,
} from '@/lib/errors'

import type { ProjectResource } from '../types'

import { useCreateProject } from '../hooks/useCreateProject'
import { useUpdateProject } from '../hooks/useUpdateProject'
import { projectFormSchema, type ProjectFormValues } from '../schemas'

type ProjectFormDialogProps = {
  project?: ProjectResource
  clientId?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

function toFormValues(project?: ProjectResource, clientId?: number): ProjectFormValues {
  return {
    client_id: project ? String(project.client_id) : clientId ? String(clientId) : '',
    name: project?.name ?? '',
    hourly_rate: project?.hourly_rate ?? '',
    currency: project?.currency ?? 'BDT',
    deadline: project?.deadline ?? '',
    status: project?.status ?? 'active',
  }
}

export function ProjectFormDialog({
  project,
  clientId,
  open,
  onOpenChange,
}: ProjectFormDialogProps) {
  const canWrite = useCanWrite()
  const createProject = useCreateProject()
  const updateProject = useUpdateProject()
  const clients = useClientList()
  const isEditing = Boolean(project)
  const mutation = isEditing ? updateProject : createProject
  const showClientSelector = !isEditing && !clientId

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: toFormValues(project, clientId),
  })

  useEffect(() => {
    if (open) {
      form.reset(toFormValues(project, clientId))
    }
  }, [open, project, clientId, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      hourly_rate: values.hourly_rate,
      ...(values.currency ? { currency: values.currency } : {}),
      ...(values.deadline ? { deadline: values.deadline } : {}),
      status: values.status,
    }

    try {
      if (isEditing && project) {
        await updateProject.mutateAsync({ id: String(project.id), ...payload })
        toast.success('Project updated')
      } else {
        await createProject.mutateAsync({
          clientId: values.client_id,
          ...payload,
        })
        toast.success('Project created')
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

  const activeClients = (clients.data?.data ?? []).filter((client) => client.status === 'active')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit project' : 'Create project'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update project details for this client.'
              : 'Add a new billable project to your workspace.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {showClientSelector ? (
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeClients.map((client) => (
                          <SelectItem key={client.id} value={String(client.id)}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" placeholder="Project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly rate</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      className="tabular-nums"
                      inputMode="decimal"
                      placeholder="1500.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" maxLength={3} placeholder="BDT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_hold">On hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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
                    : 'Create project'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
