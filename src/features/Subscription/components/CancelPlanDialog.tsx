import { useState } from 'react'

import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { getUserMessage } from '@/lib/errors'

import { useCancelSubscription } from '../hooks/useCancelSubscription'

export function CancelPlanDialog() {
  const cancelSubscription = useCancelSubscription()
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    try {
      await cancelSubscription.mutateAsync()
      toast.success('Subscription will cancel at the end of the billing period')
      setOpen(false)
    } catch (error) {
      toast.error(getUserMessage(error))
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Cancel subscription
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Cancel subscription?"
        description="Your workspace stays active until the end of the current billing period. You can resubscribe anytime."
        confirmLabel="Cancel at period end"
        onConfirm={() => void handleConfirm()}
        isLoading={cancelSubscription.isPending}
      />
    </>
  )
}
