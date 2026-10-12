# Architecture

## Overview

RecomAI is a single page React application with one serverless function. The browser owns all UI state and the visitor OpenAI key. The serverless function is a thin, stateless proxy that validates input, calls OpenAI for one request, validates the output against the supplied catalog, and returns a clean result.

## Frontend

- Vite plus React plus TypeScript in strict mode
- Tailwind CSS for styling with a small brand token set
- State is held in React hooks. No global store is needed.

### Module layout

```
src/
  components/   presentational and interactive UI
  data/         the typed product catalog
  hooks/        useApiKey and useRecommendations
  lib/          types, utilities and the API client
  pages/        Home, the single page that composes everything
```

### Key UI modules

Header, Hero, PreferenceInput, ApiKeyModal, CategoryFilter, ProductGrid, ProductCard, ProductDetailModal, RecommendationResults, RecommendationCard, LoadingRecommendations and EmptyState. A shared Modal provides accessible dialog behaviour for the key and detail views.

## Data flow

1. The visitor types a preference and submits.
2. If the preference is empty the UI shows an inline message and stops.
3. If no key is present the API key modal opens and the request is queued.
4. Once a key is available the client posts the preference and the full catalog to `api/recommend` with the key in the `x-openai-api-key` header.
5. The server validates, calls OpenAI, validates the returned ids against the catalog, and returns a summary with up to three recommendations.
6. The client re validates the returned ids against the local catalog, resolves them to full product records, clamps scores, removes duplicates, caps the list at three, and renders.

## Deterministic validation

The app does not trust the model. Validation happens on both sides.

- Server: confirms each returned id exists in the supplied catalog, removes duplicates, clamps scores to 0 to 100, and caps the list at three.
- Client: repeats the id existence check against the local catalog, removes duplicates, clamps scores and caps the list. Product detail is rendered only from the local catalog, so a hallucinated product can never appear.

## Serverless and local development

The recommendation logic lives in one framework neutral module, `api/recommend-core.ts`, which exposes `generateRecommendations`. Two thin adapters call it:

- `api/recommend.ts` adapts the Vercel request and response and runs in production.
- A small Vite plugin in `vite.config.ts` adapts the Node request and response and serves the same route during `npm run dev` and `npm run preview`.

This keeps local and production behaviour identical and lets the full flow run locally without extra tooling. The OpenAI SDK is imported only by the core, so it never enters the client bundle.

## Security

- The OpenAI key is supplied by the visitor and used for a single request. It is never stored on the server.
- The key travels only in a request header, never in a URL, a response body or logs.
- The server returns user safe error messages with a stable code and never leaks stack traces or credentials.
- The client keeps the key in memory by default and in sessionStorage only when the visitor opts in.

## Error handling

The server maps failures to stable codes: missing_key, invalid_key, rate_limit, quota, network, invalid_response, empty_preference, bad_request and server. The client maps each code to a friendly message and surfaces a matching empty or error state. A no_matches state covers requests that cannot be satisfied by the catalog.
