import { ProductThumb } from './ProductThumb'
import { StarRating } from './StarRating'
import { categoryLabel, formatPrice } from '../lib/utils'
import type { Product } from '../lib/types'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-card transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift focus-ring"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <ProductThumb
          palette={product.image}
          category={product.category}
          brand={product.brand}
          className="h-full w-full transition duration-300 group-hover:scale-[1.03]"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-card">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {categoryLabel(product.category)}
          </span>
          <StarRating rating={product.rating} />
        </div>
        <h3 className="text-base font-semibold leading-snug text-slate-900">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
          <span className="text-sm font-medium text-brand-600 transition group-hover:translate-x-0.5">
            View details
          </span>
        </div>
      </div>
    </button>
  )
}
