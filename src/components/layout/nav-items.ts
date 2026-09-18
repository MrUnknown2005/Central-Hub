export interface NavItem {
  to: string
  label: string
  /** Match the route exactly (used for the index route). */
  end?: boolean
}

/** Primary navigation, shared by the desktop TopNav and mobile BottomNav.
 *  Text-only — labels are short enough to stand without icons. Derived from auth:
 *  admins get "Add project"; everyone browses. */
export function getNavItems(isAdmin: boolean): NavItem[] {
  const items: NavItem[] = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/projects', label: 'Projects' },
  ]
  if (isAdmin) items.push({ to: '/add-project', label: 'Add project' })
  return items
}
