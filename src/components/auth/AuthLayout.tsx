import type { ReactNode } from 'react'

import { HubMark } from '@/components/common/icons'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

/** Frame for the sign-in / sign-up pages: centered column, wordmark and a theme
 *  toggle, no app navigation. The form is the only thing to do here. */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <HubMark className="size-5" />
          <span className="text-[15px] font-semibold tracking-tight">Central Hub</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {title}
            </h1>
            {subtitle && <p className="text-pretty text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
          {footer && <div className="text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
