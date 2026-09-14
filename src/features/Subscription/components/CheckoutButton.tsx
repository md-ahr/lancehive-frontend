import { useState } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getUserMessage } from '@/lib/errors'

import type { BillingInterval, PlanResource } from '../types'

import { useCheckoutSubscription } from '../hooks/useCheckoutSubscription'
import { formatPlanPrice } from '../lib/format-subscription'
import { redirectToCheckout } from '../lib/redirect-to-checkout'

type CheckoutButtonProps = {
  plan: PlanResource
}

export function CheckoutButton({ plan }: CheckoutButtonProps) {
  const checkout = useCheckoutSubscription()
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly')

  const handleCheckout = async () => {
    try {
      const response = await checkout.mutateAsync({
        plan_id: plan.id,
        billing_interval: billingInterval,
      })
      redirectToCheckout(response.checkout_url)
    } catch (error) {
      toast.error(getUserMessage(error))
    }
  }

  const monthlyPrice = formatPlanPrice(plan.price_monthly, plan.currency)
  const yearlyPrice = formatPlanPrice(plan.price_yearly, plan.currency)

  return (
    <div className="border-border bg-card space-y-4 rounded-lg border p-6">
      <div>
        <h3 className="font-heading text-lg font-semibold">Subscribe to {plan.name}</h3>
        <p className="text-muted-foreground text-sm">
          Complete checkout on Stripe to activate your subscription.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="billing-interval">Billing interval</Label>
        <Select
          value={billingInterval}
          onValueChange={(value) => setBillingInterval(value as BillingInterval)}
        >
          <SelectTrigger id="billing-interval" className="w-full sm:max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly — {monthlyPrice}</SelectItem>
            <SelectItem value="yearly">Yearly — {yearlyPrice}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={() => void handleCheckout()} disabled={checkout.isPending}>
        {checkout.isPending ? 'Redirecting…' : 'Continue to checkout'}
      </Button>
    </div>
  )
}
