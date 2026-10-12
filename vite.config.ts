import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { generateRecommendations } from './api/recommend-core'

function headerValue(req: IncomingMessage, name: string): string {
  const value = req.headers[name]
  return (Array.isArray(value) ? value[0] : value ?? '').toString().trim()
}

function recommendApiPlugin(): Plugin {
  const middleware = async (req: IncomingMessage, res: ServerResponse) => {
    const chunks: Buffer[] = []
    for await (const chunk of req) {
      chunks.push(chunk as Buffer)
    }
    const raw = Buffer.concat(chunks).toString('utf8')
    let parsed: unknown = null
    if (raw) {
      try {
        parsed = JSON.parse(raw)
      } catch {
        parsed = null
      }
    }

    const apiKey = headerValue(req, 'x-api-key') || headerValue(req, 'x-openai-api-key')
    const headerProvider = headerValue(req, 'x-provider')
    const bodyProvider =
      parsed && typeof parsed === 'object' && typeof (parsed as { provider?: unknown }).provider === 'string'
        ? (parsed as { provider: string }).provider
        : ''

    const result = await generateRecommendations({
      method: req.method ?? 'GET',
      apiKey,
      provider: headerProvider || bodyProvider,
      body: parsed
    })

    if (result.allow) {
      res.setHeader('Allow', result.allow)
    }
    res.statusCode = result.status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result.body))
  }

  return {
    name: 'recomai-recommend-api',
    configureServer(server) {
      server.middlewares.use('/api/recommend', middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/recommend', middleware)
    }
  }
}

export default defineConfig({
  plugins: [react(), recommendApiPlugin()],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
