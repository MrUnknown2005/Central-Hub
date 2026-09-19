import { Link, useLoaderData, useNavigate } from 'react-router-dom'

import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { Button } from '@/components/ui/button'
import { updateProject } from '@/data/services'
import type { Project } from '@/types'

export function EditProject() {
  const project = useLoaderData() as Project | null
  const navigate = useNavigate()

  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        description="This project may have been removed or renamed."
        action={
          <Button asChild variant="outline">
            <Link to="/projects">Browse all projects</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Edit project" description={`Update ${project.name} and save your changes.`} />
      <ProjectForm
        initial={project}
        submitLabel="Save changes"
        onSubmit={async (input) => {
          const updated = await updateProject(project.id, input)
          navigate(`/projects/${updated.slug}`)
        }}
      />
    </div>
  )
}
