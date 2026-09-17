import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'

/** Fixed mobile bottom navigation (hidden from `md` up). Text labels with an
 *  ink underline marking the active route — no icons. */
export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center py-3.5 text-sm transition-colors',
                isActive ? 'font-medium text-foreground' : 'text-muted-foreground',
              )
            }
          >
            {({ isActive }) => (
              <span className="relative py-0.5">
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-foreground" />
                )}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
