import { useCallback, useState } from 'react'
import { requestRecommendations, RecommendationRequestError } from '../lib/api'
import { clampScore } from '../lib/utils'
import type {
  Product,
  RecommendationErrorCode,
  ResolvedRecommendation
} from '../lib/types'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface RecommendationState {
  status: Status
  summary: string
  results: ResolvedRecommendation[]
  errorCode: RecommendationErrorCode | null
  errorMessage: string
  lastPreference: string
}

const initialState: RecommendationState = {
  status: 'idle',
  summary: '',
  results: [],
  errorCode: null,
  errorMessage: '',
  lastPreference: ''
}

interface UseRecommendationsResult extends RecommendationState {
  run: (preference: string, apiKey: string) => Promise<void>
  reset: () => void
}

export function useRecommendations(catalog: Product[]): UseRecommendationsResult {
  const [state, setState] = useState<RecommendationState>(initialState)

  const run = useCallback(
    async (preference: string, apiKey: string) => {
      const trimmed = preference.trim()
      setState((prev) => ({ ...prev, status: 'loading', lastPreference: trimmed }))

      try {
        const response = await requestRecommendations(
          { preference: trimmed, products: catalog },
          apiKey
        )

        const resolved = resolveRecommendations(response.recommendations, catalog)

        if (resolved.length === 0) {
          setState({
            status: 'error',
            summary: '',
            results: [],
            errorCode: 'no_matches',
            errorMessage: 'No products in our catalog matched that request.',
            lastPreference: trimmed
          })
          return
        }

        setState({
          status: 'success',
          summary: response.summary,
          results: resolved,
          errorCode: null,
          errorMessage: '',
          lastPreference: trimmed
        })
      } catch (error) {
        const code: RecommendationErrorCode =
          error instanceof RecommendationRequestError ? error.code : 'server'
        const message =
          error instanceof RecommendationRequestError
            ? error.message
            : 'Something went wrong while generating recommendations.'
        setState({
          status: 'error',
          summary: '',
          results: [],
          errorCode: code,
          errorMessage: message,
          lastPreference: trimmed
        })
      }
    },
    [catalog]
  )

  const reset = useCallback(() => setState(initialState), [])

  return { ...state, run, reset }
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
