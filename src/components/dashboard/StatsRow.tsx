import { getStats } from '@/data/services'
import { StatCard } from './StatCard'

/** Masthead band of headline metrics — four figures set as a ruled row,
 *  vertical hairlines between them on wider screens. */
export function StatsRow() {
  const stats = getStats()
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-border py-8 sm:grid-cols-4 sm:gap-0">
      <StatCard label="Projects" value={stats.totalProjects} />
      <StatCard
        label="Live apps"
        value={stats.liveProjects}
        className="sm:border-l sm:border-border sm:pl-6"
      />
      <StatCard
        label="Members"
        value={stats.totalMembers}
        className="sm:border-l sm:border-border sm:pl-6"
      />
      <StatCard
        label="Total stars"
        value={stats.totalStars.toLocaleString()}
        className="sm:border-l sm:border-border sm:pl-6"
      />
    </div>
  )
}
