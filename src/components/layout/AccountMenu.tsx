import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/components/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function initials(user: { name?: string; email: string }): string {
  if (user.name?.trim()) {
    return user.name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }
  return user.email[0]?.toUpperCase() ?? '?'
}

/** Account control: initials button that opens the signed-in email and sign-out.
 *  Sits beside the theme toggle, so it's reachable on every screen size. */
export function AccountMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  async function onSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Account"
          className="text-xs font-semibold"
        >
          <span
            aria-hidden="true"
            className="grid size-6 place-items-center rounded-full border border-border"
          >
            {initials(user)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="font-normal">
          <span className="block text-xs text-muted-foreground">Signed in as</span>
          <span className="block truncate text-sm font-medium">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
