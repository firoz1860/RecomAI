import { RecommendationCard } from './RecommendationCard'
import { SparklesIcon, CloseIcon } from './icons'
import type { ResolvedRecommendation } from '../lib/types'

interface RecommendationResultsProps {
  summary: string
  preference: string
  results: ResolvedRecommendation[]
  onSelect: (recommendation: ResolvedRecommendation) => void
  onDismiss: () => void
}

export function RecommendationResults({
  summary,
  preference,
  results,
  onSelect,
  onDismiss
}: RecommendationResultsProps) {
  return (
    <section className="animate-fadeIn rounded-3xl border border-brand-100 bg-white/80 p-5 shadow-card sm:p-7" aria-live="polite">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-lift">
            <SparklesIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">Your matches</h2>
            {preference && (
              <p className="text-sm text-slate-500">
                Based on: <span className="font-medium text-slate-700">{preference}</span>
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-ring"
          aria-label="Dismiss recommendations"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>
      {summary && <p className="mb-5 text-sm leading-relaxed text-slate-600">{summary}</p>}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((recommendation, index) => (
          <RecommendationCard
            key={recommendation.product.id}
            recommendation={recommendation}
            rank={index + 1}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
