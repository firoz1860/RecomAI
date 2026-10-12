import type {
  Category,
  CategoryFilter,
  PaletteKey,
  Product,
  SortKey
} from './types'

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

export function formatPrice(value: number): string {
  return priceFormatter.format(value)
}

export function clampScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 0
  }
  return Math.max(0, Math.min(100, Math.round(value)))
}

const categoryLabels: Record<Category, string> = {
  smartphones: 'Smartphones',
  laptops: 'Laptops',
  headphones: 'Headphones',
  smartwatches: 'Smartwatches',
  tablets: 'Tablets',
  accessories: 'Accessories'
}

export function categoryLabel(category: Category): string {
  return categoryLabels[category]
}

export const categoryOrder: Category[] = [
  'smartphones',
  'laptops',
  'headphones',
  'smartwatches',
  'tablets',
  'accessories'
]

const palettes: Record<PaletteKey, { from: string; to: string; glyph: string }> = {
  indigo: { from: '#6366f1', to: '#4338ca', glyph: '#c7d2fe' },
  violet: { from: '#8b5cf6', to: '#6d28d9', glyph: '#ddd6fe' },
  sky: { from: '#38bdf8', to: '#0369a1', glyph: '#bae6fd' },
  teal: { from: '#2dd4bf', to: '#0f766e', glyph: '#99f6e4' },
  amber: { from: '#fbbf24', to: '#b45309', glyph: '#fde68a' },
  rose: { from: '#fb7185', to: '#be123c', glyph: '#fecdd3' },
  slate: { from: '#64748b', to: '#1e293b', glyph: '#cbd5e1' }
}

export function paletteFor(key: PaletteKey): { from: string; to: string; glyph: string } {
  return palettes[key]
}

export function matchesCategory(product: Product, filter: CategoryFilter): boolean {
  return filter === 'all' || product.category === filter
}

export function matchesSearch(product: Product, query: string): boolean {
  const trimmed = query.trim().toLowerCase()
  if (trimmed.length === 0) {
    return true
  }
  const haystack = [
    product.name,
    product.brand,
    product.description,
    categoryLabel(product.category),
    ...product.features,
    ...product.tags
  ]
    .join(' ')
    .toLowerCase()
  return trimmed
    .split(/\s+/)
    .every((token) => haystack.includes(token))
}

export function sortProducts(products: Product[], key: SortKey): Product[] {
  const copy = [...products]
  switch (key) {
    case 'priceLowHigh':
      return copy.sort((a, b) => a.price - b.price)
    case 'priceHighLow':
      return copy.sort((a, b) => b.price - a.price)
    case 'ratingHighLow':
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    case 'nameAsc':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'featured':
    default:
      return copy.sort((a, b) => {
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1
        }
        return b.rating - a.rating
      })
  }
}

export function formatRating(value: number): string {
  return value.toFixed(1)
}
