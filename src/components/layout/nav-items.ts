export interface NavItem {
  to: string
  label: string
  /** Match the route exactly (used for the index route). */
  end?: boolean
}

/** Primary navigation, shared by the desktop TopNav and mobile BottomNav.
 *  Text-only — labels are short enough to stand without icons. */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/members', label: 'Members' },
]
