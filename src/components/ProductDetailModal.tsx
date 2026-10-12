import { Modal } from './Modal'
import { ProductThumb } from './ProductThumb'
import { StarRating } from './StarRating'
import { CheckIcon } from './icons'
import { categoryLabel, formatPrice } from '../lib/utils'
import type { Product } from '../lib/types'

interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  return (
    <Modal
      open={product !== null}
      onClose={onClose}
      title={product ? product.name : ''}
      size="lg"
      labelledBy="product-detail-title"
    >
      {product && (
        <div className="space-y-5">
          <div className="overflow-hidden rounded-2xl">
            <ProductThumb
              palette={product.image}
              category={product.category}
              brand={product.brand}
              className="aspect-[16/9] w-full"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {product.brand} / {categoryLabel(product.category)}
              </p>
              {product.rating > 0 && <StarRating rating={product.rating} reviewCount={product.reviewCount} className="mt-1" />}
            </div>
            <span className="text-right">
              <span className="block text-2xl font-bold text-slate-900">{product.price > 0 ? formatPrice(product.price) : 'Price varies'}</span>
              {product.priceIsEstimate && <span className="block text-xs font-medium text-slate-400">AI estimate; verify with retailer</span>}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-900">Key features</h3>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          {product.sourceUrl?.startsWith('https://www.google.com/search?') && (
            <a href={product.sourceUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-ring">
              Check current listings
            </a>
          )}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
