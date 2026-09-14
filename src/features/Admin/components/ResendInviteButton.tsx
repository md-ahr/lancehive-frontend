import { Mail } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getUserMessage } from '@/lib/errors'

import { useResendInvite } from '../hooks/useResendInvite'

type ResendInviteButtonProps = {
  freelancerId: string
}

export function ResendInviteButton({ freelancerId }: ResendInviteButtonProps) {
  const resendInvite = useResendInvite()

  const handleClick = async () => {
    try {
      await resendInvite.mutateAsync(freelancerId)
      toast.success('Invitation resent')
    } catch (error) {
      toast.error(getUserMessage(error))
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={resendInvite.isPending}
      onClick={() => void handleClick()}
    >
      <Mail className="size-4" />
      Resend invite
    </Button>
  )
}
