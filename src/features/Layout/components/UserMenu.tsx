import { LogOut, Settings, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/features/Auth/hooks/useLogout'
import { useMe } from '@/features/Auth/hooks/useMe'

export function UserMenu() {
  const me = useMe()
  const logout = useLogout()
  const navigate = useNavigate()

  const userName = me.data?.user.name ?? 'Account'
  const isClientUser = me.data?.user.role === 'client'

  const handleLogout = async () => {
    await logout.mutateAsync()
    navigate('/login', { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="size-4" />
            <span className="max-w-[140px] truncate">{userName}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48">
        {!isClientUser ? (
          <>
            <DropdownMenuItem render={<Link to="/app/settings" />}>
              <Settings className="size-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <DropdownMenuItem onClick={handleLogout} disabled={logout.isPending}>
          <LogOut className="size-4" />
          {logout.isPending ? 'Signing out…' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
