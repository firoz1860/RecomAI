import { useEffect, useState } from 'react'
import { AlertIcon, ExternalLinkIcon, SearchIcon } from './icons'

interface EmptyStateProps {
  variant?: 'info' | 'error'
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  retryAfter?: number
}

const actionClass =
  'mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lift transition hover:bg-brand-700 focus-ring disabled:cursor-not-allowed disabled:opacity-60'

export function EmptyState({
  variant = 'info',
  title,
  message,
  actionLabel,
  onAction,
  actionHref,
  retryAfter
}: EmptyStateProps) {
  const isError = variant === 'error'
  const [remaining, setRemaining] = useState(typeof retryAfter === 'number' ? retryAfter : 0)

  useEffect(() => {
    setRemaining(typeof retryAfter === 'number' ? retryAfter : 0)
  }, [retryAfter])

  useEffect(() => {
    if (remaining <= 0) {
      return
    }
    const id = setTimeout(() => setRemaining((value) => (value > 0 ? value - 1 : 0)), 1000)
    return () => clearTimeout(id)
  }, [remaining])

  const waiting = remaining > 0
  const label = waiting ? `Retry in ${remaining}s` : actionLabel

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
      <span
        className={
          isError
            ? 'flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500'
            : 'flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400'
        }
      >
        {isError ? <AlertIcon className="h-6 w-6" /> : <SearchIcon className="h-6 w-6" />}
      </span>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">{message}</p>
      {actionLabel && actionHref && (
        <a href={actionHref} target="_blank" rel="noreferrer noopener" className={actionClass}>
          {actionLabel}
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      )}
      {actionLabel && !actionHref && onAction && (
        <button type="button" onClick={waiting ? undefined : onAction} disabled={waiting} className={actionClass}>
          {label}
        </button>
      )}
    </div>
  )
}
