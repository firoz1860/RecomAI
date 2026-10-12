# RecomAI project guide

RecomAI is a Vite plus React plus TypeScript single page app with one Vercel serverless function. It generates product suggestions from natural-language requests using a visitor-supplied provider key. The local catalog is browseable and sent as optional context, but generated recommendations are not restricted to it.

## Architecture

- Frontend state lives in React hooks. No global store.
- The catalog in src/data/products.ts is the single source of truth.
- The AI may return only ids present in the catalog. Unknown ids are dropped on the server and again on the client.
- The serverless route api/recommend.ts is stateless and never stores the key.
- Endpoint logic is shared in api/recommend-core.ts. The Vercel function and a Vite middleware both call it, so npm run dev and npm run preview serve the real recommendation flow locally.

## Conventions

- TypeScript strict mode. Keep components small and focused.
- No explanatory comments in source files.
- Do not hardcode or commit any OpenAI key.
- The key is sent only in the x-openai-api-key header, never in a URL, a response or logs.
- The key is kept in memory by default and in sessionStorage only when the visitor opts in. localStorage is never used for the key.

## Commands

- npm run dev
- npm run build
- npm run preview
- npm run lint
- npm run typecheck

## Verification before done

Run typecheck, lint and build. Confirm no secret is present in the diff. Exercise the catalog, the key modal and the recommendation flow. The full AI flow runs under npm run dev with a real key, and also on a Vercel deployment.
