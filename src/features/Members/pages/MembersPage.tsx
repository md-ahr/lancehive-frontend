import { useMemo, useState } from 'react'

import { UserPlus } from 'lucide-react'

import { CursorPagination } from '@/components/CursorPagination'
import { EmptyState } from '@/components/EmptyState'
import { ErrorAlert } from '@/components/ErrorAlert'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { useCanWrite } from '@/features/Workspace/hooks/useCanWrite'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'

import { InviteMemberDialog } from '../components/InviteMemberDialog'
import { MembersTable } from '../components/MembersTable'
import { useMemberList } from '../hooks/useMemberList'

function canInviteMembers(role: string | undefined): boolean {
  return role === 'owner' || role === 'admin'
}

export function MembersPage() {
  const [cursor, setCursor] = useState<string | undefined>()
  const [inviteOpen, setInviteOpen] = useState(false)
  const { freelancerId, memberships } = useWorkspaceContext()
  const canWrite = useCanWrite()
  const members = useMemberList(cursor)

  const membership = useMemo(
    () => memberships.find((item) => String(item.freelancer_id) === freelancerId),
    [memberships, freelancerId],
  )

  const canInvite = canInviteMembers(membership?.role) && canWrite

  const inviteAction = canInvite ? (
    <Button type="button" onClick={() => setInviteOpen(true)}>
      <UserPlus className="size-4" />
      Invite member
    </Button>
  ) : null

  if (members.isPending) {
    return <LoadingSkeleton variant="page" />
  }

  if (members.isError) {
    return (
      <div className="space-y-4">
        <PageHeader
          title="Members"
          description="Manage workspace team members and invitations."
          actions={inviteAction}
        />
        <ErrorAlert error={members.error} onRetry={() => void members.refetch()} />
      </div>
    )
  }

  const memberData = members.data?.data ?? []
  const meta = members.data?.meta

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="Manage workspace team members and invitations."
        actions={inviteAction}
      />

      {memberData.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No members yet"
          description="Invite teammates to collaborate in this workspace."
          action={inviteAction}
        />
      ) : (
        <div className="space-y-4">
          <MembersTable members={memberData} />
          {meta ? (
            <CursorPagination
              meta={meta}
              onNext={() => setCursor(meta.next_cursor ?? undefined)}
              onPrev={() => setCursor(meta.prev_cursor ?? undefined)}
            />
          ) : null}
        </div>
      )}

      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
