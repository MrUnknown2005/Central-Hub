import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Shown when a list has no results. Flat and typographic — an invitation to
 *  act, not a decorated box. */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 border-t border-border py-20 text-center',
        className,
      )}
    >
      <div className="space-y-1.5">
        <p className="text-lg font-medium">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
