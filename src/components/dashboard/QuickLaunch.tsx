import { Link } from 'react-router-dom'

import { StatusBadge } from '@/components/common/StatusBadge'
import { getFeaturedProjects } from '@/data/services'
import { CATEGORY_META } from '@/lib/catalog'
import type { Project } from '@/types'

/** Where a quick-launch tile takes you: the live app if there is one, else detail. */
function launchTarget(project: Project) {
  const open =
    project.links.find((l) => l.type === 'demo') ??
    project.links.find((l) => l.type === 'website')
  return open
    ? { href: open.url, external: true as const }
    : { to: `/projects/${project.slug}`, external: false as const }
}

const TILE_CLASS =
  'group flex flex-col justify-between gap-6 rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30'

/** Featured tools you can open in one tap — the live app if it has one, else its page. */
export function QuickLaunch() {
  const featured = getFeaturedProjects().slice(0, 4)

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Quick launch</h2>
        <p className="text-sm text-muted-foreground">Featured apps you can open right now.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((project) => {
          const { label } = CATEGORY_META[project.category]
          const target = launchTarget(project)
          const body = (
            <>
              <div className="flex items-start justify-between gap-3">
                <StatusBadge status={project.status} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <div className="space-y-1">
                <p className="flex items-center gap-1 font-semibold leading-tight tracking-tight">
                  {project.name}
                  {target.external && (
                    <span aria-hidden className="text-muted-foreground group-hover:text-foreground">
                      ↗
                    </span>
                  )}
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{project.tagline}</p>
              </div>
            </>
          )

          return target.external ? (
            <a
              key={project.id}
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              className={TILE_CLASS}
            >
              {body}
            </a>
          ) : (
            <Link key={project.id} to={target.to} className={TILE_CLASS}>
              {body}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
