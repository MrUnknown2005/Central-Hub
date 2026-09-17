import { cn } from '@/lib/utils'
import { STATUS_META } from '@/lib/catalog'
import type { ProjectStatus } from '@/types'

/** Project lifecycle status: a monochrome marker + label. The marker's shape
 *  carries the meaning (green fill = live, ink fill = beta, ink ring = in
 *  progress, grey = archived); the label text stays ink. */
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
      <span className={cn('size-2 rounded-full', meta.dotClassName)} />
      <span className={meta.muted ? 'text-muted-foreground' : 'text-foreground'}>{meta.label}</span>
    </span>
  )
}
