import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { CategoryFilter } from '../components/CategoryFilter'
import { ProductGrid } from '../components/ProductGrid'
import { ProductDetailModal } from '../components/ProductDetailModal'
import { ApiKeyModal } from '../components/ApiKeyModal'
import { RecommendationResults } from '../components/RecommendationResults'
import { LoadingRecommendations } from '../components/LoadingRecommendations'
import { EmptyState } from '../components/EmptyState'
import { useApiKey } from '../hooks/useApiKey'
import { useRecommendations } from '../hooks/useRecommendations'
import { products } from '../data/products'
import { matchesCategory, matchesSearch, sortProducts } from '../lib/utils'
import type {
  CategoryFilter as CategoryFilterValue,
  Product,
  ResolvedRecommendation,
  SortKey
} from '../lib/types'

export function Home() {
  const { apiKey, hasKey, remember, saveKey, clearKey } = useApiKey()
  const recommendations = useRecommendations(products)

  const [preference, setPreference] = useState('')
  const [preferenceError, setPreferenceError] = useState('')
  const [category, setCategory] = useState<CategoryFilterValue>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('featured')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [keyModalOpen, setKeyModalOpen] = useState(false)
  const [pendingRun, setPendingRun] = useState(false)

  const counts = useMemo(() => {
    return products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1
      return acc
    }, {})
  }, [])

  const visibleProducts = useMemo(() => {
    const filtered = products.filter(
      (product) => matchesCategory(product, category) && matchesSearch(product, search)
    )
    return sortProducts(filtered, sort)
  }, [category, search, sort])

  function startRequest(nextPreference: string) {
    const trimmed = nextPreference.trim()
    if (!trimmed) {
      setPreferenceError('Please describe what you are looking for first.')
      return
    }
    setPreferenceError('')
    if (!hasKey) {
      setPendingRun(true)
      setKeyModalOpen(true)
      return
    }
    void recommendations.run(trimmed, apiKey)
  }

  function handleSaveKey(key: string, rememberForTab: boolean) {
    saveKey(key, rememberForTab)
    if (pendingRun) {
      setPendingRun(false)
      void recommendations.run(preference.trim(), key)
    }
  }

  function handleManageKey() {
    setPendingRun(false)
    setKeyModalOpen(true)
  }

  const showConnectAction =
    recommendations.errorCode === 'missing_key' || recommendations.errorCode === 'invalid_key'

  return (
    <div className="min-h-screen">
      <Header hasKey={hasKey} onManageKey={handleManageKey} />

      <Hero
        preference={preference}
        onPreferenceChange={(value) => {
          setPreference(value)
          if (preferenceError) {
            setPreferenceError('')
          }
        }}
        onSubmit={() => startRequest(preference)}
        loading={recommendations.status === 'loading'}
        hasKey={hasKey}
      />

      <main className="mx-auto max-w-7xl space-y-10 px-4 pb-20 sm:px-6 lg:px-8">
        {preferenceError && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
            {preferenceError}
          </p>
        )}

        {recommendations.status === 'loading' && <LoadingRecommendations />}

        {recommendations.status === 'success' && (
          <RecommendationResults
            summary={recommendations.summary}
            preference={recommendations.lastPreference}
            results={recommendations.results}
            onSelect={(recommendation: ResolvedRecommendation) =>
              setSelectedProduct(recommendation.product)
            }
            onDismiss={recommendations.reset}
          />
        )}

        {recommendations.status === 'error' && (
          <EmptyState
            variant="error"
            title="We could not finish that"
            message={recommendations.errorMessage}
            actionLabel={showConnectAction ? 'Connect API key' : 'Try again'}
            onAction={
              showConnectAction ? handleManageKey : () => startRequest(recommendations.lastPreference)
            }
          />
        )}

        <section className="space-y-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Explore products</h2>
            <p className="text-sm text-slate-500">
              Browse the full catalog or let the AI narrow it down for you.
            </p>
          </div>

          <CategoryFilter
            active={category}
            counts={counts}
            totalCount={products.length}
            onCategoryChange={setCategory}
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
          />

          {visibleProducts.length > 0 ? (
            <ProductGrid products={visibleProducts} onSelect={setSelectedProduct} />
          ) : (
            <EmptyState
              title="No products found"
              message="No products match your filters. Try a different category or clear your search."
              actionLabel="Clear filters"
              onAction={() => {
                setSearch('')
                setCategory('all')
              }}
            />
          )}
        </section>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-sm text-slate-400 sm:flex-row sm:text-left sm:px-6 lg:px-8">
          <span>RecomAI product recommendations</span>
          <span>Recommendations are generated from a fixed local catalog.</span>
        </div>
      </footer>

      <ApiKeyModal
        open={keyModalOpen}
        onClose={() => {
          setKeyModalOpen(false)
          setPendingRun(false)
        }}
        onSave={handleSaveKey}
        onClear={clearKey}
        hasKey={hasKey}
        remember={remember}
      />

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
