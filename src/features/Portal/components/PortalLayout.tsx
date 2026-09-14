import { NavLink, Outlet } from 'react-router-dom'

import { UserMenu } from '@/features/Layout/components/UserMenu'
import { cn } from '@/lib/utils'

import { ClientSwitcher } from './ClientSwitcher'

const navItems = [
  { to: '/portal', label: 'Dashboard', end: true },
  { to: '/portal/projects', label: 'Projects', end: false },
  { to: '/portal/invoices', label: 'Invoices', end: false },
]

export function PortalLayout() {
  return (
    <div className="bg-muted/30 flex min-h-svh flex-col">
      <header className="border-border bg-background flex h-14 shrink-0 items-center gap-4 border-b px-4 md:px-8">
        <span className="font-heading text-sm font-semibold">LanceHive Portal</span>
        <ClientSwitcher />
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto">
          <UserMenu />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-6 p-8">
        <Outlet />
      </main>
    </div>
  )
}
