import { useCallback, useState } from 'react'
import { requestRecommendations, RecommendationRequestError } from '../lib/api'
import { clampScore } from '../lib/utils'
import { clearStoredHistory, loadHistory, normalizePreference, persistHistory } from '../lib/history'
import type { ProviderId } from '../lib/providers'
import type {
  HistoryEntry,
  Product,
  RecommendationErrorCode,
  ResolvedRecommendation,
  StoredRecommendation
} from '../lib/types'

const cacheTtl = 1000 * 60 * 60 * 24
const maxHistory = 8

type Status = 'idle' | 'loading' | 'success' | 'error'

interface RecommendationState {
  status: Status
  summary: string
  results: ResolvedRecommendation[]
  errorCode: RecommendationErrorCode | null
  errorMessage: string
  retryAfter: number | null
  lastPreference: string
  fromCache: boolean
}

const initialState: RecommendationState = {
  status: 'idle',
  summary: '',
  results: [],
  errorCode: null,
  errorMessage: '',
  retryAfter: null,
  lastPreference: '',
  fromCache: false
}

export interface RecentSearch {
  preference: string
  timestamp: number
}

interface UseRecommendationsResult extends RecommendationState {
  recent: RecentSearch[]
  isCached: (preference: string) => boolean
  run: (preference: string, apiKey: string, provider: ProviderId, model: string) => Promise<void>
  reset: () => void
  clearHistory: () => void
}

export function useRecommendations(catalog: Product[]): UseRecommendationsResult {
  const [state, setState] = useState<RecommendationState>(initialState)
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())

  const findFreshEntry = useCallback(
    (preference: string): HistoryEntry | undefined => {
      const normalized = normalizePreference(preference)
      return history.find(
        (entry) => normalizePreference(entry.preference) === normalized && Date.now() - entry.timestamp < cacheTtl
      )
    },
    [history]
  )

  const isCached = useCallback(
    (preference: string): boolean => {
      const entry = findFreshEntry(preference)
      return entry ? resolveRecommendations(entry.items, catalog).length > 0 : false
    },
    [findFreshEntry, catalog]
  )

  const run = useCallback(
    async (preference: string, apiKey: string, provider: ProviderId, model: string) => {
      const trimmed = preference.trim()
      const normalized = normalizePreference(trimmed)
      setState((prev) => ({
        ...prev,
        status: 'loading',
        lastPreference: trimmed,
        errorCode: null,
        errorMessage: '',
        retryAfter: null
      }))

      const cached = findFreshEntry(trimmed)
      if (cached) {
        const resolvedFromCache = resolveRecommendations(cached.items, catalog)
        if (resolvedFromCache.length > 0) {
          setState({
            status: 'success',
            summary: cached.summary,
            results: resolvedFromCache,
            errorCode: null,
            errorMessage: '',
            retryAfter: null,
            lastPreference: trimmed,
            fromCache: true
          })
          return
        }
      }

      try {
        const response = await requestRecommendations({ preference: trimmed, products: catalog, provider, model }, apiKey)
        const resolved = resolveRecommendations(response.recommendations, catalog)

        if (resolved.length === 0) {
          setState({
            status: 'error',
            summary: '',
            results: [],
            errorCode: 'no_matches',
            errorMessage: 'No products in our catalog matched that request.',
            retryAfter: null,
            lastPreference: trimmed,
            fromCache: false
          })
          return
        }

        const items: StoredRecommendation[] = resolved.map((item) => ({
          productId: item.product.id,
          score: item.score,
          reason: item.reason
        }))
        const entry: HistoryEntry = {
          preference: trimmed,
          summary: response.summary,
          items,
          timestamp: Date.now()
        }
        setHistory((prev) => {
          const next = [entry, ...prev.filter((h) => normalizePreference(h.preference) !== normalized)].slice(
            0,
            maxHistory
          )
          persistHistory(next)
          return next
        })

        setState({
          status: 'success',
          summary: response.summary,
          results: resolved,
          errorCode: null,
          errorMessage: '',
          retryAfter: null,
          lastPreference: trimmed,
          fromCache: false
        })
      } catch (error) {
        const code: RecommendationErrorCode =
          error instanceof RecommendationRequestError ? error.code : 'server'
        const message =
          error instanceof RecommendationRequestError
            ? error.message
            : 'Something went wrong while generating recommendations.'
        const retryAfter =
          error instanceof RecommendationRequestError && typeof error.retryAfter === 'number'
            ? error.retryAfter
            : null
        setState({
          status: 'error',
          summary: '',
          results: [],
          errorCode: code,
          errorMessage: message,
          retryAfter,
          lastPreference: trimmed,
          fromCache: false
        })
      }
    },
    [catalog, findFreshEntry]
  )

  const reset = useCallback(() => {
    setState((prev) => ({ ...initialState, lastPreference: prev.lastPreference }))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    clearStoredHistory()
  }, [])

  const recent: RecentSearch[] = history.map((entry) => ({
    preference: entry.preference,
    timestamp: entry.timestamp
  }))

  return { ...state, recent, isCached, run, reset, clearHistory }
}

function resolveRecommendations(
  raw: Array<{ productId: string; score: number; reason: string }>,
  catalog: Product[]
): ResolvedRecommendation[] {
  const byId = new Map(catalog.map((product) => [product.id, product]))
  const seen = new Set<string>()
  const resolved: ResolvedRecommendation[] = []

  for (const item of raw) {
    if (!item || typeof item.productId !== 'string') {
      continue
    }
    const product = byId.get(item.productId)
    if (!product || seen.has(product.id)) {
      continue
    }
    seen.add(product.id)
    resolved.push({
      product,
      score: clampScore(Number(item.score)),
      reason: typeof item.reason === 'string' ? item.reason : ''
    })
    if (resolved.length === 3) {
      break
    }
  }

  return resolved.sort((a, b) => b.score - a.score)
}
