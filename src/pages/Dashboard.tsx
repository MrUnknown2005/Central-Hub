import { Link } from 'react-router-dom'

import { useAuth } from '@/components/auth/AuthProvider'
import { PageHeader } from '@/components/common/PageHeader'
import { QuickLaunch } from '@/components/dashboard/QuickLaunch'
import { RecentProjects } from '@/components/dashboard/RecentProjects'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  const { isAdmin } = useAuth()

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
      <QuickLaunch />
      <RecentProjects />
    </div>
  )
}
