import { SparklesIcon } from './icons'
import type { RecentSearch } from '../hooks/useRecommendations'

interface RecentSearchesProps {
  items: RecentSearch[]
  onSelect: (preference: string) => void
  onClear: () => void
}

export function RecentSearches({ items, onSelect, onClear }: RecentSearchesProps) {
  if (items.length === 0) {
    return null
  }
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <SparklesIcon className="h-4 w-4 text-brand-500" />
          Recent searches
        </span>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:text-rose-600 focus-ring"
        >
          Clear saved
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.preference + item.timestamp}
            type="button"
            onClick={() => onSelect(item.preference)}
            className="max-w-full truncate rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus-ring"
            title={item.preference}
          >
            {item.preference}
          </button>
        ))}
      </div>
    </section>
  )
}
