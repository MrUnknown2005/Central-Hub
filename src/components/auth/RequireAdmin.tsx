import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { RouteLoading } from '@/components/common/RouteLoading'
import { useAuth } from './AuthProvider'

/** Gates admin-only routes (add / edit a project). While the session is still
 *  loading it waits; once resolved, non-admins are sent to the dashboard. */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth()

  if (loading) return <RouteLoading />
  if (!isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}
