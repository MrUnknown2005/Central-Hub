import type { Project } from '@/types'
import { addProject as storeAddProject, getProjectBySlug, listProjects } from './store'
import type { NewProjectInput } from './store'

/**
 * Single data-access seam for the whole app. Every page/component reads through
 * these functions and never imports the store directly. When we move to
 * Supabase, only these bodies change (sync → async queries) — the UI stays put.
 */

export function getProjects(): Project[] {
  return listProjects()
}

export function getProject(slug: string): Project | undefined {
  return getProjectBySlug(slug)
}

export function getFeaturedProjects(): Project[] {
  return listProjects().filter((p) => p.featured)
}

/** Most-recently-updated first. */
export function getRecentProjects(limit = 6): Project[] {
  return [...listProjects()]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
}

export function addProject(input: NewProjectInput): Project {
  return storeAddProject(input)
}

export type { NewProjectInput }
