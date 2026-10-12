# Development plan

## Goals

Build and verify a polished product recommendation app that recommends only products from a fixed local catalog, driven by a visitor supplied OpenAI key, with the recommendation request flowing through a Vercel serverless route.

## Phases

1. Project scaffold: Vite, React, TypeScript, Tailwind, ESLint and Vercel config. Done.
2. Domain model: typed catalog of 22 products and shared types. Done.
3. Serverless endpoint: validation, OpenAI call, deterministic output validation, stable error codes. Done.
4. State: useApiKey for key handling, useRecommendations for the request lifecycle. Done.
5. UI: header, hero, preference input, key modal, filters, grid, cards, detail view, recommendation views and all states. Done.
6. Verification: typecheck, lint, production build, browser checks and endpoint checks. Done.
7. Deployment: push to Vercel and verify the live URL. Pending, requires Vercel authentication in the environment.

## Verification status

- TypeScript typecheck: passing
- ESLint: passing with no warnings
- Production build: passing
- Browser checks via Playwright: catalog render, category filter, search, empty state, key modal, sessionStorage only storage, key sent in header not URL, graceful error state, product detail, mobile single column with no horizontal scroll
- Endpoint checks via a stubbed OpenAI client: method guard, missing key, invalid payload, empty preference, max three results, unknown id dropped, duplicate id dropped, score clamping, impossible request returns an empty list

## Remaining

- Vercel deployment and live URL verification. This step needs Vercel authentication that is not available in the current environment. Once credentials are present, run vercel link, vercel build and vercel deploy, then open the production URL and confirm page load and endpoint behaviour with a real key.
