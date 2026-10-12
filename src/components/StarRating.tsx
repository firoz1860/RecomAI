import { StarIcon } from './icons'
import { cn, formatRating } from '../lib/utils'

interface StarRatingProps {
  rating: number
  reviewCount?: number
  className?: string
}

export function StarRating({ rating, reviewCount, className }: StarRatingProps) {
  const rounded = Math.round(rating)
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            className={cn('h-3.5 w-3.5', index < rounded ? 'text-amber-400' : 'text-slate-200')}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-slate-700">{formatRating(rating)}</span>
      {typeof reviewCount === 'number' && (
        <span className="text-xs text-slate-400">({reviewCount.toLocaleString('en-US')})</span>
      )}
      <span className="sr-only">
        Rated {formatRating(rating)} out of 5
        {typeof reviewCount === 'number' ? ` from ${reviewCount} reviews` : ''}
      </span>
    </div>
  )
}
