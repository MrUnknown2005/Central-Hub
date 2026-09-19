import { Link } from 'react-router-dom'

import { useAuth } from '@/components/auth/AuthProvider'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ProjectThumb } from '@/components/projects/ProjectThumb'
import { Button } from '@/components/ui/button'
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

/** Featured tools you can open in one tap — the live app if it has one, else its
 *  page. Falls back to the most recent projects when nothing is featured yet. */
export function QuickLaunch({ featured, recent }: { featured: Project[]; recent: Project[] }) {
  const { isAdmin } = useAuth()
  const tiles = (featured.length > 0 ? featured : recent).slice(0, 4)

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Quick launch</h2>
        <p className="text-sm text-muted-foreground">Featured apps you can open right now.</p>
      </div>

      {tiles.length === 0 ? (
        <EmptyState
          title="No tools yet"
          description={
            isAdmin
              ? 'Add the first project and it will show up here to open in one tap.'
              : 'Once an admin adds a tool, it will show up here to open in one tap.'
          }
          action={
            isAdmin ? (
              <Button asChild>
                <Link to="/add-project">Add the first project</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((project) => {
            const target = launchTarget(project)
            const body = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <ProjectThumb
                    name={project.name}
                    image={project.image}
                    className="size-10 text-sm"
                  />
                  <StatusBadge status={project.status} />
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
      )}
    </section>
  )
}
