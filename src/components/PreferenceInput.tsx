import { useId } from 'react'
import type { FormEvent } from 'react'
import { ArrowRightIcon, SparklesIcon } from './icons'

interface PreferenceInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
}

const chips = [
  'I want a phone under $500',
  'A coding laptop under $1000',
  'Noise cancelling travel headphones',
  'A fitness product',
  'A tablet for drawing'
]

export function PreferenceInput({ value, onChange, onSubmit, loading }: PreferenceInputProps) {
  const inputId = useId()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <label htmlFor={inputId} className="sr-only">
          Describe what you are looking for
        </label>
        <textarea
          id={inputId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault()
              onSubmit()
            }
          }}
          rows={3}
          placeholder="Describe what you need. For example, a phone under $500 with great battery life."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 pr-16 text-base text-slate-900 shadow-card transition placeholder:text-slate-400 focus-ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lift transition hover:bg-brand-700 focus-ring disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Get recommendations"
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            <ArrowRightIcon className="h-5 w-5" />
          )}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
          <SparklesIcon className="h-3.5 w-3.5" />
          Try
        </span>
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onChange(chip)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus-ring"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  )
}
