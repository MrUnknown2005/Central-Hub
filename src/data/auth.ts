/**
 * Auth seam — Supabase Auth.
 *
 * The site is public to browse; sign-in is for admins only and there is no
 * public sign-up (accounts are created in the Supabase dashboard). So this seam
 * exposes just `signIn` / `signOut`, plus `getCurrentUser` (async session read)
 * and `onAuthChange` (subscription) used by the auth provider.
 *
 * `role` is read from the `profiles` table. Errors are mapped to the same
 * friendly strings the UI already showed, so the form copy is unchanged.
 */

import type { Session } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'

/** The two permission groups. Admins manage projects; members can only browse. */
export type UserRole = 'member' | 'admin'

/** Public shape handed to the UI. */
export interface AuthUser {
  id: string
  email: string
  name?: string
  role: UserRole
  createdAt: string
}

export class AuthError extends Error {}

/** Build an AuthUser from a session, reading `role` from the profiles table. */
async function resolveUser(session: Session | null): Promise<AuthUser | null> {
  if (!session?.user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name, email')
    .eq('id', session.user.id)
    .maybeSingle()

  const metaName = session.user.user_metadata?.name as string | undefined

  return {
    id: session.user.id,
    email: session.user.email ?? profile?.email ?? '',
    name: profile?.name ?? metaName,
    // Anything that isn't an explicit 'admin' is treated as a member.
    role: profile?.role === 'admin' ? 'admin' : 'member',
    createdAt: session.user.created_at,
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return resolveUser(session)
}

export async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (error) {
    if (/confirm/i.test(error.message)) {
      throw new AuthError('Confirm this account’s email in Supabase, then sign in.')
    }
    // Same message whether the email is unknown or the password is wrong.
    throw new AuthError('That email and password don’t match.')
  }

  const user = await resolveUser(data.session)
  if (!user) throw new AuthError('Could not sign in. Try again.')
  return user
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

/**
 * Subscribe to auth changes. The profile lookup is deferred out of the callback
 * (Supabase warns against calling other client methods synchronously inside it,
 * which can deadlock the auth lock). Returns an unsubscribe function.
 */
export function onAuthChange(cb: (user: AuthUser | null) => void): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setTimeout(() => {
      void resolveUser(session).then(cb)
    }, 0)
  })
  return () => subscription.unsubscribe()
}
