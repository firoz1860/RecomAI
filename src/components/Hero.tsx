import { PreferenceInput } from './PreferenceInput'
import { SparklesIcon } from './icons'

interface HeroProps {
  preference: string
  onPreferenceChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
  hasKey: boolean
}

export function Hero({ preference, onPreferenceChange, onSubmit, loading, hasKey }: HeroProps) {
  return (
    <section className="relative overflow-hidden" id="top">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[-6rem] h-72 w-72 -translate-x-1/2 rounded-full bg-brand-200/50 blur-3xl" />
        <div className="absolute right-10 top-20 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-16 text-center sm:px-6 sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700">
          <SparklesIcon className="h-3.5 w-3.5" />
          AI product matching
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Find your perfect product
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          Describe what matters to you. AI will suggest products tailored to your needs, budget, and priorities.
        </p>
        <div className="mx-auto mt-8 max-w-2xl text-left">
          <PreferenceInput
            value={preference}
            onChange={onPreferenceChange}
            onSubmit={onSubmit}
            loading={loading}
          />
          {!hasKey && (
            <p className="mt-3 text-center text-xs text-slate-400">
              You will be asked for an AI provider API key. It stays in your browser and is sent only with your request.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
