import { ExternalLinkButton } from '@/components/common/ExternalLinkButton'
import type { ProjectLink } from '@/types'

/** Prominent row of external links for the detail page. The primary action
 *  (demo → website → first link) is the one ink button; the rest are outline. */
export function ProjectLinks({ links }: { links: ProjectLink[] }) {
  if (links.length === 0) return null

  const primary =
    links.find((l) => l.type === 'demo') ?? links.find((l) => l.type === 'website') ?? links[0]

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <ExternalLinkButton
          key={link.type}
          link={link}
          variant={link === primary ? 'default' : 'outline'}
          size="default"
        />
      ))}
    </div>
  )
}
