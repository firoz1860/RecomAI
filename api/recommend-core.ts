import OpenAI from 'openai'

export type ErrorCode =
  | 'empty_preference'
  | 'missing_key'
  | 'invalid_key'
  | 'permission'
  | 'model'
  | 'rate_limit'
  | 'quota'
  | 'network'
  | 'invalid_response'
  | 'bad_request'
  | 'server'

export interface CoreInput {
  method: string
  apiKey: string
  body: unknown
}

export interface CoreResult {
  status: number
  body: Record<string, unknown>
  allow?: string
}

interface CatalogItem {
  id: string
  name: string
  brand: string
  category: string
  price: number
  rating: number
  description: string
  features: string[]
  tags: string[]
}

function toCatalogItem(value: unknown): CatalogItem | null {
  if (!value || typeof value !== 'object') {
    return null
  }
  const item = value as Record<string, unknown>
  if (typeof item.id !== 'string' || typeof item.name !== 'string') {
    return null
  }
  return {
    id: item.id,
    name: item.name,
    brand: typeof item.brand === 'string' ? item.brand : '',
    category: typeof item.category === 'string' ? item.category : '',
    price: typeof item.price === 'number' ? item.price : 0,
    rating: typeof item.rating === 'number' ? item.rating : 0,
    description: typeof item.description === 'string' ? item.description : '',
    features: Array.isArray(item.features) ? item.features.filter((f): f is string => typeof f === 'string') : [],
    tags: Array.isArray(item.tags) ? item.tags.filter((t): t is string => typeof t === 'string') : []
  }
}

function clampScore(value: unknown): number {
  const num = Number(value)
  if (!Number.isFinite(num)) {
    return 0
  }
  return Math.max(0, Math.min(100, Math.round(num)))
}

function errorResult(status: number, code: ErrorCode, error: string, retryAfter?: number): CoreResult {
  const body: Record<string, unknown> = { code, error }
  if (typeof retryAfter === 'number') {
    body.retryAfter = retryAfter
  }
  return { status, body }
}

export async function generateRecommendations({ method, apiKey, body }: CoreInput): Promise<CoreResult> {
  if (method !== 'POST') {
    return { status: 405, body: { code: 'bad_request', error: 'Method not allowed.' }, allow: 'POST' }
  }

  const key = apiKey.trim()
  if (!key) {
    return errorResult(401, 'missing_key', 'An OpenAI API key is required.')
  }

  const payload = (body ?? {}) as Record<string, unknown>
  const preference = typeof payload.preference === 'string' ? payload.preference.trim() : ''
  const rawProducts = Array.isArray(payload.products) ? payload.products : null

  if (!rawProducts) {
    return errorResult(400, 'bad_request', 'A product catalog is required.')
  }
  if (!preference) {
    return errorResult(400, 'empty_preference', 'A preference description is required.')
  }

  const catalog = rawProducts.map(toCatalogItem).filter((item): item is CatalogItem => item !== null)
  if (catalog.length === 0) {
    return errorResult(400, 'bad_request', 'The product catalog was empty or invalid.')
  }

  const validIds = new Set(catalog.map((item) => item.id))
  const model = process.env.RECOMAI_OPENAI_MODEL || 'gpt-4o-mini'

  try {
    const client = new OpenAI({ apiKey: key })
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a product recommendation engine. You may only recommend products from the provided catalog. ' +
            'Return strict JSON with the shape {"summary": string, "recommendations": [{"productId": string, "score": number, "reason": string}]}. ' +
            'Use only productId values that exist in the catalog. Return at most three recommendations ordered by best fit. ' +
            'Score is an integer from 0 to 100. If nothing fits, return an empty recommendations array.'
        },
        {
          role: 'user',
          content: JSON.stringify({ preference, catalog })
        }
      ]
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return errorResult(502, 'invalid_response', 'The AI returned an empty response.')
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      return errorResult(502, 'invalid_response', 'The AI returned malformed data.')
    }

    const recommendations = normalize(parsed, validIds)
    const summary =
      parsed && typeof parsed === 'object' && typeof (parsed as { summary?: unknown }).summary === 'string'
        ? (parsed as { summary: string }).summary
        : 'Here are the products that best match your request.'

    return { status: 200, body: { summary, recommendations } }
  } catch (error) {
    return mapOpenAiError(error)
  }
}

