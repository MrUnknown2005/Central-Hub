import { cn } from '@/lib/utils'

/** A single dashboard metric: a large display number over a quiet label.
 *  The number is set in the display face (not mono) — it's the one place the
 *  dashboard raises its voice. */
export function StatCard({
  label,
  value,
  className,
}: {
  label: string
  value: string | number
  className?: string
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      <span className="tabular text-4xl font-semibold tracking-tight sm:text-5xl">{value}</span>
      <span className="mt-2 text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
