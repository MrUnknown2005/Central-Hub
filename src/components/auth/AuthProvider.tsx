import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import {
  getSession,
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  type AuthUser,
} from '@/data/auth'

/** Auth context. Mirrors the ThemeProvider pattern: state lives here, the seam
 *  (`data/auth.ts`) does the work, so the Supabase swap never touches the UI. */
interface AuthContextValue {
  user: AuthUser | null
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<AuthUser>
  signUp: (input: { email: string; password: string; name?: string }) => Promise<AuthUser>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Synchronous init means routes can gate on the first render — no flash.
  const [user, setUser] = useState<AuthUser | null>(getSession)

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await authSignIn({ email, password })
    setUser(next)
    return next
  }, [])

  const signUp = useCallback(
    async (input: { email: string; password: string; name?: string }) => {
      const next = await authSignUp(input)
      setUser(next)
      return next
    },
    [],
  )

  const signOut = useCallback(async () => {
    await authSignOut()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAdmin: Boolean(user?.isAdmin), signIn, signUp, signOut }),
    [user, signIn, signUp, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
