import { Link } from 'react-router-dom'

import { ExternalLinkButton } from '@/components/common/ExternalLinkButton'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TechBadge } from '@/components/common/TechBadge'
import { ProjectThumb } from '@/components/projects/ProjectThumb'
import { CATEGORY_META } from '@/lib/catalog'
import { cn } from '@/lib/utils'
import type { Project } from '@/types'

/** The one project block used across the app. `card` is a flat bordered sheet
 *  (dashboard grid); `row` is a full-width index entry (projects directory).
 *  The name is a stretched link to the detail page; the external links sit
 *  above that overlay so they stay independently clickable. */
export function ProjectCard({
  project,
  layout = 'card',
  className,
}: {
  project: Project
  layout?: 'card' | 'row'
  className?: string
}) {
  const { label: categoryLabel } = CATEGORY_META[project.category]
  const primaryLinks = project.links.slice(0, 2)

  const nameLink = (
    <Link
      to={`/projects/${project.slug}`}
      className="underline-offset-4 outline-none hover:underline after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-ring"
    >
      {project.name}
    </Link>
  )

  const links = (
    <div className="relative z-10 flex items-center gap-1">
      {primaryLinks.map((link) => (
        <ExternalLinkButton key={link.type} link={link} variant="ghost" size="sm" />
      ))}
    </div>
  )

  if (layout === 'row') {
    return (
      <article
        className={cn(
          'group relative flex flex-col gap-4 border-b border-border py-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8',
          className,
        )}
      >
        <div className="flex min-w-0 items-start gap-4 sm:flex-1">
          <ProjectThumb
            name={project.name}
            image={project.image}
            className="size-11 shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight">{nameLink}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{project.tagline}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="text-xs text-muted-foreground">{categoryLabel}</span>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <TechBadge key={tech} tech={tech} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:flex-col sm:items-end sm:gap-3">
          <StatusBadge status={project.status} />
          {links}
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col gap-4 rounded-lg border border-border bg-card p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <ProjectThumb name={project.name} image={project.image} className="size-10 shrink-0" />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold leading-tight tracking-tight">{nameLink}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{categoryLabel}</p>
          </div>
        </div>
        <StatusBadge status={project.status} className="shrink-0 pt-1" />
      </div>

      <p className="line-clamp-2 text-sm text-muted-foreground">{project.tagline}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <TechBadge key={tech} tech={tech} />
        ))}
      </div>

      <div className="mt-auto flex items-center justify-end gap-2 pt-1">
        {links}
      </div>
    </article>
  )
}
