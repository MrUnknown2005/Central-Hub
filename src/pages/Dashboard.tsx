import { Link } from 'react-router-dom'

import { PageHeader } from '@/components/common/PageHeader'
import { QuickLaunch } from '@/components/dashboard/QuickLaunch'
import { RecentProjects } from '@/components/dashboard/RecentProjects'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { Button } from '@/components/ui/button'

export function Dashboard() {
  return (
    <div className="space-y-12">
      <PageHeader
        title="Everything the club has built."
        description="Open a tool, browse the directory, or meet the people behind it. Every card here is something you can launch."
        actions={
          <Button asChild size="lg">
            <Link to="/projects">Browse projects</Link>
          </Button>
        }
      />
      <StatsRow />
      <QuickLaunch />
      <RecentProjects />
    </div>
  )
}
