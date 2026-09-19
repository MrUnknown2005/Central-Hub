import { useNavigate } from 'react-router-dom'

import { PageHeader } from '@/components/common/PageHeader'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { addProject } from '@/data/services'

export function AddProject() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      <PageHeader
        title="Add a project"
        description="Add a tool to the hub so the club can find and open it."
      />
      <ProjectForm
        submitLabel="Add project"
        onSubmit={async (input) => {
          const project = await addProject(input)
          navigate(`/projects/${project.slug}`)
        }}
      />
    </div>
  )
}
