import type { VercelRequest, VercelResponse } from '@vercel/node'
import { generateRecommendations } from './recommend-core'

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const headerValue = req.headers['x-openai-api-key']
  const apiKey = (Array.isArray(headerValue) ? headerValue[0] : headerValue ?? '').trim()

  const result = await generateRecommendations({
    method: req.method ?? 'GET',
    apiKey,
    body: req.body
  })

  if (result.allow) {
    res.setHeader('Allow', result.allow)
  }
  res.status(result.status).json(result.body)
}
