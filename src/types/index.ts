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

export type ProjectLinkType = 'github' | 'demo' | 'website' | 'docs'

export interface ProjectLink {
  type: ProjectLinkType
  url: string
}

/** Gradient seed for a project's icon chip / cover. */
export interface ProjectAccent {
  from: string
  to: string
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
  accent: ProjectAccent
  featured: boolean
  stars: number
  contributorIds: string[]
  createdAt: string
  updatedAt: string
}

export interface MemberLinks {
  github?: string
  linkedin?: string
  website?: string
}

export interface Member {
  id: string
  name: string
  role: string
  avatar?: string
  bio?: string
  links?: MemberLinks
  projectIds: string[]
}

export interface HubStats {
  totalProjects: number
  liveProjects: number
  totalMembers: number
  totalStars: number
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
