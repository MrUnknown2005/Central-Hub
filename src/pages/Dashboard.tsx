import { Link, useLoaderData } from 'react-router-dom'

import { useAuth } from '@/components/auth/AuthProvider'
import { PageHeader } from '@/components/common/PageHeader'
import { QuickLaunch } from '@/components/dashboard/QuickLaunch'
import { RecentProjects } from '@/components/dashboard/RecentProjects'
import { Button } from '@/components/ui/button'
import type { Project } from '@/types'

interface DashboardData {
  featured: Project[]
  recent: Project[]
}

export function Dashboard() {
  const { isAdmin } = useAuth()
  const { featured, recent } = useLoaderData() as DashboardData

  return (
    <div className="space-y-12">
      <PageHeader
        title="Everything the club has built."
        description="Open a tool or browse the directory. Every card here is something you can launch."
        actions={
          <>
            {isAdmin && (
              <Button asChild variant="outline" size="lg">
                <Link to="/add-project">Add project</Link>
              </Button>
            )}
            <Button asChild size="lg">
              <Link to="/projects">Browse projects</Link>
            </Button>
          </>
        }
      />
      <QuickLaunch featured={featured} recent={recent} />
      <RecentProjects projects={recent} />
    </div>
  )
}
