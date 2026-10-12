import { ProductThumb } from './ProductThumb'
import { StarRating } from './StarRating'
import { categoryLabel, formatPrice } from '../lib/utils'
import type { ResolvedRecommendation } from '../lib/types'

interface RecommendationCardProps {
  recommendation: ResolvedRecommendation
  rank: number
  onSelect: (recommendation: ResolvedRecommendation) => void
}

export function RecommendationCard({ recommendation, rank, onSelect }: RecommendationCardProps) {
  const { product, score, reason } = recommendation
  return (
    <button
      type="button"
      onClick={() => onSelect(recommendation)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white text-left shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift focus-ring"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <ProductThumb
          palette={product.image}
          category={product.category}
          brand={product.brand}
          className="h-full w-full"
        />
        <span className="absolute left-3 top-3 flex h-7 items-center rounded-full bg-brand-600 px-2.5 text-xs font-semibold text-white shadow-lift">
          Top pick {rank}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-700 shadow-card">
          {score}% match
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {categoryLabel(product.category)}
          </span>
          <StarRating rating={product.rating} />
        </div>
        <h3 className="text-base font-semibold leading-snug text-slate-900">{product.name}</h3>
        <p className="rounded-xl bg-brand-50/70 px-3 py-2 text-sm text-slate-600">{reason}</p>
        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
          <span className="text-sm font-medium text-brand-600">View details</span>
        </div>
      </div>
    </button>
  )
}
