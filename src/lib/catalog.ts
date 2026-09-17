import type { ProjectCategory, ProjectLinkType, ProjectStatus } from '@/types'

/** Category → display label. No icons: categories are set as text, not chips. */
export const CATEGORY_META: Record<ProjectCategory, { label: string }> = {
  web: { label: 'Web app' },
  mobile: { label: 'Mobile' },
  cli: { label: 'CLI' },
  bot: { label: 'Bot' },
  api: { label: 'API' },
  ai: { label: 'AI / ML' },
  game: { label: 'Game' },
  tool: { label: 'Tool' },
}

/** Status → label + a monochrome marker. The single accent colour appears in
 *  exactly one place across the whole app: the "live" dot. Every other status
 *  is encoded by the marker's shape (filled / hollow / grey), not by hue.
 *  `muted` dims the label text for retired work. */
export const STATUS_META: Record<
  ProjectStatus,
  { label: string; dotClassName: string; muted?: boolean }
> = {
  live: { label: 'Live', dotClassName: 'bg-live' },
  beta: { label: 'Beta', dotClassName: 'bg-foreground' },
  wip: { label: 'In progress', dotClassName: 'border border-foreground bg-transparent' },
  archived: { label: 'Archived', dotClassName: 'bg-muted-foreground', muted: true },
}

/** External link type → label. Rendered as a text link with an outbound mark. */
export const LINK_META: Record<ProjectLinkType, { label: string }> = {
  github: { label: 'GitHub' },
  demo: { label: 'Live demo' },
  website: { label: 'Website' },
  docs: { label: 'Docs' },
}
