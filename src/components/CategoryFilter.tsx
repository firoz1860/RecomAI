import { SearchIcon, ChevronDownIcon } from './icons'
import { categoryLabel, categoryOrder, cn } from '../lib/utils'
import type { CategoryFilter as CategoryFilterValue, SortKey } from '../lib/types'

interface CategoryFilterProps {
  active: CategoryFilterValue
  counts: Record<string, number>
  totalCount: number
  onCategoryChange: (value: CategoryFilterValue) => void
  search: string
  onSearchChange: (value: string) => void
  sort: SortKey
  onSortChange: (value: SortKey) => void
}

const sortLabels: Record<SortKey, string> = {
  featured: 'Featured',
  priceLowHigh: 'Price: low to high',
  priceHighLow: 'Price: high to low',
  ratingHighLow: 'Top rated',
  nameAsc: 'Name: A to Z'
}

export function CategoryFilter({
  active,
  counts,
  totalCount,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange
}: CategoryFilterProps) {
  const pills: Array<{ value: CategoryFilterValue; label: string; count: number }> = [
    { value: 'all', label: 'All', count: totalCount },
    ...categoryOrder.map((category) => ({
      value: category,
      label: categoryLabel(category),
      count: counts[category] ?? 0
    }))
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <SearchIcon className="h-4 w-4" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products, brands or features"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-card transition placeholder:text-slate-400 focus-ring"
            aria-label="Search products"
          />
        </div>
        <div className="relative sm:w-56">
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortKey)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-slate-700 shadow-card transition focus-ring"
            aria-label="Sort products"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <ChevronDownIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {pills.map((pill) => (
          <button
            key={pill.value}
            type="button"
            onClick={() => onCategoryChange(pill.value)}
            aria-pressed={active === pill.value}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus-ring',
              active === pill.value
                ? 'border-brand-600 bg-brand-600 text-white shadow-lift'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700'
            )}
          >
            {pill.label}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-xs',
                active === pill.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              )}
            >
              {pill.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
