import type { Project } from '@/types'
import {
  addProject as storeAddProject,
  deleteProject as storeDeleteProject,
  getProjectBySlug,
  listProjects,
  updateProject as storeUpdateProject,
  uploadProjectImage as storeUploadProjectImage,
} from './store'
import type { NewProjectInput } from './store'

/**
 * Single data-access seam for the whole app. Pages read through these functions
 * (or through route loaders that call them) and never import the store directly.
 * All calls are async now that the backend is Supabase.
 */

export function getProjects(): Promise<Project[]> {
  return listProjects()
}

export function getProject(slug: string): Promise<Project | null> {
  return getProjectBySlug(slug)
}

export function addProject(input: NewProjectInput): Promise<Project> {
  return storeAddProject(input)
}

export function updateProject(id: string, input: NewProjectInput): Promise<Project> {
  return storeUpdateProject(id, input)
}

export function deleteProject(id: string): Promise<void> {
  return storeDeleteProject(id)
}

export function uploadProjectImage(file: File): Promise<string> {
  return storeUploadProjectImage(file)
}

export type { NewProjectInput }
