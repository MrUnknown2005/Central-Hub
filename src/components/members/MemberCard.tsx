import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import type { Member } from '@/types'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const SOCIALS = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'website', label: 'Website' },
] as const

/** Roster card: avatar, name, role, bio, socials and project count. */
export function MemberCard({ member }: { member: Member }) {
  const count = member.projectIds.length

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarFallback className="bg-muted text-sm font-semibold text-foreground">
            {initials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight tracking-tight">{member.name}</p>
          <p className="truncate text-sm text-muted-foreground">{member.role}</p>
        </div>
      </div>

      {member.bio && <p className="line-clamp-3 text-sm text-muted-foreground">{member.bio}</p>}

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <span className="tabular text-xs text-muted-foreground">
          {count} {count === 1 ? 'project' : 'projects'}
        </span>
        <div className="flex items-center gap-3 text-xs">
          {SOCIALS.map((social) => {
            const url = member.links?.[social.key]
            if (!url) return null
            return (
              <a
                key={social.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on ${social.label}`}
                className="text-muted-foreground underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              >
                {social.label}
              </a>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
