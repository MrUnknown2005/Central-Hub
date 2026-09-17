import { Button } from '@/components/ui/button'
import { LINK_META } from '@/lib/catalog'
import type { ProjectLink } from '@/types'

/** Opens an external project link in a new tab. The ↗ marks that the link
 *  leaves the site (a functional convention, not decoration) — so it appears
 *  only here, never on internal navigation. */
export function ExternalLinkButton({
  link,
  variant = 'outline',
  size = 'sm',
  className,
}: {
  link: ProjectLink
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
}) {
  const meta = LINK_META[link.type]
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {meta.label}
        <span aria-hidden="true" className="opacity-60">
          ↗
        </span>
      </a>
    </Button>
  )
}
