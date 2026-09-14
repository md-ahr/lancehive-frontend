import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import { ApiError, getErrorCode, isValidationError, mapValidationErrorsToForm } from '@/lib/errors'

import { useUpdateWorkspaceSettings } from '../hooks/useUpdateWorkspaceSettings'
import { useWorkspaceSettings } from '../hooks/useWorkspaceSettings'
import { workspaceSettingsFormSchema, type WorkspaceSettingsFormValues } from '../schemas'

function canManageWorkspace(role: string | undefined): boolean {
  return role === 'owner' || role === 'admin'
}

export function WorkspaceSettingsPage() {
  const { freelancerId, memberships, isReadOnly } = useWorkspaceContext()
  const canWrite = useCanWrite()
  const settings = useWorkspaceSettings()
  const updateSettings = useUpdateWorkspaceSettings()

  const membership = useMemo(
    () => memberships.find((item) => String(item.freelancer_id) === freelancerId),
    [memberships, freelancerId],
  )

  const canManage = canManageWorkspace(membership?.role)

  const form = useForm<WorkspaceSettingsFormValues>({
    resolver: zodResolver(workspaceSettingsFormSchema),
    defaultValues: {
      default_currency: 'BDT',
      invoice_number_prefix: 'INV',
      default_tax_rate: null,
      invoice_footer_notes: null,
      business_name: null,
      business_email: null,
      business_address: null,
    },
  })

  useEffect(() => {
    if (settings.data) {
      form.reset({
        default_currency: settings.data.default_currency,
        invoice_number_prefix: settings.data.invoice_number_prefix,
        default_tax_rate: settings.data.default_tax_rate,
        invoice_footer_notes: settings.data.invoice_footer_notes,
        business_name: settings.data.business_name,
        business_email: settings.data.business_email ?? '',
        business_address: settings.data.business_address,
      })
    }
  }, [settings.data, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await updateSettings.mutateAsync({
        ...values,
        business_email: values.business_email || null,
      })
      toast.success('Workspace settings saved')
    } catch (error) {
      if (error instanceof ApiError && isValidationError(error)) {
        mapValidationErrorsToForm(error, form.setError)
        return
      }

      if (error instanceof ApiError && getErrorCode(error) === 'workspace_read_only') {
        toast.error('Your workspace is read-only. Renew your subscription to make changes.')
      }
    }
  })

  if (settings.isLoading) {
    return <LoadingSkeleton variant="page" />
  }

  if (settings.isError) {
    const forbidden = settings.error instanceof ApiError && settings.error.status === 403

    return (
      <div className="space-y-4">
        <PageHeader title="Workspace settings" description="Configure defaults for your workspace." />
        {forbidden ? (
          <Alert>
            <AlertTitle>Access denied</AlertTitle>
            <AlertDescription>You do not have permission to view workspace settings.</AlertDescription>
          </Alert>
        ) : (
          <ErrorAlert error={settings.error} />
        )}
      </div>
    )
  }

  if (!canManage) {
    return (
      <div className="space-y-4">
        <PageHeader title="Workspace settings" description="Configure defaults for your workspace." />
        <Alert>
          <AlertTitle>View only</AlertTitle>
          <AlertDescription>
            Only workspace owners and admins can change workspace settings.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const apiError =
    updateSettings.error instanceof ApiError &&
    !isValidationError(updateSettings.error) &&
    getErrorCode(updateSettings.error) !== 'workspace_read_only'
      ? updateSettings.error
      : null

  const formDisabled = !canWrite || isReadOnly

  return (
    <div className="space-y-6">
      <PageHeader title="Workspace settings" description="Invoice defaults and business details." />

      <div className="border-border max-w-lg rounded-lg border bg-card p-6">
        <Form {...form}>
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {apiError ? <ErrorAlert error={apiError} /> : null}

            <FormField
              control={form.control}
              name="default_currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default currency</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={formDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoice_number_prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice number prefix</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={formDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      disabled={formDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="business_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      value={field.value ?? ''}
                      disabled={formDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={formDisabled || updateSettings.isPending}>
              {updateSettings.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
