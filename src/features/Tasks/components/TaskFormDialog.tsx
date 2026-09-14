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

import type { TaskResource } from '../types'

import { useCreateTask } from '../hooks/useCreateTask'
import { useUpdateTask } from '../hooks/useUpdateTask'
import { taskFormSchema, type TaskFormValues } from '../schemas'

type TaskFormDialogProps = {
  task?: TaskResource
  projectId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

function toFormValues(task?: TaskResource): TaskFormValues {
  return {
    title: task?.title ?? '',
    status: task?.status ?? 'todo',
    due_date: task?.due_date ?? '',
    estimated_hours: task?.estimated_hours ?? '',
  }
}

export function TaskFormDialog({ task, projectId, open, onOpenChange }: TaskFormDialogProps) {
  const canWrite = useCanWrite()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const isEditing = Boolean(task)
  const mutation = isEditing ? updateTask : createTask

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: toFormValues(task),
  })

  useEffect(() => {
    if (open) {
      form.reset(toFormValues(task))
    }
  }, [open, task, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      status: values.status,
      ...(values.due_date ? { due_date: values.due_date } : {}),
      ...(values.estimated_hours ? { estimated_hours: values.estimated_hours } : {}),
    }

    try {
      if (isEditing && task) {
        await updateTask.mutateAsync({ id: String(task.id), ...payload })
        toast.success('Task updated')
      } else {
        await createTask.mutateAsync({
          projectId: String(projectId),
          ...payload,
        })
        toast.success('Task created')
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
          <DialogTitle>{isEditing ? 'Edit task' : 'Create task'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update task details for this project.'
              : 'Add a new task to track work on this project.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" placeholder="Task title" {...field} />
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
                      <SelectItem value="todo">To do</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
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
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimated_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated hours</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      className="tabular-nums"
                      inputMode="decimal"
                      placeholder="8.00"
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
                    : 'Create task'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
