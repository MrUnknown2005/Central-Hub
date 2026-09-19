import { useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'

import { useAuth } from '@/components/auth/AuthProvider'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { TechBadge } from '@/components/common/TechBadge'
import { ProjectLinks } from '@/components/projects/ProjectLinks'
import { ProjectThumb } from '@/components/projects/ProjectThumb'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { deleteProject } from '@/data/services'
import { CATEGORY_META } from '@/lib/catalog'
import type { Project } from '@/types'

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
  const project = useLoaderData() as Project | null
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  async function onDelete() {
    if (!project) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteProject(project.id)
      navigate('/projects', { replace: true })
    } catch {
      setDeleteError('Could not delete this project. Try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      <Link to="/projects" className={backLinkClass}>
        Back to projects
      </Link>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <ProjectThumb
            name={project.name}
            image={project.image}
            className="size-14 shrink-0 text-xl sm:size-16"
          />
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1>
            <p className="max-w-2xl text-lg text-muted-foreground text-pretty">{project.tagline}</p>
          </div>
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

          {isAdmin && (
            <Card className="gap-3 p-5">
              <span className="text-sm font-medium">Manage</span>
              <Button asChild variant="outline" size="sm">
                <Link to={`/edit-project/${project.slug}`}>Edit project</Link>
              </Button>

              {confirmingDelete ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Delete this project? This can’t be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="destructive" size="sm" onClick={onDelete} disabled={deleting}>
                      {deleting ? 'Deleting…' : 'Delete'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmingDelete(false)}
                      disabled={deleting}
                    >
                      Cancel
                    </Button>
                  </div>
                  {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setConfirmingDelete(true)}
                >
                  Delete project
                </Button>
              )}
            </Card>
          )}
        </aside>
      </div>
    </div>
  )
}
