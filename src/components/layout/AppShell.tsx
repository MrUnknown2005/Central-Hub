import { Outlet, ScrollRestoration } from 'react-router-dom'

import { BottomNav } from './BottomNav'
import { TopNav } from './TopNav'

/** App frame: top nav, routed page, mobile bottom nav. */
export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-10 pb-28 sm:px-6 md:pt-14 md:pb-16">
        <Outlet />
      </main>
      <BottomNav />
      <ScrollRestoration />
    </div>
  )
}
