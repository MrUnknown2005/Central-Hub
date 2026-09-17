import { cn } from '@/lib/utils'

/** A single tech-stack tag. Monospace here is meaningful — these are code
 *  tokens (languages, frameworks), not decorative labels. Flat, no border. */
export function TechBadge({ tech, className }: { tech: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] leading-none text-muted-foreground',
        className,
      )}
    >
      {tech}
    </span>
  )
}
