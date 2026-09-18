import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from './AuthProvider'

/** Gates admin-only routes (Add project). Non-admins are sent to the dashboard.
 *  Assumes an authenticated user — always nest inside RequireAuth. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
