import { Outlet } from 'react-router-dom'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { AdminSidebar } from './AdminSidebar'
import { UserMenu } from './UserMenu'

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>
        <div className="bg-muted/30 flex flex-1 flex-col gap-4 p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
