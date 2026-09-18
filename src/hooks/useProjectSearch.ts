import { useMemo, useState } from 'react'

import type { Project, ProjectCategory, ProjectStatus } from '@/types'

export type SortKey = 'recent' | 'name'
export type CategoryFilter = ProjectCategory | 'all'
export type StatusFilter = ProjectStatus | 'all'

/** Search + filter + sort state for the projects directory. Pure derivation via
 *  useMemo so it stays cheap; the same shape works once data comes from Supabase. */
export function useProjectSearch(projects: Project[]) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortKey>('recent')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()

    const filtered = projects.filter((project) => {
      if (category !== 'all' && project.category !== category) return false
      if (status !== 'all' && project.status !== status) return false
      if (!q) return true
      return (
        project.name.toLowerCase().includes(q) ||
        project.tagline.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.tech.some((tech) => tech.toLowerCase().includes(q))
      )
    })

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })
  }, [projects, query, category, status, sort])

  const activeFilterCount = (category !== 'all' ? 1 : 0) + (status !== 'all' ? 1 : 0)

  function reset() {
    setQuery('')
    setCategory('all')
    setStatus('all')
    setSort('recent')
  }

  return {
    query,
    setQuery,
    category,
    setCategory,
    status,
    setStatus,
    sort,
    setSort,
    results,
    activeFilterCount,
    reset,
  }
}
