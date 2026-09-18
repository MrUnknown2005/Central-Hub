/** Who can add projects.
 *
 *  Admin is granted two ways:
 *   1. The first account created on this hub (so whoever sets it up is never
 *      locked out — see `src/data/auth.ts`).
 *   2. Any email listed here.
 *
 *  Emails are matched case-insensitively. When the backend moves to Supabase
 *  this list becomes a roles table / claim; the call sites don't change.
 */
export const ADMIN_EMAILS: string[] = []

export function isAdminEmail(email: string): boolean {
  const needle = email.trim().toLowerCase()
  return ADMIN_EMAILS.some((e) => e.trim().toLowerCase() === needle)
}
