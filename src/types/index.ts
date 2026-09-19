/** Domain types for Central Hub. Kept framework-agnostic so the Supabase
 *  swap later only touches `src/data/services.ts`, not these shapes. */

export type ProjectStatus = 'live' | 'beta' | 'wip' | 'archived'

export type ProjectCategory =
  | 'web'
  | 'mobile'
  | 'cli'
  | 'bot'
  | 'api'
  | 'ai'
  | 'game'
  | 'tool'

/** External destinations for a project. No repo links — repos are private. */
export type ProjectLinkType = 'website' | 'demo' | 'docs'

export interface ProjectLink {
  type: ProjectLinkType
  url: string
}

export interface Project {
  id: string
  slug: string
  name: string
  /** One-line "tool the club built" summary. */
  tagline: string
  /** Long-form copy for the detail page. */
  description: string
  category: ProjectCategory
  status: ProjectStatus
  tech: string[]
  links: ProjectLink[]
  /** Surfaced in Quick Launch on the dashboard. */
  featured: boolean
  /** Public URL of the project's PNG logo in Supabase Storage, or null. */
  image: string | null
  createdAt: string
  updatedAt: string
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'web',
  'mobile',
  'cli',
  'bot',
  'api',
  'ai',
  'game',
  'tool',
]

export const PROJECT_STATUSES: ProjectStatus[] = ['live', 'beta', 'wip', 'archived']
