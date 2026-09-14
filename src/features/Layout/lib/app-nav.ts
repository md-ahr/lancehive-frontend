import {
  Building2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type AppNavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const appNavItems: AppNavItem[] = [
  { title: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { title: 'Clients', href: '/app/clients', icon: Users },
  { title: 'Projects', href: '/app/projects', icon: FolderKanban },
  { title: 'Invoices', href: '/app/invoices', icon: FileText },
  { title: 'Members', href: '/app/members', icon: UserPlus },
  { title: 'Settings', href: '/app/settings', icon: Settings },
  { title: 'Workspace', href: '/app/workspace', icon: Building2 },
]

export const appRouteLabels: Record<string, string> = {
  app: 'Dashboard',
  clients: 'Clients',
  projects: 'Projects',
  invoices: 'Invoices',
  members: 'Members',
  settings: 'Settings',
  workspace: 'Workspace',
  subscription: 'Subscription',
}
