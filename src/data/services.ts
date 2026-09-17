import type { HubStats, Member, Project } from '@/types'
import { members } from './members'
import { projects } from './projects'

/**
 * Single data-access seam for the whole app. Every page/component reads through
 * these functions and never imports the raw arrays. When we move to Supabase,
 * only these bodies change (sync → async queries) — the UI stays put.
 */

export function getProjects(): Project[] {
  return projects
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}

/** Most-recently-updated first. */
export function getRecentProjects(limit = 6): Project[] {
  return [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
}

export function getMembers(): Member[] {
  return members
}

export function getMember(id: string): Member | undefined {
  return members.find((m) => m.id === id)
}

/** Resolve a list of contributor ids to member records, preserving order. */
export function getMembersByIds(ids: string[]): Member[] {
  return ids
    .map((id) => members.find((m) => m.id === id))
    .filter((m): m is Member => Boolean(m))
}

/** Resolve a member's projects from their `projectIds`. */
export function getProjectsByIds(ids: string[]): Project[] {
  return ids
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p))
}

export function getStats(): HubStats {
  return {
    totalProjects: projects.length,
    liveProjects: projects.filter((p) => p.status === 'live').length,
    totalMembers: members.length,
    totalStars: projects.reduce((sum, p) => sum + p.stars, 0),
  }
}

/** Every distinct tech tag across the catalog, alphabetized — powers filters. */
export function getAllTech(): string[] {
  return Array.from(new Set(projects.flatMap((p) => p.tech))).sort((a, b) =>
    a.localeCompare(b),
  )
}
