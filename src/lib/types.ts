export type Category =
  | 'smartphones'
  | 'laptops'
  | 'headphones'
  | 'smartwatches'
  | 'tablets'
  | 'accessories'

export type PaletteKey =
  | 'indigo'
  | 'violet'
  | 'sky'
  | 'teal'
  | 'amber'
  | 'rose'
  | 'slate'

export interface Product {
  id: string
  name: string
  brand: string
  category: Category
  price: number
  rating: number
  reviewCount: number
  image: PaletteKey
  description: string
  features: string[]
  tags: string[]
  featured: boolean
  priceIsEstimate?: boolean
  sourceUrl?: string
}

export interface Recommendation {
  productId: string
  product?: Product
  score: number
  reason: string
}

export interface RecommendationResponse {
  summary: string
  recommendations: Recommendation[]
}

export interface ResolvedRecommendation {
  product: Product
  score: number
  reason: string
}

export type RecommendationErrorCode =
  | 'empty_preference'
  | 'missing_key'
  | 'invalid_key'
  | 'permission'
  | 'model'
  | 'rate_limit'
  | 'quota'
  | 'network'
  | 'invalid_response'
  | 'no_matches'
  | 'bad_request'
  | 'server'

export interface RecommendationErrorBody {
  error: string
  code: RecommendationErrorCode
  retryAfter?: number
}

export type CategoryFilter = Category | 'all'

export type SortKey =
  | 'featured'
  | 'priceLowHigh'
  | 'priceHighLow'
  | 'ratingHighLow'
  | 'nameAsc'

export interface StoredRecommendation {
  productId: string
  product?: Product
  score: number
  reason: string
}

export interface HistoryEntry {
  preference: string
  provider?: string
  model?: string
  summary: string
  items: StoredRecommendation[]
  timestamp: number
}
