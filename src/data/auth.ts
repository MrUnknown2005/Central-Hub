import { isAdminEmail } from '@/config/access'

/**
 * Auth seam — Supabase-shaped, localStorage-backed.
 *
 * `signUp` / `signIn` / `signOut` are async to mirror Supabase Auth, so the UI
 * that calls them won't change when we swap the backend. `getSession` is a
 * synchronous read used to initialize the provider and gate routes without a
 * loading flicker.
 *
 * SECURITY CAVEAT: this is mock-grade. Passwords are hashed (SHA-256 + a random
 * per-user salt) so they aren't stored in plain text, but everything lives in
 * localStorage on the visitor's own machine — it is NOT real authentication and
 * offers no protection against someone with access to the browser. Real security
 * arrives with the Supabase swap (`signInWithPassword`, RLS, http-only session).
 */

const USERS_KEY = 'central-hub-users'
const SESSION_KEY = 'central-hub-session'

/** Public shape handed to the UI. Never includes the password hash. */
export interface AuthUser {
  id: string
  email: string
  name?: string
  isAdmin: boolean
  createdAt: string
}

interface StoredUser {
  id: string
  email: string
  name?: string
  /** True when this was the first account created (bootstrap admin). */
  isFirstUser: boolean
  createdAt: string
  salt: string
  passwordHash: string
}

export class AuthError extends Error {}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : []
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Admin if this was the first account OR the email is on the allowlist. */
function toAuthUser(user: StoredUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    isAdmin: user.isFirstUser || isAdminEmail(user.email),
    createdAt: user.createdAt,
  }
}

function randomHex(bytes = 16): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function signUp({
  email,
  password,
  name,
}: {
  email: string
  password: string
  name?: string
}): Promise<AuthUser> {
  const normalized = normalizeEmail(email)
  if (!normalized) throw new AuthError('Enter your email address.')
  if (password.length < 8) throw new AuthError('Password must be at least 8 characters.')

  const users = readUsers()
  if (users.some((u) => u.email === normalized)) {
    throw new AuthError('An account with this email already exists. Try signing in.')
  }

  const salt = randomHex()
  const stored: StoredUser = {
    id: crypto.randomUUID(),
    email: normalized,
    name: name?.trim() || undefined,
    isFirstUser: users.length === 0,
    createdAt: new Date().toISOString(),
    salt,
    passwordHash: await hashPassword(password, salt),
  }

  writeUsers([...users, stored])
  localStorage.setItem(SESSION_KEY, stored.id)
  return toAuthUser(stored)
}

export async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}): Promise<AuthUser> {
  const normalized = normalizeEmail(email)
  const user = readUsers().find((u) => u.email === normalized)
  // Same message whether the email is unknown or the password is wrong.
  const invalid = new AuthError('That email and password don’t match.')
  if (!user) throw invalid
  if ((await hashPassword(password, user.salt)) !== user.passwordHash) throw invalid

  localStorage.setItem(SESSION_KEY, user.id)
  return toAuthUser(user)
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): AuthUser | null {
  const id = localStorage.getItem(SESSION_KEY)
  if (!id) return null
  const user = readUsers().find((u) => u.id === id)
  return user ? toAuthUser(user) : null
}
