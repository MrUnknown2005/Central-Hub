import { MemberCard } from './MemberCard'
import type { Member } from '@/types'

/** Responsive grid of member cards. */
export function MemberGrid({ members }: { members: Member[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  )
}
