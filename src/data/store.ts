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
  const { data, error } = await supabase
    .from('projects')
    .update(inputToRow(input))
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return rowToProject(data as ProjectRow)
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
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
