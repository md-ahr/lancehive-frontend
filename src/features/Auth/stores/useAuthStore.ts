import { create } from 'zustand'

import { getToken } from '@/lib/auth-storage'

type AuthStore = {
  hasToken: boolean
  isHydrated: boolean
  hydrate: () => void
  setHasToken: (value: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  hasToken: false,
  isHydrated: false,
  hydrate: () => set({ hasToken: Boolean(getToken()), isHydrated: true }),
  setHasToken: (value) => set({ hasToken: value }),
}))
