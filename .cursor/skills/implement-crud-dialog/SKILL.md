---
name: implement-crud-dialog
description: Implements create and edit dialogs with react-hook-form, zod validation, and TanStack Query mutations for LanceHive. Use when building ClientFormDialog, TaskFormDialog, InviteMemberDialog, or any POST/PATCH form.
---

# Implement CRUD Dialog

## Structure

```tsx
// ClientFormDialog.tsx
const schema = z.object({ name: z.string().min(1), email: z.string().email().optional() })

export function ClientFormDialog({ client, open, onOpenChange }: Props) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: client ?? {} })
  const create = useCreateClient()
  const update = useUpdateClient()

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      if (client) await update.mutateAsync({ id: client.id, ...values })
      else await create.mutateAsync(values)
      toast.success(client ? 'Updated' : 'Created')
      onOpenChange(false)
    } catch (e) {
      if (e instanceof ApiError && e.status === 422) mapApiErrorsToForm(e, form)
      else toast.error('Something went wrong')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
```

## Checklist

- [ ] zod schema mirrors API validation rules
- [ ] `defaultValues` reset when dialog opens (useEffect or key prop)
- [ ] Loading state on submit button (`mutation.isPending`)
- [ ] 422 errors mapped to form fields
- [ ] Success toast + close dialog
- [ ] Mutation invalidates correct query keys
- [ ] Disabled when workspace is read-only

## Delete flow

Use `ConfirmDialog` (AlertDialog), not a form dialog:

```tsx
<ConfirmDialog
  title="Delete client?"
  description="This cannot be undone."
  onConfirm={() => deleteClient.mutate(id)}
/>
```

## shadcn needed

```bash
npx shadcn@latest add dialog form input label select textarea
```

## Tests required

- validation rejects bad input
- 422 maps to fields
- success closes dialog
- submit disabled while pending

Skill: `write-feature-tests`
