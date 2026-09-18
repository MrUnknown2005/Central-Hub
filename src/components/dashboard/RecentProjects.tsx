import { Link } from 'react-router-dom'

import { ProjectCard } from '@/components/projects/ProjectCard'
import { getRecentProjects } from '@/data/services'

/** Most-recently-added projects, using the shared ProjectCard. Renders nothing
 *  when the hub is empty — Quick Launch above carries the empty state. */
export function RecentProjects() {
  const recent = getRecentProjects(6)

  if (recent.length === 0) return null

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Recently added</h2>
          <p className="text-sm text-muted-foreground">The latest tools across the club.</p>
        </div>
        <Link
          to="/projects"
          className="shrink-0 text-sm font-medium underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground"
        >
          All projects
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
