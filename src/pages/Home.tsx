import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { CategoryFilter } from '../components/CategoryFilter'
import { ProductGrid } from '../components/ProductGrid'
import { ProductDetailModal } from '../components/ProductDetailModal'
import { ApiKeyModal } from '../components/ApiKeyModal'
import { RecommendationResults } from '../components/RecommendationResults'
import { RecentSearches } from '../components/RecentSearches'
import { LoadingRecommendations } from '../components/LoadingRecommendations'
import { EmptyState } from '../components/EmptyState'
import { useApiKey } from '../hooks/useApiKey'
import { useRecommendations } from '../hooks/useRecommendations'
import { products } from '../data/products'
import { matchesCategory, matchesSearch, sortProducts } from '../lib/utils'
import { getProvider } from '../lib/providers'
import type { ProviderId } from '../lib/providers'
import type {
  CategoryFilter as CategoryFilterValue,
  Product,
  RecommendationErrorCode,
  ResolvedRecommendation,
  SortKey
} from '../lib/types'

const keyErrorCodes: RecommendationErrorCode[] = ['missing_key', 'invalid_key', 'permission']

export function Home() {
  const { apiKey, providerId, modelId, hasKey, remember, saveKey, clearKey } = useApiKey()
  const recommendations = useRecommendations(products)

  const [preference, setPreference] = useState('')
  const [preferenceError, setPreferenceError] = useState('')
  const [category, setCategory] = useState<CategoryFilterValue>('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('featured')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [keyModalOpen, setKeyModalOpen] = useState(false)
  const [pendingPreference, setPendingPreference] = useState<string | null>(null)

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
    if (recommendations.isCached(trimmed)) {
      void recommendations.run(trimmed, apiKey, providerId, modelId)
      return
    }
    if (!hasKey) {
      setPendingPreference(trimmed)
      setKeyModalOpen(true)
      return
    }
    void recommendations.run(trimmed, apiKey, providerId, modelId)
  }

  function handleSelectRecent(value: string) {
    setPreference(value)
    startRequest(value)
  }

  function handleSaveKey(key: string, provider: ProviderId, model: string, rememberForTab: boolean) {
    saveKey(key, provider, model, rememberForTab)
    if (pendingPreference) {
      const next = pendingPreference
      setPendingPreference(null)
      void recommendations.run(next, key, provider, model)
    }
  }

  function handleManageKey() {
    setPendingPreference(null)
    setKeyModalOpen(true)
  }

  const code = recommendations.errorCode
  const currentProvider = getProvider(providerId)
  const billingUrl = currentProvider?.billingUrl ?? 'https://platform.openai.com/settings/organization/billing'
  const needsKey = code !== null && keyErrorCodes.includes(code)
  let errorActionLabel: string | undefined
  let errorAction: (() => void) | undefined
  let errorActionHref: string | undefined
  if (needsKey) {
    errorActionLabel = code === 'missing_key' ? 'Connect API key' : 'Update API key'
    errorAction = handleManageKey
  } else if (code === 'model') {
    errorActionLabel = 'Change provider'
    errorAction = handleManageKey
  } else if (code === 'quota') {
    errorActionLabel = `Add credits in ${currentProvider?.label ?? 'your provider'}`
    errorActionHref = billingUrl
  } else if (code === 'no_matches') {
    errorActionLabel = undefined
  } else {
    errorActionLabel = 'Try again'
    errorAction = () => startRequest(recommendations.lastPreference)
  }

  return (
    <div className="min-h-screen">
      <Header
        hasKey={hasKey}
        providerLabel={currentProvider?.label ?? 'Provider'}
        onManageKey={handleManageKey}
      />

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

      <main className="mx-auto max-w-7xl space-y-8 px-4 pb-20 sm:px-6 lg:px-8">
        {preferenceError && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
            {preferenceError}
          </p>
        )}

        <RecentSearches
          items={recommendations.recent}
          onSelect={handleSelectRecent}
          onClear={recommendations.clearHistory}
        />

        {recommendations.status === 'loading' && <LoadingRecommendations />}

        {recommendations.status === 'success' && (
          <RecommendationResults
            summary={recommendations.summary}
            preference={recommendations.lastPreference}
            results={recommendations.results}
            fromCache={recommendations.fromCache}
            onSelect={(recommendation: ResolvedRecommendation) => setSelectedProduct(recommendation.product)}
            onDismiss={recommendations.reset}
          />
        )}

        {recommendations.status === 'error' && (
          <EmptyState
            variant="error"
            title="We could not finish that"
            message={recommendations.errorMessage}
            actionLabel={errorActionLabel}
            onAction={errorAction}
            actionHref={errorActionHref}
            retryAfter={code === 'rate_limit' ? recommendations.retryAfter ?? undefined : undefined}
          />
        )}

        <section className="space-y-6 pt-2">
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
          setPendingPreference(null)
        }}
        onSave={handleSaveKey}
        onClear={clearKey}
        hasKey={hasKey}
        remember={remember}
        providerId={providerId}
        model={modelId}
      />

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
