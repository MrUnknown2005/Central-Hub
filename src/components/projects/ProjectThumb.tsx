import { cn } from '@/lib/utils'

/** A project's PNG logo, or a letter-mark fallback when there's no image yet.
 *  Size comes from the caller via `className` (e.g. `size-11`). The image uses
 *  object-contain so uploaded logos aren't cropped. */
export function ProjectThumb({
  name,
  image,
  className,
  alt = '',
}: {
  name: string
  image?: string | null
  className?: string
  alt?: string
}) {
  if (image) {
    return (
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className={cn('rounded-md border border-border bg-card object-contain', className)}
      />
    )
  }

  const letter = name.trim()[0]?.toUpperCase() ?? '?'
  return (
    <div
      aria-hidden="true"
      className={cn(
        'grid place-items-center rounded-md border border-border bg-muted font-semibold text-muted-foreground',
        className,
      )}
    >
      {letter}
    </div>
  )
}
