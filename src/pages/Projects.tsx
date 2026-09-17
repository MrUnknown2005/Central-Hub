import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { SearchBar } from '@/components/common/SearchBar'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { Button } from '@/components/ui/button'
import { getProjects } from '@/data/services'
import { useProjectSearch } from '@/hooks/useProjectSearch'

export function Projects() {
  const allProjects = getProjects()
  const {
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
  } = useProjectSearch(allProjects)

  const isFiltering = activeFilterCount > 0 || query.trim().length > 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Search and filter every tool the club has shipped."
      />

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search projects, taglines, tech…"
      />

      <ProjectFilters
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />

      <p className="text-sm text-muted-foreground">
        {results.length} {results.length === 1 ? 'project' : 'projects'}
        {isFiltering ? ' matching' : ''}
      </p>

      {results.length > 0 ? (
        <ProjectGrid projects={results} />
      ) : (
        <EmptyState
          title="No projects found"
          description="Try a different search term or clear your filters to see everything."
          action={
            <Button variant="outline" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  )
}
