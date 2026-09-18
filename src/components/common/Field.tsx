import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** A labelled form control with room for a hint or an inline error.
 *  Sentence-case label, real error text — no decorative chrome. Optional fields
 *  are marked (most are required, so we call out the exceptions instead). */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  optional,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: ReactNode
  optional?: boolean
  className?: string
  children: ReactNode
}) {
  const describedById = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-2 text-sm font-medium">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-muted-foreground">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={describedById} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={describedById} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
