import type { VercelRequest, VercelResponse } from '@vercel/node'
import { generateRecommendations } from './recommend-core'

function readHeader(req: VercelRequest, name: string): string {
  const value = req.headers[name]
  return (Array.isArray(value) ? value[0] : value ?? '').trim()
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const apiKey = readHeader(req, 'x-api-key') || readHeader(req, 'x-openai-api-key')
  const provider = readHeader(req, 'x-provider')
  const bodyProvider =
    req.body && typeof req.body === 'object' && typeof (req.body as { provider?: unknown }).provider === 'string'
      ? (req.body as { provider: string }).provider
      : ''

  const result = await generateRecommendations({
    method: req.method ?? 'GET',
    apiKey,
    provider: provider || bodyProvider,
    body: req.body
  })

  if (result.allow) {
    res.setHeader('Allow', result.allow)
  }
  res.status(result.status).json(result.body)
}
