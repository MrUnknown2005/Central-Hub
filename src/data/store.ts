import { supabase } from '@/lib/supabase'
import type { Project } from '@/types'

/**
 * Project store, backed by the Supabase `projects` table and the
 * `project-images` storage bucket. Every function is async. Reads are resilient
 * (they log and return empty on error so the public site never crashes on a bad
 * fetch); writes throw so the form can surface the failure. Row shape is mapped
 * to/from the `Project` type here, so the rest of the app never sees snake_case.
 *
 * Access is enforced by RLS in `supabase/schema.sql`: anyone may read, only
 * admins may insert/update/delete. This layer just issues the queries.
 */

/** Fields collected from the project form. Everything else is generated. */
export type NewProjectInput = Omit<Project, 'id' | 'slug' | 'createdAt' | 'updatedAt'>

const BUCKET = 'project-images'

interface ProjectRow {
  id: string
  slug: string
  name: string
  tagline: string
  description: string | null
  category: Project['category']
  status: Project['status']
  tech: string[] | null
  links: Project['links'] | null
  featured: boolean
  image_url: string | null
  created_at: string
  updated_at: string
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description ?? '',
    category: row.category,
    status: row.status,
    tech: row.tech ?? [],
    links: row.links ?? [],
    featured: row.featured,
    image: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** Map the UI input to the table's columns (camelCase → snake_case for image). */
function inputToRow(input: NewProjectInput) {
  return {
    name: input.name,
    tagline: input.tagline,
    description: input.description,
    category: input.category,
    status: input.status,
    tech: input.tech,
    links: input.links,
    featured: input.featured,
    image_url: input.image,
  }
}

/** In-bucket object path from a public URL we created, or null if not ours. */
function ownedStoragePath(url: string | null): string | null {
  if (!url) return null
  const marker = `/object/public/${BUCKET}/`
  const i = url.indexOf(marker)
  return i === -1 ? null : url.slice(i + marker.length)
}

/**
 * Best-effort delete of a previously-uploaded logo. Never throws: a failed
 * cleanup shouldn't roll back a project write that already succeeded, and the
 * row — not the bucket — is the source of truth for what the site shows.
 */
async function removeStoredImage(url: string | null): Promise<void> {
  const path = ownedStoragePath(url)
  if (!path) return
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) console.warn('removeStoredImage failed:', error.message)
}

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) {
    console.error('listProjects failed:', error.message)
    return []
  }
  return (data as ProjectRow[]).map(rowToProject)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) {
    console.error('getProjectBySlug failed:', error.message)
    return null
  }
  return data ? rowToProject(data as ProjectRow) : null
}

export async function addProject(input: NewProjectInput): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(inputToRow(input))
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return rowToProject(data as ProjectRow)
}

export async function updateProject(id: string, input: NewProjectInput): Promise<Project> {
  // Remember the current logo so we can clean it up if the image changed.
  const { data: prev } = await supabase
    .from('projects')
    .select('image_url')
    .eq('id', id)
    .maybeSingle()

  const { data, error } = await supabase
    .from('projects')
    .update(inputToRow(input))
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)

  const previousImage = (prev as { image_url: string | null } | null)?.image_url ?? null
  if (previousImage && previousImage !== input.image) {
    await removeStoredImage(previousImage)
  }
  return rowToProject(data as ProjectRow)
}

export async function deleteProject(id: string): Promise<void> {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .select('image_url')
    .maybeSingle()
  if (error) throw new Error(error.message)
  await removeStoredImage((data as { image_url: string | null } | null)?.image_url ?? null)
}

/** Upload a PNG to the public bucket and return its public URL. */
export async function uploadProjectImage(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}.png`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: 'image/png', upsert: false })
  if (error) throw new Error(error.message)
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}
