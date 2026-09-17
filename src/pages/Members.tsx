import { PageHeader } from '@/components/common/PageHeader'
import { MemberGrid } from '@/components/members/MemberGrid'
import { getMembers } from '@/data/services'

export function Members() {
  const members = getMembers()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Members"
        description="The builders, designers and organizers behind Central Hub."
      />
      <MemberGrid members={members} />
    </div>
  )
}
