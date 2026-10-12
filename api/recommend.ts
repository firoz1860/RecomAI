import type { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'

type ErrorCode =
  | 'empty_preference'
  | 'missing_key'
  | 'invalid_key'
  | 'rate_limit'
  | 'quota'
  | 'network'
  | 'invalid_response'
  | 'bad_request'
  | 'server'

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

function fail(res: VercelResponse, status: number, code: ErrorCode, error: string): void {
  res.status(status).json({ code, error })
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

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    fail(res, 405, 'bad_request', 'Method not allowed.')
    return
  }

  const headerValue = req.headers['x-openai-api-key']
  const apiKey = (Array.isArray(headerValue) ? headerValue[0] : headerValue ?? '').trim()
  if (!apiKey) {
    fail(res, 401, 'missing_key', 'An OpenAI API key is required.')
    return
  }

  const body = (req.body ?? {}) as Record<string, unknown>
  const preference = typeof body.preference === 'string' ? body.preference.trim() : ''
  const rawProducts = Array.isArray(body.products) ? body.products : null

  if (!rawProducts) {
    fail(res, 400, 'bad_request', 'A product catalog is required.')
    return
  }
  if (!preference) {
    fail(res, 400, 'empty_preference', 'A preference description is required.')
    return
  }

  const catalog = rawProducts.map(toCatalogItem).filter((item): item is CatalogItem => item !== null)
  if (catalog.length === 0) {
    fail(res, 400, 'bad_request', 'The product catalog was empty or invalid.')
    return
  }

  const validIds = new Set(catalog.map((item) => item.id))
  const model = process.env.RECOMAI_OPENAI_MODEL || 'gpt-4o-mini'

  try {
    const client = new OpenAI({ apiKey })
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
      fail(res, 502, 'invalid_response', 'The AI returned an empty response.')
      return
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      fail(res, 502, 'invalid_response', 'The AI returned malformed data.')
      return
    }

    const recommendations = normalize(parsed, validIds)
    const summary =
      parsed && typeof parsed === 'object' && typeof (parsed as { summary?: unknown }).summary === 'string'
        ? (parsed as { summary: string }).summary
        : 'Here are the products that best match your request.'

    res.status(200).json({ summary, recommendations })
  } catch (error) {
    handleOpenAiError(res, error)
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

function handleOpenAiError(res: VercelResponse, error: unknown): void {
  const status = typeof (error as { status?: unknown })?.status === 'number' ? (error as { status: number }).status : 0
  const code = (error as { code?: unknown })?.code
  if (status === 401) {
    fail(res, 401, 'invalid_key', 'The provided OpenAI API key was rejected.')
    return
  }
  if (status === 429) {
    if (code === 'insufficient_quota') {
      fail(res, 402, 'quota', 'The OpenAI key has no available quota.')
      return
    }
    fail(res, 429, 'rate_limit', 'The request was rate limited. Please retry shortly.')
    return
  }
  if (status >= 500 || status === 0) {
    fail(res, 502, 'network', 'The recommendation service is temporarily unavailable.')
    return
  }
  fail(res, 500, 'server', 'The recommendation request could not be completed.')
}
