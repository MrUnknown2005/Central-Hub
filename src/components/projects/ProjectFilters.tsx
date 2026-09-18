import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { CATEGORY_META, STATUS_META } from '@/lib/catalog'
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/types'
import type { CategoryFilter, SortKey, StatusFilter } from '@/hooks/useProjectSearch'

/** A single text toggle. Active = ink + underline; inactive = muted. */
function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'whitespace-nowrap text-sm underline-offset-4 transition-colors',
        active
          ? 'font-medium text-foreground underline decoration-2'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Recent' },
  { key: 'name', label: 'Name' },
]

/** Category + status text toggles and a sort control. */
export function ProjectFilters({
  category,
  setCategory,
  status,
  setStatus,
  sort,
  setSort,
}: {
  category: CategoryFilter
  setCategory: (value: CategoryFilter) => void
  status: StatusFilter
  setStatus: (value: StatusFilter) => void
  sort: SortKey
  setSort: (value: SortKey) => void
}) {
  return (
    <div className="space-y-4">
      <div className="no-scrollbar -mx-1 flex gap-x-4 gap-y-2 overflow-x-auto px-1 sm:flex-wrap">
        <Toggle active={category === 'all'} onClick={() => setCategory('all')}>
          All
        </Toggle>
        {PROJECT_CATEGORIES.map((key) => (
          <Toggle key={key} active={category === key} onClick={() => setCategory(key)}>
            {CATEGORY_META[key].label}
          </Toggle>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="no-scrollbar -mx-1 flex gap-x-4 gap-y-2 overflow-x-auto px-1 sm:flex-wrap">
          <Toggle active={status === 'all'} onClick={() => setStatus('all')}>
            Any status
          </Toggle>
          {PROJECT_STATUSES.map((key) => (
            <Toggle key={key} active={status === key} onClick={() => setStatus(key)}>
              {STATUS_META[key].label}
            </Toggle>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Sort</span>
          <div className="flex gap-4">
            {SORT_OPTIONS.map((option) => (
              <Toggle
                key={option.key}
                active={sort === option.key}
                onClick={() => setSort(option.key)}
              >
                {option.label}
              </Toggle>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
