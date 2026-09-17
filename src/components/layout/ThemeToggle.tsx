import { useTheme } from '@/components/theme/ThemeProvider'
import { Button } from '@/components/ui/button'

/** Single-click light/dark toggle. A half-filled disc — the standard
 *  appearance/contrast metaphor — drawn inline so it stays monochrome. */
export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title="Toggle theme"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.75" />
        <path d="M12 3.75a8.25 8.25 0 0 0 0 16.5Z" fill="currentColor" />
      </svg>
    </Button>
  )
}
