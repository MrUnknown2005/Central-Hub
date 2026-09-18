import type { Project } from '@/types'
import { projects as seed } from './projects'

/**
 * localStorage-backed project store. This is the mutable layer behind the
 * `data/services.ts` seam: reads and writes stay synchronous so components can
 * call them in render and re-read on navigation. Moving to Supabase later
 * replaces these bodies with a `projects` table (and reads become async).
 *
 * Caveat: localStorage is per-browser, so projects added on one device/profile
 * are not visible on another until the backend swap.
 */

const STORAGE_KEY = 'central-hub-projects'

/** Fields collected from the Add Project form. Everything else is generated. */
export type NewProjectInput = Omit<Project, 'id' | 'slug' | 'createdAt' | 'updatedAt'>

function read(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      // First load: fall back to the seed (empty today) and persist it.
      write(seed)
      return [...seed]
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Project[]) : []
  } catch {
    return []
  }
}

function write(list: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Storage full or unavailable — nothing we can do here; reads will fall back.
  }
}

export function listProjects(): Project[] {
  return read()
}

export function getProjectBySlug(slug: string): Project | undefined {
  return read().find((p) => p.slug === slug)
}

/** Lowercase kebab slug, de-duped against existing projects (`name`, `name-2`, …). */
function makeSlug(name: string, existing: Project[]): string {
  const base =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'project'

  const taken = new Set(existing.map((p) => p.slug))
  if (!taken.has(base)) return base

  let n = 2
  while (taken.has(`${base}-${n}`)) n += 1
  return `${base}-${n}`
}

export function addProject(input: NewProjectInput): Project {
  const list = read()
  const now = new Date().toISOString()
  const project: Project = {
    ...input,
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `p_${Date.now()}`,
    slug: makeSlug(input.name, list),
    createdAt: now,
    updatedAt: now,
  }
  write([project, ...list])
  return project
}
