import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import {
  ApiError,
  getErrorCode,
  getUserMessage,
  isValidationError,
  mapValidationErrorsToForm,
} from '@/lib/errors'

import type { TimeLogResource } from '../types'

import { useCreateTimeLog } from '../hooks/useCreateTimeLog'
import { useUpdateTimeLog } from '../hooks/useUpdateTimeLog'
import { timeLogFormSchema, type TimeLogFormValues } from '../schemas'

type TimeLogFormProps = {
  taskId: number
  projectId: number
  timeLog?: TimeLogResource
  onCancelEdit?: () => void
  onSuccess?: () => void
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function toDatetimeLocalValue(iso?: string) {
  const date = iso ? new Date(iso) : new Date()
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function toIsoDatetime(local: string) {
  return new Date(local).toISOString()
}

function toFormValues(timeLog?: TimeLogResource): TimeLogFormValues {
  return {
    hours: timeLog?.hours ?? '',
    description: timeLog?.description ?? '',
    logged_at: toDatetimeLocalValue(timeLog?.logged_at),
  }
}

export function TimeLogForm({
  taskId,
  projectId,
  timeLog,
  onCancelEdit,
  onSuccess,
}: TimeLogFormProps) {
  const canWrite = useCanWrite()
  const createTimeLog = useCreateTimeLog()
  const updateTimeLog = useUpdateTimeLog()
  const isEditing = Boolean(timeLog)
  const mutation = isEditing ? updateTimeLog : createTimeLog

  const form = useForm<TimeLogFormValues>({
    resolver: zodResolver(timeLogFormSchema),
    defaultValues: toFormValues(timeLog),
  })

  useEffect(() => {
    form.reset(toFormValues(timeLog))
  }, [timeLog, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = {
      hours: values.hours,
      logged_at: toIsoDatetime(values.logged_at),
      ...(values.description ? { description: values.description } : {}),
    }

    try {
      if (isEditing && timeLog) {
        await updateTimeLog.mutateAsync({
          id: String(timeLog.id),
          taskId: String(taskId),
          projectId: String(projectId),
          ...payload,
        })
        toast.success('Time log updated')
        onCancelEdit?.()
      } else {
        await createTimeLog.mutateAsync({
          taskId: String(taskId),
          projectId: String(projectId),
          ...payload,
        })
        toast.success('Time logged')
        form.reset(toFormValues())
      }
      onSuccess?.()
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
    <Form {...form}>
      <form className="space-y-3" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    className="tabular-nums"
                    inputMode="decimal"
                    placeholder="2.50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logged_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logged at</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  autoComplete="off"
                  placeholder="What did you work on?"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          {isEditing ? (
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
          ) : null}
          <Button type="submit" disabled={!canWrite || mutation.isPending}>
            {mutation.isPending
              ? isEditing
                ? 'Saving…'
                : 'Logging…'
              : isEditing
                ? 'Save changes'
                : 'Log time'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
