import { Link, NavLink } from 'react-router-dom'

import { HubMark } from '@/components/common/icons'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from './nav-items'
import { ThemeToggle } from './ThemeToggle'

/** Desktop-first top bar: wordmark, nav links (hidden on mobile), theme toggle.
 *  Flat and solid, separated from the page by a single hairline rule. */
export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <HubMark className="size-5" />
          <span className="text-[15px] font-semibold tracking-tight">Central Hub</span>
        </Link>

        <nav className="ml-8 hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'relative flex h-16 items-center text-sm transition-colors',
                  isActive ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