function normalize(
  parsed: unknown,
  validIds: Set<string>
): Array<{ productId: string; score: number; reason: string }> {
  if (!parsed || typeof parsed !== 'object') {
    return []
  }
  const list = (parsed as { recommendations?: unknown }).recommendations
  if (!Array.isArray(list)) {
    return []
  }
  const seen = new Set<string>()
  const output: Array<{ productId: string; score: number; reason: string }> = []
  for (const entry of list) {
    if (!entry || typeof entry !== 'object') {
      continue
    }
    const record = entry as Record<string, unknown>
    const productId = typeof record.productId === 'string' ? record.productId : ''
    if (!validIds.has(productId) || seen.has(productId)) {
      continue
    }
    seen.add(productId)
    output.push({
      productId,
      score: clampScore(record.score),
      reason: typeof record.reason === 'string' ? record.reason : ''
    })
    if (output.length === 3) {
      break
    }
  }
  return output
}

function readField(error: unknown, field: string): string {
  const source = error as Record<string, unknown> | null
  if (!source) {
    return ''
  }
  const direct = source[field]
  if (typeof direct === 'string') {
    return direct.toLowerCase()
  }
  const nested = source.error
  if (nested && typeof nested === 'object') {
    const value = (nested as Record<string, unknown>)[field]
    if (typeof value === 'string') {
      return value.toLowerCase()
    }
  }
  return ''
}

function parseRetryAfter(error: unknown): number | undefined {
  const source = error as { headers?: unknown } | null
  const headers = source?.headers
  if (!headers) {
    return undefined
  }
  let raw: string | null = null
  if (typeof (headers as { get?: unknown }).get === 'function') {
    raw = (headers as { get: (name: string) => string | null }).get('retry-after')
  } else if (typeof headers === 'object') {
    const value = (headers as Record<string, unknown>)['retry-after']
    raw = typeof value === 'string' ? value : null
  }
  if (!raw) {
    return undefined
  }
  const seconds = Number(raw)
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.ceil(seconds)
  }
  const dateMs = Date.parse(raw)
  if (!Number.isNaN(dateMs)) {
    const diff = Math.ceil((dateMs - Date.now()) / 1000)
    return diff > 0 ? diff : 0
  }
  return undefined
}

function mapOpenAiError(error: unknown): CoreResult {
  const status =
    typeof (error as { status?: unknown })?.status === 'number' ? (error as { status: number }).status : 0
  const signals = readField(error, 'code') + ' ' + readField(error, 'type') + ' ' + readField(error, 'message')

  if (signals.includes('insufficient_quota') || signals.includes('quota') || signals.includes('billing')) {
    return errorResult(
      402,
      'quota',
      'Your OpenAI account has no available quota. Add credits or billing in the OpenAI dashboard and try again.'
    )
  }

  if (status === 401 || signals.includes('invalid_api_key') || signals.includes('invalid api key')) {
    return errorResult(401, 'invalid_key', 'Your OpenAI API key was rejected. It may be incorrect, expired, or revoked.')
  }

  if (status === 403 || signals.includes('permission') || signals.includes('does not have access')) {
    return errorResult(403, 'permission', 'This API key does not have access to the required model.')
  }

  if (status === 404 || signals.includes('model_not_found') || signals.includes('does not exist')) {
    return errorResult(404, 'model', 'The configured model is not available for this key.')
  }

  if (status === 429) {
    return errorResult(429, 'rate_limit', 'You are sending requests too quickly.', parseRetryAfter(error))
  }

  if (status >= 500 || status === 0) {
    return errorResult(502, 'network', 'The recommendation service is temporarily unavailable.')
  }

  return errorResult(500, 'server', 'The recommendation request could not be completed.')
}
