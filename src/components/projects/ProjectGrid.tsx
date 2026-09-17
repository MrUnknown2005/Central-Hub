import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types'

/** The projects directory as a ruled index — one full-width row per project. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="border-t border-border">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} layout="row" />
      ))}
    </div>
  )
}
