import { Outlet } from 'react-router-dom'

import { ReadOnlyBanner } from '@/components/ReadOnlyBanner'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { WorkspaceSwitcher } from '@/features/Workspace/components/WorkspaceSwitcher'
import { useWorkspaceContext } from '@/features/Workspace/hooks/useWorkspaceContext'

import { AppBreadcrumb } from './AppBreadcrumb'
import { AppSidebar } from './AppSidebar'
import { UserMenu } from './UserMenu'

export function AppLayout() {
  const { isReadOnly } = useWorkspaceContext()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <WorkspaceSwitcher />
          <div className="ml-auto">
            <UserMenu />
          </div>
        </header>
        {isReadOnly ? (
          <div className="px-4 pt-4">
            <ReadOnlyBanner />
          </div>
        ) : null}
        <div className="bg-muted/30 flex flex-1 flex-col gap-4 p-4 md:p-6">
          <AppBreadcrumb />
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
