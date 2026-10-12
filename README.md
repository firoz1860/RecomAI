# RecomAI

A polished React product recommendation app. It shows a fixed local product catalog and uses a visitor supplied OpenAI API key to recommend only products from that catalog based on natural language preferences such as "I want a phone under $500".

The catalog is the single source of truth. The AI may return only product ids that exist in the catalog, and the app discards anything it does not recognise before rendering.

## Stack

- Vite, React and TypeScript
- Tailwind CSS
- Vercel serverless function for the recommendation request
- OpenAI SDK on the server side only

## Features

- Responsive catalog of 22 fictional products across smartphones, laptops, headphones, smartwatches, tablets and accessories
- Natural language preference input with example prompt chips
- API key modal with a direct link to the official OpenAI key page, a password field with show and hide, and an optional remember for this tab control
- Search, category filter and sorting
- Product detail view
- Up to three recommendations with a match score and a reason
- Loading, empty and error states throughout
- Accessible dialogs, labels, focus states and reduced motion support

## Getting started

```
npm install
npm run dev
```

Open the local URL that Vite prints.

The recommendation request calls the serverless route at `api/recommend.ts`. In local development the same endpoint logic lives in `api/recommend-core.ts` and is served by a Vite middleware plugin, so `npm run dev` and `npm run preview` both run the full recommendation flow against OpenAI with your supplied key. In production on Vercel the `api/recommend.ts` function runs the identical core. No extra tooling is required for local testing.

## Scripts

- `npm run dev` start the dev server
- `npm run build` typecheck then build for production
- `npm run preview` preview the production build
- `npm run lint` run ESLint
- `npm run typecheck` run the TypeScript compiler with no emit

## How the API key is handled

- The key lives in React memory by default
- If the visitor selects remember for this tab, the key is written to sessionStorage only, and it clears when the tab closes
- localStorage is never used for the key
- The key is sent only in the `x-openai-api-key` request header to the serverless route
- The key never appears in a URL, in a server response, in logs or in the committed source

## Recommendation endpoint

`POST /api/recommend`

Request body:

```
{
  "preference": "I want a phone under $500",
  "products": []
}
```

The OpenAI key is passed in the `x-openai-api-key` header.

The server validates the body and the key, creates an OpenAI client for that request only, asks the model for structured JSON, then validates every returned id against the supplied catalog. Unknown ids are dropped, duplicate ids are removed, scores are clamped to the range 0 to 100, and at most three recommendations are returned.

Response shape:

```
{
  "summary": "These products best match your budget and priorities.",
  "recommendations": [
    { "productId": "phone01", "score": 96, "reason": "Strong battery life and comfortably below budget." }
  ]
}
```

## Deploying to Vercel

1. Push this project to a Git host or run the Vercel CLI from the project root
2. `vercel link` to connect a project
3. `vercel build` and `vercel deploy` to create a preview deployment
4. Promote to production from the Vercel dashboard after review

No server environment secret is required for the OpenAI key because the key is supplied per request by the visitor. The optional `RECOMAI_OPENAI_MODEL` variable overrides the model and defaults to `gpt-4o-mini`.

## Documentation

- `docs/architecture.md` system architecture and data flow
- `docs/development-plan.md` build plan and status

## AI providers

RecomAI works with several providers. Pick one in the API key modal and paste that provider's key. Groq, Google Gemini and OpenRouter offer free tiers, so you can use the app without adding billing.

| Provider | Default model | Free tier | Get a key |
| --- | --- | --- | --- |
| OpenAI | gpt-4o-mini | no | https://platform.openai.com/api-keys |
| Groq | llama-3.3-70b-versatile | yes | https://console.groq.com/keys |
| Google Gemini | gemini-1.5-flash | yes | https://aistudio.google.com/apikey |
| OpenRouter | openai/gpt-4o-mini | yes | https://openrouter.ai/keys |
| Anthropic Claude | claude-3-5-haiku-20241022 | no | https://console.anthropic.com/settings/keys |
| xAI Grok | grok-2-latest | no | https://console.x.ai |
| Mistral | mistral-small-latest | no | https://console.mistral.ai/api-keys |

The key you enter is sent only in the request header and is never stored on the server. It stays in memory, or in sessionStorage when you choose remember for this tab. The provider choice is stored in localStorage as a preference, and your saved search results are cached in localStorage. The key itself is never written to localStorage.

## Environment variables

No environment variable is required to run or deploy RecomAI, because the AI key is supplied by the visitor per request. The only optional variables override the default model for each provider:

```
RECOMAI_OPENAI_MODEL=gpt-4o-mini
RECOMAI_GROQ_MODEL=llama-3.3-70b-versatile
RECOMAI_GOOGLE_MODEL=gemini-1.5-flash
RECOMAI_OPENROUTER_MODEL=openai/gpt-4o-mini
RECOMAI_ANTHROPIC_MODEL=claude-3-5-haiku-20241022
RECOMAI_XAI_MODEL=grok-2-latest
RECOMAI_MISTRAL_MODEL=mistral-small-latest
```

## Free deployment on Vercel

The Vercel Hobby plan is free and runs both the static site and the serverless route.

Using the Vercel CLI:

```
npm install -g vercel
vercel login
vercel
```

Accept the detected settings (framework Vite, build command npm run build, output dist). The first run creates a preview URL. To publish to the production URL:

```
vercel --prod
```

No environment variable needs to be set for a working deployment. Add any RECOMAI_*_MODEL variable in the Vercel project settings only if you want to change a default model.
