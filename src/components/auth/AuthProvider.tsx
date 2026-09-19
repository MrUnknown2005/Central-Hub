import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  getCurrentUser,
  onAuthChange,
  signIn as authSignIn,
  signOut as authSignOut,
  type AuthUser,
} from '@/data/auth'

/** Auth context. State lives here; the seam (`data/auth.ts`) talks to Supabase.
 *  `loading` is true until the initial session read resolves, so route guards
 *  can wait instead of flashing a signed-in admin away before their role loads. */
interface AuthContextValue {
  user: AuthUser | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthUser>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    getCurrentUser()
      .then((u) => {
        if (active) {
          setUser(u)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) setLoading(false)
      })

    // Keep in sync with sign-in / sign-out / token refresh across tabs.
    const unsubscribe = onAuthChange((u) => {
      if (active) {
        setUser(u)
        setLoading(false)
      }
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await authSignIn({ email, password })
    setUser(next)
    return next
  }, [])

  const signOut = useCallback(async () => {
    await authSignOut()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    // isAdmin is derived from the role, the single source of truth.
    () => ({ user, isAdmin: user?.role === 'admin', loading, signIn, signOut }),
    [user, loading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
