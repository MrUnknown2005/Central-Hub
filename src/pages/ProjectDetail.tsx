import { Link, useParams } from 'react-router-dom'

import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TechBadge } from '@/components/common/TechBadge'
import { ProjectLinks } from '@/components/projects/ProjectLinks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getProject } from '@/data/services'
import { CATEGORY_META } from '@/lib/catalog'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const backLinkClass =
  'w-fit text-sm text-muted-foreground underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground'

export function ProjectDetail() {
  const { slug } = useParams()
  const project = slug ? getProject(slug) : undefined

  if (!project) {
    return (
      <div className="space-y-8">
        <Link to="/projects" className={backLinkClass}>
          Back to projects
        </Link>
        <EmptyState
          title="Project not found"
          description="This project may have been moved or renamed."
          action={
            <Button asChild variant="outline">
              <Link to="/projects">Browse all projects</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const { label: categoryLabel } = CATEGORY_META[project.category]

  return (
    <div className="space-y-8">
      <Link to="/projects" className={backLinkClass}>
        Back to projects
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground text-pretty">{project.tagline}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <StatusBadge status={project.status} />
          <span className="text-sm text-muted-foreground">{categoryLabel}</span>
        </div>
      </div>

      <ProjectLinks links={project.links} />

      <Separator />

      <div className="grid gap-10 lg:grid-cols-[1fr_15rem]">
        {/* Main column */}
        <div className="space-y-8">
          {project.description && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">About</h2>
              <p className="max-w-prose leading-relaxed text-pretty">{project.description}</p>
            </section>
          )}

          {project.tech.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-muted-foreground">Tech stack</h2>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <TechBadge key={tech} tech={tech} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card className="gap-3 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Updated</span>
              <span className="tabular">{formatDate(project.updatedAt)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Added</span>
              <span className="tabular">{formatDate(project.createdAt)}</span>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
