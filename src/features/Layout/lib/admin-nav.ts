import { CreditCard, LayoutDashboard, Users, type LucideIcon } from 'lucide-react'

export type AdminNavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const adminNavItems: AdminNavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Freelancers', href: '/admin/freelancers', icon: Users },
  { title: 'Plans', href: '/admin/plans', icon: CreditCard },
]
