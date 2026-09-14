import { useEffect } from 'react'

import { useAuthStore } from '@/features/Auth/stores/useAuthStore'
import { AppRoutes } from '@/routes'

function App() {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return <AppRoutes />
}

export default App
