import type {
  Product,
  RecommendationErrorCode,
  RecommendationResponse
} from './types'

export class RecommendationRequestError extends Error {
  code: RecommendationErrorCode

  constructor(code: RecommendationErrorCode, message: string) {
    super(message)
    this.name = 'RecommendationRequestError'
    this.code = code
  }
}

const messages: Record<RecommendationErrorCode, string> = {
  empty_preference: 'Please describe what you are looking for first.',
  missing_key: 'Add your OpenAI API key to get recommendations.',
  invalid_key: 'That OpenAI API key was rejected. Please check it and try again.',
  rate_limit: 'Too many requests right now. Please wait a moment and retry.',
  quota: 'This key has no available quota. Check your OpenAI billing and try again.',
  network: 'We could not reach the recommendation service. Check your connection.',
  invalid_response: 'The AI returned an unexpected response. Please try again.',
  no_matches: 'No products in our catalog matched that request.',
  bad_request: 'The request was invalid. Please try again.',
  server: 'Something went wrong while generating recommendations.'
}

export function messageForCode(code: RecommendationErrorCode): string {
  return messages[code]
}

interface RecommendPayload {
  preference: string
  products: Product[]
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
        'x-openai-api-key': apiKey
      },
      body: JSON.stringify(payload)
    })
  } catch {
    throw new RecommendationRequestError('network', messages.network)
  }

  let data: unknown = null
  try {
    data = await response.json()
  } catch {
    if (!response.ok) {
      throw new RecommendationRequestError('server', messages.server)
    }
    throw new RecommendationRequestError('invalid_response', messages.invalid_response)
  }

  if (!response.ok) {
    const code = resolveErrorCode(data)
    throw new RecommendationRequestError(code, messageForCode(code))
  }

  if (!isRecommendationResponse(data)) {
    throw new RecommendationRequestError('invalid_response', messages.invalid_response)
  }

  return data
}

function resolveErrorCode(data: unknown): RecommendationErrorCode {
  if (
    data &&
    typeof data === 'object' &&
    'code' in data &&
    typeof (data as { code: unknown }).code === 'string' &&
    (data as { code: string }).code in messages
  ) {
    return (data as { code: RecommendationErrorCode }).code
  }
  return 'server'
}

function isRecommendationResponse(data: unknown): data is RecommendationResponse {
  if (!data || typeof data !== 'object') {
    return false
  }
  const value = data as { summary?: unknown; recommendations?: unknown }
  return (
    typeof value.summary === 'string' && Array.isArray(value.recommendations)
  )
}
