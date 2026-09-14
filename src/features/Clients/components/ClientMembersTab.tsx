import { useMemo, useState } from 'react'

import { UserPlus } from 'lucide-react'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'

import { useClientMemberList } from '../hooks/useClientMemberList'
import { ClientMembersTable } from './ClientMembersTable'
import { InviteClientMemberDialog } from './InviteClientMemberDialog'

type ClientMembersTabProps = {
  clientId: number
}

function canInviteClientMembers(role: string | undefined): boolean {
  return role === 'owner' || role === 'admin'
}

export function ClientMembersTab({ clientId }: ClientMembersTabProps) {
  const [cursor, setCursor] = useState<string | undefined>()
  const [inviteOpen, setInviteOpen] = useState(false)
  const { freelancerId, memberships } = useWorkspaceContext()
  const canWrite = useCanWrite()
  const members = useClientMemberList(String(clientId), cursor)

  const membership = useMemo(
    () => memberships.find((item) => String(item.freelancer_id) === freelancerId),
    [memberships, freelancerId],
  )

  const canInvite = canInviteClientMembers(membership?.role) && canWrite

  const inviteAction = canInvite ? (
    <Button type="button" onClick={() => setInviteOpen(true)}>
      <UserPlus className="size-4" />
      Invite member
    </Button>
  ) : null

  const memberData = useMemo(() => members.data?.data ?? [], [members.data?.data])
  const meta = members.data?.meta

  if (members.isPending) {
    return <LoadingSkeleton variant="table" />
  }

  if (members.isError) {
    return <ErrorAlert error={members.error} onRetry={() => void members.refetch()} />
  }

  if (memberData.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          icon={UserPlus}
          title="No portal members yet"
          description="Invite client contacts so they can view projects and invoices in the portal."
          action={inviteAction}
        />
        <InviteClientMemberDialog
          clientId={clientId}
          open={inviteOpen}
          onOpenChange={setInviteOpen}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">{inviteAction}</div>
      <ClientMembersTable members={memberData} />
      {meta ? (
        <CursorPagination
          meta={meta}
          onNext={() => setCursor(meta.next_cursor ?? undefined)}
          onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
        />
      ) : null}
      <InviteClientMemberDialog
        clientId={clientId}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  )
}
