import { cn } from '@/lib/utils'
import { STATUS_META } from '@/lib/catalog'
import type { ProjectStatus } from '@/types'

/** Project lifecycle status: a monochrome marker + label. The marker's shape
 *  carries the meaning (green fill = live, ink fill = beta, ink ring = in
 *  progress, grey = archived); the label text stays ink. Every dot also emits a
 *  slow ping in its own marker colour — live pulses green, the rest stay
 *  monochrome — so a status reads as a signal, not a static tag. */
export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus
  className?: string
}) {
  const meta = STATUS_META[status]
  return (
    <span className={cn('inline-flex items-center gap-2 text-xs', className)}>
      <span className="relative inline-flex size-2 items-center justify-center">
        <span
          aria-hidden="true"
          className={cn(
            'absolute inline-flex size-2 rounded-full opacity-60 animate-status-ping motion-reduce:hidden',
            meta.ringClassName,
          )}
        />
        <span className={cn('relative inline-flex size-2 rounded-full', meta.dotClassName)} />
      </span>
      <span className={meta.muted ? 'text-muted-foreground' : 'text-foreground'}>{meta.label}</span>
    </span>
  )
}
