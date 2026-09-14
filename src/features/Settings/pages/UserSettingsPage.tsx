import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApiError, isValidationError, mapValidationErrorsToForm } from '@/lib/errors'

import { useMeSettings } from '../hooks/useMeSettings'
import { useUpdateMeSettings } from '../hooks/useUpdateMeSettings'
import { userSettingsFormSchema, type UserSettingsFormValues } from '../schemas'

export function UserSettingsPage() {
  const settings = useMeSettings()
  const updateSettings = useUpdateMeSettings()

  const form = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsFormSchema),
    defaultValues: {
      timezone: 'UTC',
      locale: 'en',
    },
  })

  useEffect(() => {
    if (settings.data) {
      form.reset(
        userSettingsFormSchema.parse({
          timezone: settings.data.timezone,
          locale: settings.data.locale,
        }),
      )
    }
  }, [settings.data, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await updateSettings.mutateAsync(values)
      toast.success('Settings saved')
    } catch (error) {
      if (error instanceof ApiError && isValidationError(error)) {
        mapValidationErrorsToForm(error, form.setError)
      }
    }
  })

  if (settings.isLoading) {
    return <LoadingSkeleton variant="page" />
  }

  if (settings.isError) {
    return (
      <div className="space-y-4">
        <PageHeader title="User settings" description="Manage your personal preferences." />
        <ErrorAlert error={settings.error} />
      </div>
    )
  }

  const apiError =
    updateSettings.error instanceof ApiError && !isValidationError(updateSettings.error)
      ? updateSettings.error
      : null

  return (
    <div className="space-y-6">
      <PageHeader title="User settings" description="Manage your timezone and locale." />

      <div className="border-border bg-card max-w-lg rounded-lg border p-6">
        <Form {...form}>
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {apiError ? <ErrorAlert error={apiError} /> : null}

            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input placeholder="Asia/Dhaka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locale</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select locale" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={updateSettings.isPending}>
              {updateSettings.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
