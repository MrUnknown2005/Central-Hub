import { cn } from '@/lib/utils'

/** Editorial search field: a single ruled line that darkens to ink on focus.
 *  No leading icon — the placeholder does the signposting. */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search projects, tech, people…',
  className,
  autoFocus,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}) {
  return (
    <div className={cn('relative', className)}>
      <input
        type="search"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full border-0 border-b border-input bg-transparent pr-8 pb-2.5 text-lg outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute top-1 right-0 grid size-7 place-items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true" className="text-base">
            ✕
          </span>
        </button>
      )}
    </div>
  )
}
