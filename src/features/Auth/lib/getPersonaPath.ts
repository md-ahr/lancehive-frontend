import type { UserRole } from '@/types/api'

export function getPersonaPath(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return '/admin'
    case 'client':
      return '/portal'
    case 'freelancer':
      return '/app'
  }
}
