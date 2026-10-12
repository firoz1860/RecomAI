import type { Product, RecommendationErrorCode, RecommendationResponse } from './types'
import type { ProviderId } from './providers'

export class RecommendationRequestError extends Error {
  code: RecommendationErrorCode
  retryAfter?: number

  constructor(code: RecommendationErrorCode, message: string, retryAfter?: number) {
    super(message)
    this.name = 'RecommendationRequestError'
    this.code = code
    this.retryAfter = retryAfter
  }
}

const baseMessages: Record<RecommendationErrorCode, string> = {
  empty_preference: 'Please describe what you are looking for first.',
  missing_key: 'Add an API key to get recommendations.',
  invalid_key: 'Your API key was rejected. It may be incorrect, expired, or revoked. Please reconnect a valid key.',
  permission: 'This API key does not have access to the selected model. Check your provider project permissions.',
  model: 'The selected model is not available for this key. Try a different model or provider.',
  rate_limit: 'You are sending requests too quickly. Please wait a moment and retry.',
  quota: 'This account has no available credits or quota. Add credits or billing for your provider and try again.',
  network: 'We could not reach the recommendation service. Check your connection and retry.',
  invalid_response: 'The AI returned an unexpected response. Please try again.',
  no_matches: 'The AI could not suggest a suitable product. Try adding a budget, category, or must-have feature.',
  bad_request: 'The request was invalid. Please try again.',
  server: 'Something went wrong while generating recommendations.'
}

export function messageForCode(code: RecommendationErrorCode, retryAfter?: number): string {
  if (code === 'rate_limit' && typeof retryAfter === 'number' && retryAfter > 0) {
    const unit = retryAfter === 1 ? 'second' : 'seconds'
    return `You are sending requests too quickly. Please wait ${retryAfter} ${unit} and retry.`
  }
  return baseMessages[code]
}

interface RecommendPayload {
  preference: string
  products: Product[]
  provider: ProviderId
  model: string
}

export async function requestRecommendations(
  payload: RecommendPayload,
  apiKey: string
): Promise<RecommendationResponse> {
  let response: Response

  try {
    response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-provider': payload.provider
      },
      body: JSON.stringify(payload)
    })
  } catch {
    throw new RecommendationRequestError('network', baseMessages.network)
  }

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    if (!response.ok) {
      throw new RecommendationRequestError('server', baseMessages.server)
    }
    throw new RecommendationRequestError('invalid_response', baseMessages.invalid_response)
  }

  if (!response.ok) {
    const code = resolveErrorCode(data)
    const retryAfter = resolveRetryAfter(data)
    throw new RecommendationRequestError(code, messageForCode(code, retryAfter), retryAfter)
  }

  if (!isRecommendationResponse(data)) {
    throw new RecommendationRequestError('invalid_response', baseMessages.invalid_response)
  }

  return data
}

function resolveErrorCode(data: unknown): RecommendationErrorCode {
  if (
    data &&
    typeof data === 'object' &&
    'code' in data &&
    typeof (data as { code: unknown }).code === 'string' &&
    (data as { code: string }).code in baseMessages
  ) {
    return (data as { code: RecommendationErrorCode }).code
  }
  return 'server'
}

function resolveRetryAfter(data: unknown): number | undefined {
  if (
    data &&
    typeof data === 'object' &&
    'retryAfter' in data &&
    typeof (data as { retryAfter: unknown }).retryAfter === 'number'
  ) {
    return (data as { retryAfter: number }).retryAfter
  }
  return undefined
}

function isRecommendationResponse(data: unknown): data is RecommendationResponse {
  if (!data || typeof data !== 'object') {
    return false
  }
  const value = data as { summary?: unknown; recommendations?: unknown }
  return typeof value.summary === 'string' && Array.isArray(value.recommendations)
}
